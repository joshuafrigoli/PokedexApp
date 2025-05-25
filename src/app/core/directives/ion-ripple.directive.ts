import {
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appRipple], [appRippleType], [appRippleTW]',
  standalone: true,
})
export class IonRippleDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  readonly ripple = input(false, {
    alias: 'appRipple',
    transform: booleanAttribute,
  });
  readonly type = input<'bounded' | 'unbounded'>('bounded', {
    alias: 'appRippleType',
  });
  readonly tailwind = input(false, {
    alias: 'appRippleTW',
    transform: booleanAttribute,
  });

  constructor() {
    effect(() => {
      const element: HTMLElement = this.elementRef.nativeElement;
      const ripple = this.ripple();
      const type = this.type();
      const tailwind = this.tailwind();

      if (!ripple) return;

      if (tailwind) {
        this.renderer.addClass(element, 'relative');
        this.renderer.addClass(element, 'overflow-hidden');
      } else {
        this.renderer.setStyle(element, 'position', 'relative');
        this.renderer.setStyle(element, 'overflow', 'hidden');
      }
      this.renderer.addClass(element, 'ion-activatable');

      const rippleElement = this.renderer.createElement('ion-ripple-effect');
      this.renderer.setProperty(rippleElement, 'type', `${type}`);
      this.renderer.appendChild(element, rippleElement);
    });
  }
}
