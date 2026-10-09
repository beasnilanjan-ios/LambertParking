import { Component } from '@angular/core';
import { MapPage } from './../map/map';
import { NewProfilePage } from '../new-profile/new-profile';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { CitizenLoginModel, CitizenLoginResponseModel, CitizenProfileModel } from '../../Model/citizenLogin.model';
import { ApiConstant } from '../../Support/ApiConstant';
import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { Keyboard } from '@ionic-native/keyboard';
import { NativeStorage } from '@ionic-native/native-storage';
import { CustomerRegistrationPage } from '../customer-registration/customer-registration';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { LandingPage } from '../landing/landing';

// @IonicPage()
@Component({
  selector: 'page-citizen-login',
  templateUrl: 'citizen-login.html',
})
export class CitizenLoginPage {

  loader: any;
  public loginBool: boolean = false;
  public signupBool: boolean = false;
  //isRememberMe: boolean = false;

  

  data:CitizenLoginModel = {
    phone:'',
    password: '',
    //rememberMe: false
  }

   response: CitizenLoginResponseModel;
   citizenProfile: CitizenProfileModel;

  constructor(private nativeStorage: NativeStorage, public navCtrl: NavController, 
    public navParams: NavParams, private alertCtrl: AlertController, public platform: Platform,
    public activityLoader: LoadingController, public session: SessionManagerProvider, 
    private keyboard: Keyboard) {
      platform.ready().then(() => {
        this.platform.registerBackButtonAction(() => {
          this.navCtrl.setRoot(LandingPage);
        });
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CitizenLoginPage');
    //Activity loader init
    this.loader = this.activityLoader.create({
      content: "Loading...",
      // duration: 3000,
      spinner: "ios",
      dismissOnPageChange: true //dismiss can be also used
    });
  }

  login(){
    console.log("Login info:::::"+JSON.stringify(this.data));
     //this.presentLoading();
    if (this.data.phone.length > 0) {
      if (this.data.phone.length == 10) {
        if (this.data.password.length > 0) {
          console.log("login details::::" + JSON.stringify(this.data));
          this.postLoginData();
        }
        else {
          this.showAlert("Error", "Please enter password");
        }
      }
      else {
        this.showAlert("Error", "Mobile number must be 10 digit")
      }
    }
    else {
          this.showAlert("Error", "Please enter mobile number");
        }
  }

  postLoginData(){

    this.presentLoading();
    this.session.getCitizenLogin(ApiConstant.MainApi + ApiConstant.CitizenLoginApi, this.data).subscribe((res : CitizenLoginResponseModel) => {
      this.response = res;
      console.log("response data is::::"+JSON.stringify(this.response));
      if (this.response.login_status == "success") {
        console.log("this.response.mobile_no::::"+this.response.mobile_no);
        // if (this.data.rememberMe === true) {
        //   localStorage.setItem('rememberme', "true");
        //   localStorage.setItem('attandantRememberme', "false");
        // }
         localStorage.setItem('phone', this.response.mobile_no);
         localStorage.setItem('password', this.data.password);
         localStorage.setItem('rememberme', "true");
         const citizenId = this.response.citizen_id
           || (this.response.citizen_profile && this.response.citizen_profile.citizen_id);
         if (citizenId) {
           localStorage.setItem('citizen_id', String(citizenId));
         }
         this.nativeStorage.setItem("CitizenIsLoggedIn","true").then(
          () => console.log("is logged in"),
         error => console.error('Error storing item', error)
        );
        this.dismissLodaing();
        // const alert = this.alertCtrl.create({
        //   title: "Parking",
        //   subTitle: "Login successful!",
        //   buttons: [
        //     {
        //       text: 'OK',
        //       handler: () =>{
                this.navCtrl.setRoot(MapPage);
        //       }
        //     }
        //   ]
        // });
        // alert.present();

      }
      else {
        this.dismissLodaing();
        this.showAlert("Parking", this.response.error)
      }
    });
  }

  //Signup
  newRegistration() {
    this.navCtrl.push(CustomerRegistrationPage);
  }

  forgotPassword(){
    this.navCtrl.push(ForgotPasswordPage);
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

  btnNo(){
    this.signupBool = true;
    this.loginBool = false;
  }
  btnYes(){
    this.signupBool = false;
    this.loginBool = true;
  }

  //Keyboard Function
  hideKeyboard() {
    this.keyboard.hide();
  }

}
