import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { ApiConstant } from '../../Support/ApiConstant';
import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { CitizenDeRegistrationModel, CitizenDeRegistrationResponseModel } from '../../Model/citizenSignup.model';
import { LandingPage } from '../landing/landing';
import { MapPage } from '../map/map';

/**
 * Generated class for the CustomerDeregistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-customer-deregistration',
  templateUrl: 'customer-deregistration.html',
})
export class CustomerDeregistrationPage {

  //citizen_id: string;
  loader: any;
  response: CitizenDeRegistrationResponseModel;

  data: CitizenDeRegistrationModel = {
    citizen_id: ''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController, public activityLoader: LoadingController,
    public session: SessionManagerProvider, public platform: Platform) {
    this.data.citizen_id = localStorage.getItem('citizen_id');
    console.log("this.data.citizen_id::::" + this.data.citizen_id);

    platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        this.navCtrl.setRoot(MapPage);
      });
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerDeregistrationPage');
    //Activity loader init
    this.loader = this.activityLoader.create({
      content: "Loading...",
      // duration: 3000,
      spinner: "ios",
      dismissOnPageChange: true //dismiss can be also used
    });


  }
  btnYes() {
    this.presentLoading();
    console.log("this.data in getCitizenDeRegistration()*****" + this.data)
    this.session.getCitizenDeRegistration(ApiConstant.MainApi + ApiConstant.CitizenDeRegistrationApi, this.data).subscribe((res: CitizenDeRegistrationResponseModel) => {
      this.response = res;
      console.log("response data is::::" + JSON.stringify(this.response));
      if (this.response.status == "success") {
        this.dismissLodaing();
        const alert = this.alertCtrl.create({
          title: "Parking",
          subTitle: this.response.message,
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.navCtrl.setRoot(LandingPage);
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

  btnNo() {
    this.navCtrl.setRoot(MapPage);
  }

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

}
