import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LandingPage } from '../landing/landing';
import { CitizenLoginPage } from '../citizen-login/citizen-login';
import { MapPage } from '../map/map';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the LogoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private nativeStorage: NativeStorage,public platform: Platform) {
      platform.ready().then(() => {
        this.platform.registerBackButtonAction(() => {
          this.navCtrl.setRoot(MapPage);
        });
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutPage');
  }

  btnYes() {
    localStorage.clear();
    localStorage.setItem('phone', null);
    localStorage.setItem('password', null);
    //localStorage.setItem('rememberme', null);
    localStorage.setItem('isCitizenLogin', null);
    this.nativeStorage.clear();
    this.navCtrl.setRoot(LandingPage);
  }

  btnNo() {
    this.navCtrl.setRoot(MapPage);
  }

}
