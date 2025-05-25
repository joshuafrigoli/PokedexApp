import { inject, Injectable, Type } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { ModalOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class ModalProvider {
  private readonly modalCtrl = inject(ModalController);

  private readonly defaultOptions: Partial<ModalOptions> = {
    cssClass: 'custom-modal',
  };

  async open<T>(
    component: Type<T>,
    inputData: any,
    options?: Partial<ModalOptions>
  ) {
    const modal = await this.modalCtrl.create({
      component,
      componentProps: {
        ...inputData,
        onClose: () => {
          this.close();
        },
      },
      ...this.defaultOptions,
      ...options,
    });

    modal.present();
  }

  async close() {
    await this.modalCtrl.dismiss();
  }
}
