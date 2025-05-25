import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
} from '@ionic/angular/standalone';
import { CustomPokemon } from '../../interfaces/pokemon/pokemon';
import { UndashPipe } from 'src/app/core/pipes/undash.pipe';
import { PokeballComponent } from '../pokeball/pokeball.component';
import { TypeColorDirective } from 'src/app/core/directives/type-color.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { IonRippleDirective } from 'src/app/core/directives/ion-ripple.directive';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardContent,
    UndashPipe,
    PokeballComponent,
    TypeColorDirective,
    TranslatePipe,
    IonRippleDirective,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly customPokemon = input.required<CustomPokemon>();

  readonly onCardClick = output<CustomPokemon['id']>();

  readonly lightenPercentage = computed(() => {
    const pokemon = this.customPokemon();
    if (!pokemon) return 0;
    return pokemon.types[0] === 'psychic' || pokemon.types[0] === 'dragon'
      ? 30
      : 15;
  });

  handleOnCardClick() {
    this.onCardClick.emit(this.customPokemon().id);
  }
}
