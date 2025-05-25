import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { ToastButton, ToastOptions } from '@ionic/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ToastProvider {
  private readonly translateService = inject(TranslateService);
  private readonly toastCtrl = inject(ToastController);

  private closeButton: ToastButton = {
    text: this.translateService.instant('toast.button.cancel'),
    role: 'cancel',
  };

  private readonly defaultOptions: ToastOptions = {
    cssClass: 'custom-toast',
    duration: 5000,
    buttons: [this.closeButton],
  };

  private async open(options?: ToastOptions) {
    const toast = await this.toastCtrl.create({
      ...this.defaultOptions,
      ...options,
    });

    toast.present();
  }

  async openPokemonNotFound() {
    const message = this.translateService.instant(
      'toast.message.pokemon_not_found'
    );
    this.open({ message });
  }

  async close() {
    await this.toastCtrl.dismiss();
  }
}
