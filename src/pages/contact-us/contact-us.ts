import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { ContactUsResponseModel } from '../../Model/contactUs.model';
import { ApiConstant } from '../../Support/ApiConstant';
import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { MapPage } from '../map/map';

/**
 * Generated class for the ContactUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {

  loader: any;
  response: ContactUsResponseModel;
  contactDetails: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
    public activityLoader: LoadingController, public session: SessionManagerProvider, 
    private iab: InAppBrowser, public platform: Platform,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactUsPage');
    this.loader = this.activityLoader.create({
      content: "Loading...",
      // duration: 3000,
      spinner: "ios",
      dismissOnPageChange: true //dismiss can be also used
    });

    this.getContactUsDetails();
  }

  getContactUsDetails() {
    this.presentLoading();
    this.session.getContactUsDetails(ApiConstant.MainApi + ApiConstant.LambertAddress).subscribe((res: ContactUsResponseModel) => {
      this.response = res;
      console.log("response data is::::" + JSON.stringify(this.response));
      if (this.response.status == "success") {
        this.dismissLodaing();
        this.contactDetails = this.response.message;
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

        const browser = this.iab.create(this.contactDetails, '_blank', options);
        browser.show();
        this.navCtrl.setRoot(MapPage);
       



      }
      else {
        this.dismissLodaing();
      }
    });
  }

  // OpenBrowser() {
  //   console.log('in the browser function');
  //   const options: InAppBrowserOptions = {
  //     zoom: 'no',
  //     //hidden: 'no',
  //     //clearcache: 'yes',
  //     //clearsessioncache: 'yes',
  //     //toolbar: 'yes',
  //     mediaPlaybackRequiresUserAction: 'no',
  //     closebuttoncaption: 'Done'


  //   }

  //   // Opening a URL and returning an InAppBrowserObject

  //   const browser = this.iab.create(this.contactDetails,'_blank', options);
  //   browser.show();
  // }

  // //Alert
  // showAlert(title:string, msg:string){
  //   const alert = this.alertCtrl.create({
  //     title: title,
  //     subTitle: msg,
  //     buttons: ['OK']
  //   });
  //   alert.present();
  // }

  //Activity Indicator
  presentLoading() {
    this.loader.present();
  }

  dismissLodaing() {
    this.loader.dismiss();
  }

}
