import { Nav, Platform, MenuController, AlertController, Events } from 'ionic-angular';
import { ParkingZonePage } from './../pages/parking-zone/parking-zone';
import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

import { LandingPage } from '../pages/landing/landing';
import { NativeStorage } from '@ionic-native/native-storage';
import { CustomerDeregistrationPage } from './../pages/customer-deregistration/customer-deregistration';
import { ChangePasswordPage } from './../pages/change-password/change-password';
import { SupportPage } from './../pages/support/support';
import { LogoutPage } from './../pages/logout/logout';
import { CouponsPage } from './../pages/coupons/coupons';
import { MapPage } from './../pages/map/map';
import { CitizenParkingHistoryPage } from './../pages/citizen-parking-history/citizen-parking-history';

import { ContactUsResponseModel } from '../Model/contactUs.model';
import { TermsAndConditionsResponseModel } from '../Model/termsAndConditions.model';

import { ApiConstant } from '../Support/ApiConstant';
import { SessionManagerProvider } from '../providers/session-manager/session-manager';


@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // rootPage:any = LandingPage;
  alertShown: boolean = false;
  rootPage: any;
  response: ContactUsResponseModel;
  contactDetails: string;
  termsResponse: TermsAndConditionsResponseModel;
  termsDetail: string;
  isGuest: boolean = false;
  isCitizenLogin: boolean = false;
  isCitizen: string;
  isAttendantLogin: boolean = false;
  rememberMe = localStorage.getItem('rememberme');
  attandantRememberme = localStorage.getItem('attandantRememberme');

  pages: Array<{ title: string, component: any, icon: string }>;

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private nativeStorage: NativeStorage, public menu: MenuController, 
    public session: SessionManagerProvider, public alertCtrl: AlertController,
    private iab: InAppBrowser, public events: Events) {

    platform.pause.subscribe(() => {      
      console.log("App terminated-------->");
      this.nativeStorage.setItem("DeviceConnected","false").then(
        () => console.log("login stored!!!"),
       error => console.error('Error storing item', error)
      );
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();      
      splashScreen.hide();
      //=-=-==-=-=-=-Page entry=-=-=-=-=-=-=-=
      // platform.registerBackButtonAction(() => { 
      //   console.log("BackButton clicked::::");
      // }); 

      console.log("this.isCitizenLogin:::::" + this.isCitizenLogin);
      console.log("this.isAttendantLogin:::::" + this.isAttendantLogin);

      // if(!this.isCitizenLogin && !this.isAttendantLogin){
      //   this.rootPage = LandingPage;
      // }

      this.events.subscribe('attendant:loggedin', (attendant) => {
        console.log("attendant*****#####" + attendant);
        this.isAttendantLogin = attendant;
      });

      this.events.subscribe('citizen:loggedin', (citizen) => {
        console.log("citizen*****#####" + citizen);
        this.isCitizenLogin = citizen;
        // if(this.isCitizenLogin){
        //   this.isCitizen = "true";
        //   console.log("this.isCitizen in if::::"+this.isCitizen);
        //   localStorage.setItem('isCitizenLogin', this.isCitizen);
        // }
        // else{
        //   this.isCitizen = "false";
        //   console.log("this.isCitizen in else::::"+this.isCitizen);
        //   localStorage.setItem('isCitizenLogin', this.isCitizen);
        // }
      });


      if (this.attandantRememberme === 'true') {
        localStorage.setItem('rememberme', "false");
        this.nativeStorage.getItem('NSUDIsLoggedIn').then(
          data => {
            console.log('My value:::::' + data);
            if (data === "") {
              this.rootPage = LandingPage;
            } else if (data === "true") {
              this.isCitizenLogin = false;
              this.rootPage = ParkingZonePage;
            } else {
              this.rootPage = LandingPage;
            }
          },
          error => {
            console.error('Attendant Error**** ' + error)
            this.rootPage = LandingPage;
          }
        );
      } else if (this.rememberMe === 'true') {
        localStorage.setItem('attandantRememberme', "false");
        this.nativeStorage.getItem('CitizenIsLoggedIn').then(
          data => {
            console.log('My Citizen value:::::' + data)
            if (data === "") {
              this.rootPage = LandingPage;
            } else if (data === "true") {
              this.isAttendantLogin = false;
              //this.isCitizen = "true";
              //console.log("this.isCitizen*****"+this.isCitizen);
              this.rootPage = MapPage;
              this.pages = [
                { title: 'Home', component: MapPage, icon: "menu_home" },
                { title: 'De-registration', component: CustomerDeregistrationPage, icon: "menu_deregistration" },
                { title: 'Coupons', component: CouponsPage, icon: "menu_coupons" },
                { title: 'Booking History', component: CitizenParkingHistoryPage, icon: "menu_booking_history" },
                { title: 'Contact Us', component: MapPage, icon: "menu_contact_us" },
                { title: 'Support', component: SupportPage, icon: "menu_support" },
                { title: 'Terms & Conditions', component: MapPage, icon: "menu_termsncondn" },
                { title: 'Change Password', component: ChangePasswordPage, icon: "menu_change_password" },
                { title: 'Logout', component: LogoutPage, icon: "menu_logout" }
              ];

            } else {
              this.rootPage = LandingPage;
            }
          },
          error => {
            console.error('Citizen Error**** ' + error)
            this.rootPage = LandingPage;
          }
        );
      } else {
        this.rootPage = LandingPage;
      }

      

      platform.registerBackButtonAction(() => {
        if (this.alertShown == false) {
          this.presentConfirm();
        }
      }, 0)
    });


    this.session.getContactUsDetails(ApiConstant.MainApi + ApiConstant.LambertAddress).subscribe((res: ContactUsResponseModel) => {
      this.response = res;
      console.log("response data of contact details is::::" + JSON.stringify(this.response));
      if (this.response.status == "success") {
        this.contactDetails = this.response.message;
      }
      else {
        console.log("Error occurred::::" + this.response.status);
      }
    });


    this.session.getTermsAndConditions(ApiConstant.MainApi + ApiConstant.TermsAndConditions).subscribe((res: TermsAndConditionsResponseModel) => {
      this.response = res;
      console.log("response data is::::" + JSON.stringify(this.response));
      if (this.response.status == "Success") {
        //this.dismissLodaing();
        this.termsDetail = this.response.message;
        console.log(this.termsDetail);
      }
      else {
        console.log("Error occurred::::" + this.response.status);
      }
    });


    this.events.subscribe('guest:visited', (guest) => {
      this.isGuest = guest;
      console.log("isGuest:::::" + this.isGuest);
      if (this.isGuest === true) {
        console.log("I,m in if of app.component.ts");
        this.pages = [
          { title: 'Home', component: MapPage, icon: "menu_home" },
          { title: 'Booking History', component: CitizenParkingHistoryPage, icon: "menu_booking_history" },
          { title: 'Contact Us', component: MapPage, icon: "menu_contact_us" },
          { title: 'Exit', component: LandingPage, icon: "menu_exit" },
        ];
      }

    })
    this.events.subscribe('citizen:loggedin', (citizen) => {
      console.log("citizen login status::::"+citizen);
      if (citizen) {
        this.pages = [
          { title: 'Home', component: MapPage, icon: "menu_home" },
          { title: 'De-registration', component: CustomerDeregistrationPage, icon: "menu_deregistration" },
          { title: 'Coupons', component: CouponsPage, icon: "menu_coupons" },
          { title: 'Booking History', component: CitizenParkingHistoryPage, icon: "menu_booking_history" },
          { title: 'Contact Us', component: MapPage, icon: "menu_contact_us" },
          { title: 'Support', component: SupportPage, icon: "menu_support" },
          { title: 'Terms & Conditions', component: MapPage, icon: "menu_termsncondn" },
          { title: 'Change Password', component: ChangePasswordPage, icon: "menu_change_password" },
          { title: 'Logout', component: LogoutPage, icon: "menu_logout" }
        ];
      }
    });
    // if (this.isCitizen === "true") {
    //   this.pages = [
    //     { title: 'Home', component: MapPage, icon: "menu_home" },
    //     { title: 'De-registration', component: CustomerDeregistrationPage, icon: "menu_deregistration" },
    //     { title: 'Coupons', component: CouponsPage, icon: "menu_coupons" },
    //     { title: 'Booking History', component: CitizenParkingHistoryPage, icon: "menu_booking_history" },
    //     { title: 'Contact Us', component: MapPage, icon: "menu_contact_us" },
    //     { title: 'Support', component: SupportPage, icon: "menu_support" },
    //     { title: 'Terms & Conditions', component: MapPage, icon: "menu_termsncondn" },
    //     { title: 'Change Password', component: ChangePasswordPage, icon: "menu_change_password" },
    //     { title: 'Logout', component: LogoutPage, icon: "menu_logout" }
    //   ];
    // }

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

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    console.log("Page::::::::" + JSON.stringify(page));
    this.nav.setRoot(page.component, {
      user: page.data
    });
    if (page.title === 'Contact Us') {
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
    }

    if (page.title === 'Terms & Conditions') {
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

      const browser = this.iab.create(this.termsDetail, '_blank', options);
      browser.show();
      
    }
  }
}