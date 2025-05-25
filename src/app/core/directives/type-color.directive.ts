import { DOCUMENT } from '@angular/common';
import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
} from '@angular/core';

type Percentage = number & { __brand: 'Percentage' };

function createPercentage(n: number): Percentage | 0 {
  return n >= 0 && n <= 100 ? (n as Percentage) : 0;
}

@Directive({
  selector:
    '[appTypeColor], [appTypeBackground], [appTypeLightenPercentage], [appTypeBorder], [appTypeProgressBar]',
  standalone: true,
})
export class TypeColorDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);

  readonly color = input<string>('secondary-color', { alias: 'appTypeColor' });
  readonly background = input<string>('primary-color', {
    alias: 'appTypeBackground',
  });
  readonly lightenPercentage = input<number>(0, {
    alias: 'appTypeLightenPercentage',
  });
  readonly border = input<string>('contrast-color', {
    alias: 'appTypeBorder',
  });
  readonly progressBar = input<string>('contrast-color', {
    alias: 'appTypeProgressBar',
  });

  readonly lighten = computed(() => createPercentage(this.lightenPercentage()));

  private hexToRgb(hex: string): number[] | null {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    if (hex.length !== 6) {
      return null;
    }
    return [
      parseInt(hex.substring(0, 2), 16),
      parseInt(hex.substring(2, 4), 16),
      parseInt(hex.substring(4, 6), 16),
    ];
  }

  private getComputedColor(colorVar: string): string {
    const computedStyle = getComputedStyle(document.documentElement);
    return computedStyle.getPropertyValue(`--${colorVar}`).trim();
  }

  private lightenColor(colorVar: string, percent: number): string {
    const baseColor = this.getComputedColor(colorVar);

    if (!baseColor) return '';

    if (/^rgb\(/.test(baseColor)) {
      const rgbValues = baseColor.match(/\d+/g)?.map(Number) || [];
      if (rgbValues.length === 3) {
        const lightened = rgbValues.map((n) =>
          Math.min(255, Math.round(n + n * (percent / 100)))
        );
        return `rgb(${lightened.join(', ')})`;
      }
    }

    if (/^#/.test(baseColor)) {
      const rgbValues = this.hexToRgb(baseColor);
      if (rgbValues) {
        const lightened = rgbValues.map((n) =>
          Math.min(255, Math.round(n + n * (percent / 100)))
        );
        return `rgb(${lightened.join(', ')})`;
      }
    }

    return baseColor;
  }

  constructor() {
    effect(() => {
      const colorVar = this.color() || 'secondary-color';
      const bgVar = this.background() || 'primary-color';
      const lighten = this.lighten();
      const borderVar = this.border();
      const progressBar = this.progressBar();
      const ionProgressBar = document.querySelector('ion-progress-bar');

      const lightenedBg = this.lightenColor(bgVar, lighten);

      this.renderer.setStyle(
        this.elementRef.nativeElement,
        'color',
        `var(--${colorVar})`
      );

      this.renderer.setStyle(
        this.elementRef.nativeElement,
        'background-color',
        lightenedBg || `var(--${bgVar})`
      );

      this.renderer.setStyle(
        this.elementRef.nativeElement,
        'border-color',
        `var(--${borderVar})`
      );

      if (progressBar !== 'contrast-color' && ionProgressBar) {
        this.document.getElementById('ion-progress-bar-style')?.remove();
        const style =
          this.document.getElementById('ion-progress-bar-style') ||
          this.renderer.createElement('style');
        style.setAttribute('id', 'ion-progress-bar-style');
        style.innerHTML = `
          ion-progress-bar {
            --background: var(--contrast-color);
            --progress-background: var(--${progressBar});
          }
        `;
        this.document.head.appendChild(style);
      }
    });
  }
}
