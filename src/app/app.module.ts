import { CitizenParkingHistoryPage } from './../pages/citizen-parking-history/citizen-parking-history';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule} from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Geolocation } from '@ionic-native/geolocation';
import { Keyboard } from '@ionic-native/keyboard';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { MyApp } from './app.component';
import { LandingPage } from '../pages/landing/landing';
import { LoginPage } from '../pages/login/login';
import { CitizenLoginPage } from '../pages/citizen-login/citizen-login';
import { MapPage } from '../pages/map/map';
import { ParkingZonePage } from '../pages/parking-zone/parking-zone';
import { SessionManagerProvider } from '../providers/session-manager/session-manager';
import { EntryPage } from '../pages/entry/entry';
import { ExitPage } from '../pages/exit/exit';
import {CustomerDeregistrationPage} from '../pages/customer-deregistration/customer-deregistration';
import { NewProfilePage } from '../pages/new-profile/new-profile';
import { TermsNConditionsPage } from '../pages/terms-n-conditions/terms-n-conditions';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { BookingHistoryPage } from '../pages/booking-history/booking-history';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { SupportPage } from '../pages/support/support';
import { LogoutPage } from '../pages/logout/logout';
import { CouponsPage } from '../pages/coupons/coupons';
import { CustomerRegistrationPage } from '../pages/customer-registration/customer-registration';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { AttandantChangePasswordPage } from '../pages/attandant-change-password/attandant-change-password';
import { AttandantForgotPasswordPage } from '../pages/attandant-forgot-password/attandant-forgot-password';


import { ActivityLoader } from '../Support/ActivityLoader';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ExitModalPage } from '../pages/exit-modal/exit-modal';
import { AlertCustom } from '../Support/AlertCustom';
import { ViewPlanModalPage } from '../pages/view-plan-modal/view-plan-modal';
import { BluetoothModalPage } from '../pages/bluetooth-modal/bluetooth-modal';
import { PrinterProvider } from '../providers/printer/printer';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpLoggingInterceptor } from '../Support/http-logging.interceptor';

@NgModule({
  declarations: [
    MyApp,
    LandingPage,
    LoginPage,
    ParkingZonePage,
    ViewPlanModalPage,
    MapPage,
    EntryPage,
    ExitPage,
    CitizenParkingHistoryPage,
    ExitModalPage,
    BluetoothModalPage,
    CitizenLoginPage,
    NewProfilePage,
    TermsNConditionsPage,
    CustomerDeregistrationPage,
    ChangePasswordPage,
    BookingHistoryPage,
    ContactUsPage,
    SupportPage,
    LogoutPage,
    CouponsPage,
    CustomerRegistrationPage,
    ForgotPasswordPage,
    AttandantChangePasswordPage,
    AttandantForgotPasswordPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    GooglePlaceModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LandingPage,
    LoginPage,
    ParkingZonePage,
    ViewPlanModalPage,
    MapPage,
    EntryPage,
    ExitPage,
    CitizenParkingHistoryPage,
    ExitModalPage,
    BluetoothModalPage,
    CitizenLoginPage,
    NewProfilePage,
    TermsNConditionsPage,
    CustomerDeregistrationPage,
    ChangePasswordPage,
    BookingHistoryPage,
    ContactUsPage,
    SupportPage,
    LogoutPage, 
    CouponsPage,
    CustomerRegistrationPage,
    ForgotPasswordPage,
    AttandantChangePasswordPage,
    AttandantForgotPasswordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SessionManagerProvider,
    Camera,
    FileTransfer,
    Geolocation,
    ActivityLoader,
    AlertCustom,
    Keyboard,
    InAppBrowser,
    BluetoothSerial,
    PrinterProvider,
    { provide: HTTP_INTERCEPTORS, useClass: HttpLoggingInterceptor, multi: true }
  ]
})
export class AppModule {}