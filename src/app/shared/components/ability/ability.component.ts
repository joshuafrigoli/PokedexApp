import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { UndashPipe } from 'src/app/core/pipes/undash.pipe';

interface Ability {
  name: string;
  is_hidden: boolean;
  description: string;
}

@Component({
  selector: 'app-ability',
  templateUrl: './ability.component.html',
  styleUrls: ['./ability.component.scss'],
  standalone: true,
  imports: [UndashPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbilityComponent {
  @Input() ability?: Ability;
}
