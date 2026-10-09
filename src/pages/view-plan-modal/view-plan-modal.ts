import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { ViewPlansArray } from '../../Model/parkingZone.model';
import { ParkingZonePage } from '../parking-zone/parking-zone';

/**
 * Generated class for the ViewPlanModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-view-plan-modal',
  templateUrl: 'view-plan-modal.html',
})
export class ViewPlanModalPage {

  viewPlanArray: ViewPlansArray
  vehicleType: string
  disclaimer: string

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public platform: Platform
    ) {
      platform.ready().then(() => {
        this.platform.registerBackButtonAction(() => {
          this.navCtrl.setRoot(ParkingZonePage);
        });
      });
      }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewPlanModalPage');
    this.vehicleType = this.navParams.get('vehicleType');
    this.viewPlanArray = this.navParams.get('viewPlanArray');
    this.disclaimer = this.navParams.get('disclaimer');
    console.log('got value---->'+JSON.stringify(this.viewPlanArray));
  }

  done() {
    this.viewCtrl.dismiss();
  }

}
