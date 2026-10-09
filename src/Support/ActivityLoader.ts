import { LoadingController } from 'ionic-angular';
import {  Injectable } from '@angular/core';

@Injectable()
export class ActivityLoader {

    loader:any;
    
    constructor(public activityLoader: LoadingController) {}
    presentLoading() {
      this.loader = this.activityLoader.create({
        content: "Please wait...",
        duration: 50000,
        spinner: "circles",
        dismissOnPageChange: true, //dismiss can be also used
        cssClass: 'custom-loading-css'
      });
      this.loader.present();
    }
    
    dismissLodaing() {
      this.loader.dismiss();
    }
}