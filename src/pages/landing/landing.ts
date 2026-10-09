import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Events, Platform, AlertController } from 'ionic-angular';
import { MapPage } from '../map/map';
import { LoginPage } from '../login/login';
import { CitizenLoginPage } from '../citizen-login/citizen-login';



// @IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  alertShown: boolean = false;
  isGuest: boolean = false;
  isCitizenLogin: boolean = false;
  isAttendantLogin: boolean = false;

  constructor(
    public modalCtrl: ModalController, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events,
    public platform: Platform,
    public alertCtrl: AlertController
    ) {
      platform.registerBackButtonAction(() => {
        if (this.alertShown == false) {
          this.presentConfirm();
        }
      }, 0)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandingPage');
   
  }

   //Ionic Back Button Confirm Before Exit
   presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Exit',
      message: 'Do you want Exit?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.alertShown = false;
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            //localStorage.clear();
            this.platform.exitApp();
          }
        }
      ]
    });
    alert.present().then(() => {
      this.alertShown = true;
    });
  }

  guestLogin(){
    this.isGuest = true;
    this.events.publish('guest:visited',   this.isGuest);
    this.navCtrl.setRoot(MapPage);

  }

  userLogin() {
    this.isGuest = false;
    this.isCitizenLogin = true;
    this.isAttendantLogin = false;
    this.events.publish('citizen:loggedin',   this.isCitizenLogin);
    //this.navCtrl.push(MapPage);
    this.navCtrl.push(CitizenLoginPage);
    
  }

  forAttendant(){
    this.isCitizenLogin = false;
    this.isAttendantLogin = true;
    this.events.publish('attendant:loggedin',   this.isAttendantLogin);
    this.navCtrl.push(LoginPage)
  }

}
