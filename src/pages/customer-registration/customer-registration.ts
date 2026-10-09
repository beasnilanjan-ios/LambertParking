import { Component } from '@angular/core';
import { MapPage } from './../map/map';
import { CitizenSignupModel, CitizenSignupResponseModel, VehicleArrayModel } from './../../Model/citizenSignup.model';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { ApiConstant } from '../../Support/ApiConstant';
import { NativeStorage } from '@ionic-native/native-storage';
import { Keyboard } from '@ionic-native/keyboard';
import { TermsNConditionsPage } from '../terms-n-conditions/terms-n-conditions';
import { CitizenLoginPage } from '../citizen-login/citizen-login';
import { TermsAndConditionsResponseModel } from '../../Model/termsAndConditions.model';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

/**
 * Generated class for the CustomerRegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-customer-registration',
  templateUrl: 'customer-registration.html',
})
export class CustomerRegistrationPage {


  dataToSend: CitizenSignupModel = {
    name: '',
    address: '',
    mobile_no: '',
    email: '',
    password: ''
  }
  response: CitizenSignupResponseModel;
  loader: any;
  boolOneTimeEntry: boolean;
  isSelectedTermsNCond: boolean = false;
  termsResponse: TermsAndConditionsResponseModel;
  termsDetail: string;

  constructor(private nativeStorage: NativeStorage, public navCtrl: NavController, 
    public navParams: NavParams, private alertCtrl: AlertController, public platform: Platform,
    public session: SessionManagerProvider, public activityLoader: LoadingController, 
    private keyboard: Keyboard, private iab: InAppBrowser) {
      platform.ready().then(() => {
        this.platform.registerBackButtonAction(() => {
          this.navCtrl.setRoot(CitizenLoginPage);
        });
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewProfilePage');
    //Activity loader init
    this.loader = this.activityLoader.create({
      content: "Loading...",
      // duration: 3000,
      spinner: "ios",
      dismissOnPageChange: true //dismiss can be also used
    });

    this.boolOneTimeEntry = false;
    this.getTermsAndConditions();
  }

  getTermsAndConditions(){
    //this.presentLoading();
    this.session.getTermsAndConditions(ApiConstant.MainApi + ApiConstant.TermsAndConditions).subscribe((res : TermsAndConditionsResponseModel) => {
      this.termsResponse = res;
      console.log("termsResponse data is::::"+JSON.stringify(this.termsResponse));
      if (this.termsResponse.status == "Success") {
        //this.dismissLodaing();
        this.termsDetail = this.termsResponse.message;
       console.log(this.termsDetail);
      }
      else {
        console.log(this.termsResponse.status);
        //this.dismissLodaing();
      }
    });
  }

  OpenBrowser() {
    console.log('in the browser function');
    console.log("this.termsDetails:::::"+this.termsDetail);
    const options: InAppBrowserOptions = {
      zoom: 'no',
      //hidden: 'no',
      //clearcache: 'yes',
      //clearsessioncache: 'yes',
      //toolbar: 'yes',
      mediaPlaybackRequiresUserAction: 'no',
      closebuttoncaption: 'Done'


    }

    // Opening a URL and returning an InAppBrowserObject
    
    const browser = this.iab.create(this.termsDetail,'_blank', options);
    browser.show();
  }

  signup() {
    //this.presentLoading();
    if (this.dataToSend.name.length > 0) {
      if (this.dataToSend.address.length > 0) {
        if (this.dataToSend.mobile_no.length > 0) {
          if (this.dataToSend.mobile_no.length == 10) {
            if (this.dataToSend.email.length > 0) {
              if (this.dataToSend.password.length > 0) {
              console.log("Signup details::::" + JSON.stringify(this.dataToSend));
              this.postCustomerInfo();

            }else {
              this.showAlert("Error", "Please enter password");
            }
          }else {
              this.showAlert("Error", "Please enter email id");
            }
          } else {
            this.showAlert("Error", "Mobile number must be 10 digit")
          }
        } else {
          this.showAlert("Error", "Please enter mobile number");
        }
      } else {
        this.showAlert("Error", "Please enter address");
      }
    } else {
      this.showAlert("Error", "Please enter name");
    }

    //this.dismissLodaing();
  }

  postCustomerInfo() {
    this.presentLoading();
    this.session.getCitizenSignup(ApiConstant.MainApi + ApiConstant.CitizenSignupApi, this.dataToSend).subscribe((res : CitizenSignupResponseModel) => {
      this.response = res;
      console.log("response data is::::"+JSON.stringify(this.response));
      if (this.response.status == "success") {
        this.dismissLodaing();
        const alert = this.alertCtrl.create({
          title: "Parking",
          subTitle: "Registration successful!",
          buttons: [
            {
              text: 'OK',
              handler: () =>{
                  this.navCtrl.push(CitizenLoginPage);
              }
            }
          ]
        });
        alert.present();

      }
      else {
        this.dismissLodaing();
        this.showAlert("Error", this.response.error);
      }
    });
  }


  //go to Terms and conditions page
  // goToTermsNCondPage() {
  //   this.navCtrl.push(TermsNConditionsPage);
  // }

  //Alert
  showAlert(title: string, msg: string) {
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
