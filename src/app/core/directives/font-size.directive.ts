import {
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector:
    '[appMinFontSize], [appMaxFontSize], [appThreshold], [appUnitOfMeasurement]',
  standalone: true,
})
export class FontSizeDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  readonly min = input<number>(10, { alias: 'appMinFontSize' });
  readonly max = input<number>(20, { alias: 'appMaxFontSize' });
  readonly threshold = input<number>(20, { alias: 'appThreshold' });
  readonly unitOfMeasurement = input<string>('px', {
    alias: 'appUnitOfMeasurement',
  });

  private calculateFontSize(text: string): string {
    const newFontSize =
      text.length > this.threshold()
        ? Math.max(
            this.min(),
            this.max() - (text.length - Math.round(this.threshold() * 0.9))
          )
        : this.max();
    return `${newFontSize}${this.unitOfMeasurement()}`;
  }

  constructor() {
    effect(() => {
      const element: HTMLElement = this.elementRef.nativeElement;
      const content = element.textContent?.trim() || '';

      const newFontSize = this.calculateFontSize(content);
      this.renderer.setStyle(element, 'font-size', newFontSize);
    });
  }
}
