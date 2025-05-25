import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { UndashPipe } from 'src/app/core/pipes/undash.pipe';

interface SelectOptions {
  label?: string;
  fill?: 'outline' | 'solid';
  interface?: 'action-sheet' | 'alert' | 'modal' | 'popover';
  labelPlacement?: 'end' | 'fixed' | 'floating' | 'stacked' | 'start';
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  imports: [IonSelect, IonSelectOption, FormsModule, UndashPipe],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  readonly defaultOptions = signal<SelectOptions>({
    label: 'Label',
    fill: 'outline',
    interface: 'popover',
    labelPlacement: 'floating',
  });

  readonly selectInputOptions = input<SelectOptions>(this.defaultOptions(), {
    alias: 'selectOptions',
  });
  readonly selectOptions = computed(() => ({
    ...this.defaultOptions(),
    ...this.selectInputOptions(),
  }));
  readonly optionsArray = input.required<string[]>();

  readonly onSelectChange = output<string>();

  readonly selectedOption = model<string>();

  constructor() {
    effect(() => {
      const array = this.optionsArray();
      untracked(() => this.selectedOption.set(array[0]));
    });
  }

  handleSelectChange() {
    const selectedOption = this.selectedOption();
    if (!selectedOption) return;
    this.onSelectChange.emit(selectedOption);
  }
}
