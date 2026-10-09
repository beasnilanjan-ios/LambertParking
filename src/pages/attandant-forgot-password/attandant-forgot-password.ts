import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { AttendantForgotPasswordModel, AttendantForgotPasswordResponseModel } from '../../Model/citizenLogin.model';
import { ApiConstant } from '../../Support/ApiConstant';
import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { Keyboard } from '@ionic-native/keyboard';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../login/login';

/**
 * Generated class for the AttandantForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-attandant-forgot-password',
  templateUrl: 'attandant-forgot-password.html',
})
export class AttandantForgotPasswordPage {

  loader: any;
  data:AttendantForgotPasswordModel = {
    phone:''
  }

   response: AttendantForgotPasswordResponseModel;

  constructor(private nativeStorage: NativeStorage, public navCtrl: NavController, 
    public navParams: NavParams, private alertCtrl: AlertController, 
    public activityLoader: LoadingController, public platform: Platform,
    public session: SessionManagerProvider, private keyboard: Keyboard) {
      platform.ready().then(() => {
        this.platform.registerBackButtonAction(() => {
          this.navCtrl.setRoot(LoginPage);
        });
      });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AttandantForgotPasswordPage');
     //Activity loader init
     this.loader = this.activityLoader.create({
      content: "Loading...",
      // duration: 3000,
      spinner: "ios",
      dismissOnPageChange: true //dismiss can be also used
    });
  }

  //post mobile number
  forgotPassword(){
    if (this.data.phone.length > 0) {
      if (this.data.phone.length == 10) {
        this.postForgotPasswordData();
      }
      else {
        this.showAlert("Error", "Mobile number must be 10 digit")
      }
    }
    else {
      this.showAlert("Error", "Please enter mobile number");
    }
  }
  postForgotPasswordData(){
    this.presentLoading();
    this.session.getAtendantForgotPassword(ApiConstant.MainApi + ApiConstant.AttendantForgotPasswordApi, this.data).subscribe((res : AttendantForgotPasswordResponseModel) => {
      this.response = res;
      console.log("response data is::::"+JSON.stringify(this.response));
      if (this.response.status == "success") {
        this.dismissLodaing();
        const alert = this.alertCtrl.create({
          title: "Parking",
          subTitle: this.response.message,
          buttons: [
            {
              text: 'OK',
              handler: () =>{
                this.navCtrl.setRoot(LoginPage);
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
