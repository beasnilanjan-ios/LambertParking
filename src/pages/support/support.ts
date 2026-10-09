import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { MapPage } from '../map/map';

/**
 * Generated class for the SupportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
})
export class SupportPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public platform: Platform) {
      platform.ready().then(() => {
        this.platform.registerBackButtonAction(() => {
          this.navCtrl.setRoot(MapPage);
        });
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupportPage');
  }

}
