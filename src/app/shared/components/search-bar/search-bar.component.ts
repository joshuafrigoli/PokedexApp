import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonSearchbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  imports: [IonSearchbar, FormsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  readonly value = model('');
  readonly placeholder = input('');
  readonly debounceTime = input(200);
  readonly cssClass = input('');

  readonly onInput = output<string>();

  emitValue() {
    this.onInput.emit(this.value());
  }
}
