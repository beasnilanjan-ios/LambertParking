import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { ParkingZonePage } from '../parking-zone/parking-zone';
import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { LoginModel, LoginResponseModel } from '../../Model/login.model';
import { NativeStorage } from '@ionic-native/native-storage';
import { ApiConstant } from '../../Support/ApiConstant';
import { Keyboard } from '@ionic-native/keyboard';
import { ActivityLoader } from '../../Support/ActivityLoader';
import { AlertCustom } from '../../Support/AlertCustom';
import { LandingPage } from '../landing/landing';
import { AttandantForgotPasswordPage } from '../attandant-forgot-password/attandant-forgot-password';

// @IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  data: LoginModel = {
    password: '',
    phone: '',
    //rememberMe: false
  }

  response: LoginResponseModel;
  loader: any;
  //isRememberMe: boolean = false;

  constructor(
    private nativeStorage: NativeStorage,
    public navCtrl: NavController,
    public navParams: NavParams,
    public session: SessionManagerProvider,
    public platform: Platform,
    private keyboard: Keyboard,
    private actLoader: ActivityLoader,
    private alertView: AlertCustom
  ) {
    platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        this.navCtrl.setRoot(LandingPage);
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  // Function

  login() {
    try {
      this.actLoader.presentLoading();
      if (this.data.phone.length > 0) {
        if (this.data.password.length > 0) {
          console.log("Username " + this.data.phone);
          this.session.getResponseLogin(this.data, ApiConstant.MainApi + ApiConstant.Login).subscribe((value: LoginResponseModel) => {
            this.response = value;
            console.log("Attendant login response::::" + JSON.stringify(this.response));
            this.actLoader.dismissLodaing();
            if (this.response.login_status == "success") {
              localStorage.setItem('attandantRememberme', "true");

              // Store Enable boom gate default value
              this.nativeStorage.setItem("EnableBoomGate", "Nil").then(
                () => console.error('stored enable boom gate!!!'),
                error => console.error('Error storing item', error)
              );
              //-------------------------      
              this.nativeStorage.setItem("DeviceConnected", "false").then(
                () => console.log("login stored!!!"),
                error => console.error('Error storing item', error)
              );
              //--------------------------
              // if (this.data.rememberMe === true) {
              //   localStorage.setItem('attandantRememberme', "true");
              //   localStorage.setItem('rememberme', "false");
              // } 
              //Store login details (normalize attendant user id for parking APIs)
              const loginDetail = Object.assign({}, this.response, {
                vender_user_id: this.response.vender_user_id || this.response.vendor_user_id
              });
              Promise.all([
                this.nativeStorage.setItem("NSUDloginDetail", loginDetail),
                this.nativeStorage.setItem("NSUDIsLoggedIn", "true")
              ]).then(() => {
                console.log("login stored!!!");
                this.navCtrl.push(ParkingZonePage, { loginDetail: loginDetail });
              }, error => {
                console.error('Error storing login item', error);
                this.navCtrl.push(ParkingZonePage, { loginDetail: loginDetail });
              });

            } else {
              this.alertView.showAlert("Parking", "No user found");
            }
            console.log(this.response.name);
          }, (error) => {
            this.actLoader.dismissLodaing();
            console.error("Login request failed", error);
            const status = error && error.status ? " (HTTP " + error.status + ")" : "";
            this.alertView.showAlert("Login failed", "Unable to reach the login service" + status + ". Check the server address and network connection.");
          });
        } else {
          this.alertView.showAlert("Error", "Please enter password");
        }
      } else {
        this.alertView.showAlert("Error", "Please enter mobile number");
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }

  forgotPassword() {
    this.navCtrl.push(AttandantForgotPasswordPage);
  }

  //Keyboard Function
  hideKeyboard() {
    this.keyboard.hide();
  }

}