import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TypeColorDirective } from 'src/app/core/directives/type-color.directive';
import { UndashPipe } from 'src/app/core/pipes/undash.pipe';

interface Move {
  name: string;
  accuracy: number;
  type: string;
  power: number;
  pp: number;
  damage_class: string;
  level_learned_at: number;
  learn_method: string;
  description: string;
}

@Component({
  selector: 'app-move',
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.scss'],
  standalone: true,
  imports: [UndashPipe, TranslatePipe, TypeColorDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveComponent {
  @Input() move?: Move;

  readonly propertyNotFound = '--';
}
