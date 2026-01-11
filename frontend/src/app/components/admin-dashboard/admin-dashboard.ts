import { Component, OnInit, signal, computed, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Artwork } from '../../models/artwork';
import { ArtworkService } from '../../services/artwork.service';
import { RouterLink, Router } from '@angular/router';
import { ArtworkFormComponent } from '../artwork-form/artwork-form';
import { Chart, registerables } from 'chart.js';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Order, OrderService } from '../../services/order.service';
import { Message, MessageService } from '../../services/message.service';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  imports: [ArtworkFormComponent, CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  chart: Chart | null = null;

  // Message State
  messages = signal<Message[]>([]);
  activeTab: 'artworks' | 'orders' | 'messages' = 'artworks';

  // Artwork State
  artworks = signal<Artwork[]>([]);
  editingArtwork = signal<Artwork | null>(null);
  showArtworkForm = signal(false);

  // Order State
  orders = signal<Order[]>([]);
  showOrderForm = signal(false);
  editingOrder = signal<Order | null>(null);

  // Stats Computed
  totalRevenue = computed(() => this.orders()
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, order) => sum + (order.advanceAmount || 0), 0)
  );

  totalSalesValue = computed(() => this.orders()
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
  );

  pendingOrdersCount = computed(() => this.orders().filter(o => o.status === 'Pending').length);
  unreadMessagesCount = computed(() => this.messages().filter(m => !m.isRead).length);

  newOrder: Order = {
    clientName: '',
    contactInfo: '',
    artworkTitle: '',
    totalAmount: 0,
    advanceAmount: 0,
    status: 'Pending',
    notes: ''
  };

  constructor(
    private artworkService: ArtworkService,
    private orderService: OrderService,
    private messageService: MessageService,
    private router: Router
  ) { }

  logout() {
    localStorage.removeItem('admin_token');
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.loadArtworks();
    this.loadOrders();
    this.loadMessages();
  }

  ngAfterViewInit() {
    // Initial chart load handled by loadOrders
  }

  updateChart() {
    if (!this.revenueChartRef) return;

    const ctx = this.revenueChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    // Process real order data for 'Revenue' (Advance Amount of non-cancelled orders)
    // 1. Filter valid orders
    const validOrders = this.orders().filter(o => o.status !== 'Cancelled');

    // 2. Group by Month (Last 6 Months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const today = new Date();
    const last6Months = [];
    const revenueData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthIndex = d.getMonth();
      const year = d.getFullYear();
      last6Months.push(monthNames[monthIndex]);

      // Sum revenue for this month
      const monthlyRevenue = validOrders
        .filter(o => {
          const orderDate = new Date(o.createdAt || Date.now()); // Fallback to now if missing
          return orderDate.getMonth() === monthIndex && orderDate.getFullYear() === year;
        })
        .reduce((sum, o) => sum + (o.advanceAmount || 0), 0);

      revenueData.push(monthlyRevenue);
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: last6Months,
        datasets: [{
          label: 'Revenue',
          data: revenueData,
          borderColor: '#9333ea', // Purple-600
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              callback: function (value: any) {
                return '₹' + value;
              }
            }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // --- Message Methods ---
  loadMessages() {
    this.messageService.getMessages().subscribe(data => this.messages.set(data));
  }

  markAsRead(message: Message) {
    if (message.isRead) return;
    this.messageService.markAsRead(message._id).subscribe(updated => {
      // Update local state
      this.messages.update(msgs => msgs.map(m => m._id === updated._id ? updated : m));
    });
  }

  // --- Artwork Methods ---
  loadArtworks() {
    this.artworkService.getArtworks().subscribe(data => this.artworks.set(data));
  }
  // ... existing methods ...

  deleteArtwork(id: string | undefined) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this artwork?')) {
      this.artworkService.deleteArtwork(id).subscribe(() => this.loadArtworks());
    }
  }

  editArtwork(artwork: Artwork) {
    this.editingArtwork.set(artwork);
    this.showArtworkForm.set(true);
  }

  addNewArtwork() {
    this.editingArtwork.set(null);
    this.showArtworkForm.set(true);
  }

  onArtworkFormClose(refresh: boolean) {
    this.showArtworkForm.set(false);
    this.editingArtwork.set(null);
    if (refresh) this.loadArtworks();
  }

  // --- Order Methods ---
  loadOrders() {
    this.orderService.getOrders().subscribe(data => {
      this.orders.set(data);
      setTimeout(() => this.updateChart(), 100); // Small delay to ensure canvas is rendered
    });
  }

  saveOrder() {
    if (this.editingOrder()) {
      // Update
      const id = this.editingOrder()?._id;
      if (!id) return;
      this.orderService.updateOrder(id, this.newOrder).subscribe(() => {
        this.loadOrders();
        this.closeOrderForm();
      });
    } else {
      // Create
      this.orderService.createOrder(this.newOrder).subscribe(() => {
        this.loadOrders();
        this.closeOrderForm();
      });
    }
  }

  editOrder(order: Order) {
    this.editingOrder.set(order);
    this.newOrder = { ...order }; // Clone data to form
    this.showOrderForm.set(true);
  }

  deleteOrder(id: string | undefined) {
    if (!id) return;
    if (confirm('Delete this order record?')) {
      this.orderService.deleteOrder(id).subscribe(() => this.loadOrders());
    }
  }

  openNewOrderForm() {
    this.editingOrder.set(null);
    this.newOrder = {
      clientName: '',
      contactInfo: '',
      artworkTitle: '',
      totalAmount: 0,
      advanceAmount: 0,
      status: 'Pending',
      notes: ''
    };
    this.showOrderForm.set(true);
  }

  closeOrderForm() {
    this.showOrderForm.set(false);
    this.editingOrder.set(null);
  }

  generateInvoice(order: Order) {
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) return;

    const today = new Date().toLocaleDateString();

    const html = `
      <html>
      <head>
        <title>Invoice #${order._id?.slice(-6) || '0000'}</title>
        <style>
          body { font-family: 'Times New Roman', serif; padding: 40px; max-width: 800px; mx: auto; }
          .header { text-align: center; border-bottom: 2px solid black; padding-bottom: 20px; margin-bottom: 40px; }
          h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
          .meta { display: flex; justify-content: space-between; margin-bottom: 40px; font-family: sans-serif; font-size: 14px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          .table th { text-align: left; border-bottom: 1px solid #ddd; padding: 10px; font-size: 12px; text-transform: uppercase; }
          .table td { padding: 10px; border-bottom: 1px solid #eee; }
          .totals { text-align: right; }
          .totals div { margin-bottom: 5px; }
          .total { font-size: 18px; font-weight: bold; border-top: 1px solid black; padding-top: 10px; display: inline-block; }
          .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #666; font-family: sans-serif; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Art Gallery Invoice</h1>
          <p>Thank you for your business</p>
        </div>
        
        <div class="meta">
          <div>
            <strong>Billed To:</strong><br>
            ${order.clientName}<br>
            ${order.contactInfo}
          </div>
          <div style="text-align: right;">
            <strong>Invoice #:</strong> ${order._id?.slice(-6).toUpperCase()}<br>
            <strong>Date:</strong> ${today}<br>
            <strong>Status:</strong> ${order.status}
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Artwork: ${order.artworkTitle}</td>
              <td style="text-align: right;">₹${order.totalAmount}</td>
            </tr>
          </tbody>
        </table>

        <div class="totals">
          <div>Subtotal: ₹${order.totalAmount}</div>
          <div>Advance Paid: -₹${order.advanceAmount}</div>
          <div class="total">Balance Due: ₹${(order.totalAmount || 0) - (order.advanceAmount || 0)}</div>
        </div>

        <div class="footer">
          <p>This is a computer generated invoice.</p>
        </div>
        
        <script>window.print();</script>
      </body>
      </html>
    `;

    invoiceWindow.document.write(html);
    invoiceWindow.document.close();
  }
}
