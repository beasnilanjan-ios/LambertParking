
import { IonicPage, NavController, NavParams, AlertController, LoadingController  } from 'ionic-angular';
import { Component } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ApiConstant } from '../../Support/ApiConstant';
import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { TermsAndConditionsResponseModel } from '../../Model/termsAndConditions.model';

/**
 * Generated class for the TermsNConditionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-terms-n-conditions',
  templateUrl: 'terms-n-conditions.html',
})
export class TermsNConditionsPage {

  loader: any;
  response: TermsAndConditionsResponseModel;
  termsDetail: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, 
    public activityLoader: LoadingController, public session: SessionManagerProvider, private iab: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsNConditionsPage');
    this.loader = this.activityLoader.create({
      content: "Loading...",
      // duration: 3000,
      spinner: "ios",
      dismissOnPageChange: true //dismiss can be also used
    });

    this.getTermsAndConditions();
  }

  getTermsAndConditions(){
    //this.presentLoading();
    this.session.getTermsAndConditions(ApiConstant.MainApi + ApiConstant.TermsAndConditions).subscribe((res : TermsAndConditionsResponseModel) => {
      this.response = res;
      console.log("response data is::::"+JSON.stringify(this.response));
      if (this.response.status == "Success") {
        //this.dismissLodaing();
        this.termsDetail = this.response.message;
       console.log(this.termsDetail);
      }
      else {
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
