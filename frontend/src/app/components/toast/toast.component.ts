import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed top-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="pointer-events-auto min-w-[300px] p-4 rounded-lg shadow-lg backdrop-blur-md border animate-fade-in-right transition-all transform hover:scale-102 cursor-pointer"
             [ngClass]="{
               'bg-white/90 border-green-200 text-green-800': toast.type === 'success',
               'bg-white/90 border-red-200 text-red-800': toast.type === 'error',
               'bg-white/90 border-blue-200 text-blue-800': toast.type === 'info'
             }"
             (click)="toastService.remove(toast.id)">
          <div class="flex items-center gap-3">
            @if (toast.type === 'success') {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            } @else if (toast.type === 'error') {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            } @else {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            }
            <p class="text-sm font-medium pr-4">{{ toast.message }}</p>
          </div>
        </div>
      }
    </div>
  `,
    styles: [`
    @keyframes fadeInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .animate-fade-in-right {
      animation: fadeInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `]
})
export class ToastComponent {
    constructor(public toastService: ToastService) { }
}
