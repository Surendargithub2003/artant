import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArtworkService } from '../../services/artwork.service';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './contact.html',
})
export class ContactComponent {
    formData = {
        name: '',
        email: '',
        message: ''
    };
    isSending = false;

    constructor(
        private artworkService: ArtworkService,
        private toast: ToastService
    ) { }

    submitForm() {
        if (!this.formData.name || !this.formData.email || !this.formData.message) {
            this.toast.show('Please fill in all fields.', 'error');
            return;
        }

        this.isSending = true;
        this.artworkService.sendInquiry(this.formData).subscribe({
            next: () => {
                this.toast.show('Message sent successfully!', 'success');
                this.isSending = false;
                this.formData = { name: '', email: '', message: '' };
            },
            error: (err) => {
                console.error(err);
                this.toast.show('Failed to send message. Please try WhatsApp.', 'error');
                this.isSending = false;
            }
        });
    }

    openWhatsApp() {
        const phoneNumber = '918667886018';
        const message = "Hello! I'd like to get in touch regarding ArtMarket.";
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    }
}
