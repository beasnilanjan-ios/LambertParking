import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { CitizenChangePasswordResponseModel, ChangePasswordModel } from '../../Model/citizenLogin.model';
import { Keyboard } from '@ionic-native/keyboard';
import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { ApiConstant } from '../../Support/ApiConstant';
import { MapPage } from './../map/map';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  data:ChangePasswordModel = {
    phone:'',
    oldPassword:'',
    password:'',
    confirmPassword:''
  }
  oldPwd: string;
  phone: string;
  loader: any;
  response: CitizenChangePasswordResponseModel;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private keyboard: Keyboard, public activityLoader: LoadingController, 
    public platform: Platform,
    private alertCtrl: AlertController, public session: SessionManagerProvider) {
    this.oldPwd = localStorage.getItem('password');
    console.log("this.oldPassword:::::"+this.oldPwd);
    this.data.phone = localStorage.getItem('phone');
    console.log("this.phone:::::"+this.data.phone);

    platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        this.navCtrl.setRoot(MapPage);
      });
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
    //Activity loader init
    this.loader = this.activityLoader.create({
      content: "Loading...",
      // duration: 3000,
      spinner: "ios",
      dismissOnPageChange: true //dismiss can be also used
    });
  }
  
  changePassword(){
    console.log("this.data"+JSON.stringify(this.data));
    if (this.data.oldPassword.length > 0) {
      if (this.data.oldPassword === this.oldPwd) {
        if (this.data.password.length > 0) {
          if (this.data.confirmPassword.length > 0) {
            if (this.data.password == this.data.confirmPassword) {
              this.postChangedPassword();
            }
            else {
              this.showAlert("Error", "Your password and confirm password do not match.");
            }
  
          }
          else {
            this.showAlert("Error", "Please enter confirm password");
          }
  
        }
        else {
          this.showAlert("Error", "Please enter new password");
        }
      }
      else {
        this.showAlert("Error", "THis is not your old password! Please enter your correct old password.");
      }
    }
    else {
      this.showAlert("Error", "Please enter old password");
    }
  }

  postChangedPassword(){
    this.presentLoading();
    this.session.postCitizenChangePassword(ApiConstant.MainApi + ApiConstant.CitizenChangePasswordApi, this.data).subscribe((res : CitizenChangePasswordResponseModel) => {
      this.response = res;
      console.log("response data is::::"+JSON.stringify(this.response));
      if (this.response.status === "success") {
        this.dismissLodaing();
        const alert = this.alertCtrl.create({
          title: "Parking",
          subTitle: this.response.message,
          buttons: [
            {
              text: 'OK',
              handler: () =>{
                this.navCtrl.setRoot(MapPage);
              }
            }
          ]
        });
        alert.present();

      }
      else {
        this.dismissLodaing();
        this.showAlert("Error", this.response.message)
      }
    });
  }


   //Alert
   showAlert(title:string, msg:string){
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  //Activity Indicator
  presentLoading() {
    this.loader.present();
  }

  dismissLodaing() {
  this.loader.dismiss();
  }

  //Keyboard Function
  hideKeyboard() {
    this.keyboard.hide();
  }

}

