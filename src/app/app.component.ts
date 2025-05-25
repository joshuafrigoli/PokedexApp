import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  arrowUp,
  barbell,
  barcode,
  chevronBackOutline,
  chevronForwardOutline,
  close,
  egg,
  female,
  heart,
  heartOutline,
  male,
  menu,
  pause,
  person,
  play,
  school,
  star,
  starOutline,
} from 'ionicons/icons';
import { SettingsService } from './core/services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly translateService = inject(TranslateService);
  private readonly settingService = inject(SettingsService);

  constructor() {
    this.initializeApp();

    addIcons({
      person,
      close,
      play,
      menu,
      pause,
      star,
      male,
      female,
      egg,
      school,
      starOutline,
      arrowUp,
      heart,
      barcode,
      barbell,
      heartOutline,
      chevronBackOutline,
      chevronForwardOutline,
    });
  }

  initializeApp() {
    const locale = navigator.language;
    if (locale.startsWith('it')) {
      this.translateService.setDefaultLang('it');
      this.translateService.use('it');
    }
    if (locale.startsWith('en')) {
      this.translateService.setDefaultLang('en');
      this.translateService.use('en');
    }
    this.settingService.setLanguage(locale);
  }
}
