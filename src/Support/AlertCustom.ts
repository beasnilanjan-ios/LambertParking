import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()

export class AlertCustom {

    public toast = null;

    constructor(public alertCtrl: AlertController, private toastCtrl: ToastController) { }

    showAlert(title: string, message: string) {
        let confirm = this.alertCtrl.create({
            title: title,
            message: message,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: "OK",
                    handler: () => {
                        console.log('OK clicked');
                    }
                }
            ]
        });
        confirm.present();
    }

    showToast(message, position) {
        if (this.toast) {
            this.toast.dismiss();
            this.toast = null;
        }
        this.toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: position
        });
        this.toast.present();
    }

}