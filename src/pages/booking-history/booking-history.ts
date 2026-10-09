import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { MapPage } from '../map/map';

/**
 * Generated class for the BookingHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-booking-history',
  templateUrl: 'booking-history.html',
})
export class BookingHistoryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, platform: Platform) {
    platform.registerBackButtonAction(() => { 
      this.navCtrl.setRoot(MapPage);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingHistoryPage');
  }

}
