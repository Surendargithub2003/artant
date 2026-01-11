import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-lightbox',
    standalone: true,
    imports: [CommonModule],
    animations: [
        trigger('fade', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('200ms ease-out', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ opacity: 0 }))
            ])
        ]),
        trigger('zoom', [
            transition(':enter', [
                style({ transform: 'scale(0.9)', opacity: 0 }),
                animate('300ms cubic-bezier(0.2, 0, 0, 1)', style({ transform: 'scale(1)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'scale(0.9)', opacity: 0 }))
            ])
        ])
    ],
    styles: [`
      .frame-container { transition: none !important; }
      .frame-black {
          padding: 16px; background-color: #1a1a1a !important;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 20px 50px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.5);
      }
      .frame-wood {
          padding: 20px; background-color: #5c4033 !important;
          background-image: linear-gradient(to right, #4a332a, #5c4033 10%, #6d4c3d 40%, #5c4033 60%, #4a332a) !important;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.2), 0 20px 50px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.6);
      }
      .frame-white {
          padding: 20px; background-color: #fdfdfd !important;
          box-shadow: 0 0 0 1px #e5e7eb, 0 20px 50px rgba(0,0,0,0.25), inset 0 0 15px rgba(0,0,0,0.05);
      }
      .mount-white { background-color: #ffffff !important; padding: 4px; box-shadow: inset 0 0 8px rgba(0,0,0,0.3); }
      .mount-wood { background-color: #fcfbf9 !important; padding: 4px; box-shadow: inset 0 0 8px rgba(0,0,0,0.3); }
      .mount-none { background-color: transparent !important; padding: 0; box-shadow: none; }
    `],
    template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
         @fade
         (click)="close.emit()">
      
      <!-- Close Button -->
      <button class="absolute top-6 right-6 text-white/50 hover:text-white transition-colors duration-200 z-50"
              (click)="close.emit()">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" 
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- Frame Controls (Bottom Fixed) -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 bg-black/50 backdrop-blur-md p-3 rounded-full border border-white/10" (click)="$event.stopPropagation()">
            <button (click)="setFrame('none')" 
                class="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/20 text-white"
                [class.bg-white]="currentFrame === 'none'" [class.text-black]="currentFrame === 'none'">
                None
            </button>
            <button (click)="setFrame('black')" 
                class="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/20 text-white"
                [class.bg-white]="currentFrame === 'black'" [class.text-black]="currentFrame === 'black'">
                Black
            </button>
            <button (click)="setFrame('wood')" 
                class="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/20 text-white"
                [class.bg-white]="currentFrame === 'wood'" [class.text-black]="currentFrame === 'wood'">
                Wood
            </button>
            <button (click)="setFrame('white')" 
                class="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/20 text-white"
                [class.bg-white]="currentFrame === 'white'" [class.text-black]="currentFrame === 'white'">
                White
            </button>
      </div>

      <!-- Image Container -->
      <div class="relative max-w-7xl max-h-[80vh] w-full flex flex-col items-center !transition-none" 
           @zoom 
           (click)="$event.stopPropagation()">
        
        <!-- Framed Wrapper -->
        <div class="relative frame-container"
             [ngClass]="{
                'frame-black': currentFrame === 'black',
                'frame-wood': currentFrame === 'wood',
                'frame-white': currentFrame === 'white'
             }">
             
             <!-- Inner Mount for Frames -->
             <div [ngClass]="{
                    'mount-white': currentFrame === 'black' || currentFrame === 'white',
                    'mount-wood': currentFrame === 'wood',
                    'mount-none': currentFrame === 'none'
                  }">
                <!-- Artwork -->
                <img [src]="imageSrc" [alt]="title" 
                     class="w-auto h-auto max-h-[70vh] max-w-full object-contain block"
                     [class.shadow-md]="currentFrame === 'none'">
             </div>

             <!-- Glass Reflection for Framed Art -->
             <div *ngIf="currentFrame !== 'none'" class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none mix-blend-overlay !transition-none"></div>
        </div>
             
        <div class="mt-8 text-center" [class.opacity-0]="currentFrame !== 'none'">
          <h3 class="text-white text-2xl font-serif font-light tracking-wide">{{ title }}</h3>
          <p class="text-gray-400 text-sm uppercase tracking-widest mt-2">{{ subtitle }}</p>
        </div>
      </div>
    </div>
  `
})
export class LightboxComponent {
    @Input() imageSrc: string = '';
    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Output() close = new EventEmitter<void>();

    currentFrame = 'none';

    setFrame(frame: string) {
        this.currentFrame = frame;
    }
}
