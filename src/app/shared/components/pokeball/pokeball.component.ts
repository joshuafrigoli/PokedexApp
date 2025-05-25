import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { TypeColorDirective } from 'src/app/core/directives/type-color.directive';

@Component({
  selector: 'app-pokeball',
  templateUrl: './pokeball.component.html',
  styleUrls: ['./pokeball.component.scss'],
  standalone: true,
  imports: [TypeColorDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokeballComponent {
  readonly type = input<string>('');
  readonly additionalClasses = input<string>('');
  readonly lightenPercentage = input<number>(20);

  readonly secondaryColor = computed(() => {
    const type = this.type();
    if (!type) return 'primary-color';
    if (type === 'contrast-color') return 'primary-color';
    return type;
  });
}
