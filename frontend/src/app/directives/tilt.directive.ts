import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appTilt]',
    standalone: true
})
export class TiltDirective {
    constructor(private el: ElementRef, private renderer: Renderer2) { }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        const el = this.el.nativeElement;
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Calculate rotation (-15 to 15 degrees)
        const xRotation = -1 * ((y - rect.height / 2) / rect.height * 20);
        const yRotation = (x - rect.width / 2) / rect.width * 20;

        this.renderer.setStyle(el, 'transform', `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.02)`);
        this.renderer.setStyle(el, 'transition', 'transform 0.1s ease-out');
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        const el = this.el.nativeElement;
        this.renderer.setStyle(el, 'transform', 'perspective(1000px) rotateX(0) rotateY(0) scale(1)');
        this.renderer.setStyle(el, 'transition', 'transform 0.5s ease-out');
    }
}
