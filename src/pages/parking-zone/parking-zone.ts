import { LandingPage } from './../landing/landing';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ModalController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { LoginResponseModel } from "../../Model/login.model";
import { ParkingZoneResponseModel, VehicleListModel, VehicleTypeArray, ValidateUserResponseModel, ViewPlanModel, ViewPlansArray } from '../../Model/parkingZone.model';
import { ParkingArrayModel } from '../../Model/parkingZone.model';
import { ApiConstant } from '../../Support/ApiConstant';
import { EntryPage } from '../entry/entry';
import { ExitPage } from '../exit/exit';
import { ActivityLoader } from '../../Support/ActivityLoader';
import { AlertCustom } from '../../Support/AlertCustom';
import { Observable } from 'rxjs';
import { ViewPlanModalPage } from '../view-plan-modal/view-plan-modal';

// @IonicPage()
@Component({
  selector: 'page-parking-zone',
  templateUrl: 'parking-zone.html',
})
export class ParkingZonePage {
  defaultData: LoginResponseModel;
  response: ParkingZoneResponseModel;
  response2: VehicleListModel;
  viewPlanResponse: ViewPlanModel;
  responseValidateUser: ValidateUserResponseModel;
  valueToDisplay: ParkingArrayModel;
  valueToDisplay2: VehicleTypeArray;
  public buttonClicked: boolean = false;
  preselect: string;
  preselect2: string;
  parkingId: string;
  vehicleTypeIdString: string;
  alertShown: boolean = false;


  //modified by Ipsita (30-8-2019)
  validateLoggedInByUserStatus: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativeStorage: NativeStorage,
    public session: SessionManagerProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    private actLoader: ActivityLoader,
    private alertView: AlertCustom,
    public modalCtrl: ModalController,
  ) {
    platform.ready().then(() => {
      platform.registerBackButtonAction(() => {
        if (this.alertShown == false) {
          this.presentConfirm();
        }
      }, 0)
    })
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.getUserDefault();
  }

  getUserDefault() {
    console.log('ionViewDidLoad ParkingZonePage');

    const navLoginDetail = this.navParams.get('loginDetail');
    if (navLoginDetail) {
      this.applyLoginDetail(navLoginDetail);
      return;
    }

    this.nativeStorage.getItem('NSUDloginDetail').then(
      NSUDdata => {
        console.log("NSUSERDefault--->" + JSON.stringify(NSUDdata));
        this.applyLoginDetail(NSUDdata);
      },
      error => {
        console.error('NativeStorage getItem failed', error);
        this.alertView.showAlert(
          'Login Error',
          'Unable to read login details. Please logout and login again.'
        );
      }
    );
  }

  private applyLoginDetail(loginDetail: LoginResponseModel) {
    this.defaultData = loginDetail;
    if (!this.defaultData.vender_user_id && this.defaultData.vendor_user_id) {
      this.defaultData.vender_user_id = this.defaultData.vendor_user_id;
    }
    this.getParkingZoneList();
  }

  ////used to refresh dataF
  refreshData() {
    this.getParkingZoneList();
  }

  private getVendorUserId(): string {
    if (!this.defaultData) {
      return '';
    }

    // users_parking expects attendant user id (e.g. 24), not vendor_id (e.g. 23).
    return this.defaultData.vender_user_id
      || this.defaultData.vendor_user_id
      || '';
  }

  getParkingZoneList() {
    const vendorUserId = this.getVendorUserId();
    const url = ApiConstant.MainApi + ApiConstant.UserParking + vendorUserId;

    if (!vendorUserId) {
      this.alertView.showAlert(
        'Parking Lot Unavailable',
        'Attendant login details are missing. Please logout and login again.'
      );
      return;
    }

    console.log('Parking lot API -> ' + url);

    try {
      this.session.getResponseParkingZones(url).subscribe((value: ParkingZoneResponseModel) => {
        this.response = value;
        console.log("json response---> " + JSON.stringify(value));

        const parkingLots = this.response && Array.isArray(this.response.parking)
          ? this.response.parking
          : [];

        if (this.response.status == "success" && parkingLots.length > 0) {
          console.log(this.preselect);
          if (this.preselect != undefined) {
            parkingLots.forEach(element => {
              if (element.position == this.preselect) {
                this.onChange(element)
              }
            })
          } else {
            this.preselect = parkingLots[0].position;
            console.log("---->" + this.preselect);
            this.onChange(parkingLots[0]);
          }
        } else if (this.response.status == "success") {
          this.preselect = undefined;
          this.preselect2 = undefined;
          this.buttonClicked = false;
          this.alertView.showAlert(
            'Parking Lot Unavailable',
            'No parking lot is assigned to this attendant account. Please contact admin.'
          );
        } else {
          this.alertView.showAlert("Oops", "Some error occured. Please try after some times");
        }
      }, (error) => {
        console.error('Parking lot request failed', error);
        this.alertView.showAlert(
          'Parking Lot Unavailable',
          'Unable to load parking lots. Check server connection and try Refresh.'
        );
      });
    }
    catch (error) {
      console.log(error);
    }
  }

  //-=-=-=-=-=-=-=For vehicle type list=-=-==-=-=-==-=-=-=-=-=-
  GetVehicleTypeList() {
    this.actLoader.presentLoading();
    const url = ApiConstant.MainApi + ApiConstant.GetParkingDetails + this.parkingId;
    console.log('Vehicle type API -> ' + url);
    try {
      this.session.getResponseVehicleType(url).subscribe((value: VehicleListModel) => {
        this.response2 = value;
        console.log("VEHICLE LIST json response---> " + JSON.stringify(value));
        const vehicleTypes = this.response2 && Array.isArray(this.response2.parkings)
          ? this.response2.parkings
          : [];

        if (this.response2 && this.response2.status == "success" && vehicleTypes.length > 0) {
          console.log(this.preselect2);
          this.valueToDisplay2 = vehicleTypes[0];
          console.log("VEHICLE GOT value onchange--->" + JSON.stringify(this.valueToDisplay2));
          this.buttonClicked = true;
          this.preselect2 = this.valueToDisplay2.vehicle_type;
          this.parkingId = this.valueToDisplay2.parking_id;

          this.vehicleTypeIdString = this.valueToDisplay2.vehicle_type_id;
        } else {
          this.buttonClicked = false;
          this.valueToDisplay2 = undefined;
          this.preselect2 = undefined;
          this.vehicleTypeIdString = undefined;
          this.alertView.showAlert("Vehicle types unavailable", "No vehicle types were returned for this parking lot.");
        }
        this.actLoader.dismissLodaing();

          //----------------------------
          // if (this.preselect2 != undefined) {
          //   this.response2.parkings.forEach(element => {
          //     if (element.vehicle_type == this.preselect2) {
          //       console.log("PRESELECT2 != Undefined---->" + this.preselect2);
          //       this.onChange2(element)
          //     }
          //   })
          // } else {
          //   this.preselect2 = this.response2.parkings[0].vehicle_type;
          //   console.log("---->" + this.preselect2);
          //   this.onChange2(this.response2.parkings[0]);
          // }
      }, (error) => {
        this.buttonClicked = false;
        this.actLoader.dismissLodaing();
        console.error("Vehicle type request failed", error);
        this.alertView.showAlert("Vehicle types unavailable", "Unable to load vehicle types for this parking lot.");
      });
    }
    catch (error) {
      this.actLoader.dismissLodaing();
      console.error("Vehicle type request could not be started", error);
    }
  }


  yearChange(val: any) {
    console.log('Year Change:' + val);
    if (val != "") {
      this.response.parking.forEach(element => {
        if (element.position == val) {
          this.valueToDisplay = element;
          console.log("GOT value yearchange" + JSON.stringify(this.valueToDisplay));
          // this.buttonClicked = true;
          this.preselect = this.valueToDisplay.position;
          // Below for if value change of parking location then refresh the vehicle type list.
          this.parkingId = this.valueToDisplay.parking_id;
          this.GetVehicleTypeList();
          //----------------
          // this.buttonClicked = false;
          // this.preselect2 = '';

          // this.free4wheeler = parseInt(this.valueToDisplay.total_4wheeler_slot) - parseInt(this.valueToDisplay.booked_4wheeler_slot);
          // this.free2wheeler = parseInt(this.valueToDisplay.total_2wheeler_slot) - parseInt(this.valueToDisplay.booked_2wheeler_slot);
        }
      })
    }

  }

  yearChange2(val: any) {
    console.log('VEHICLE Year Change:' + val);
    if (val != "") {
      this.response2.parkings.forEach(element => {
        if (element.vehicle_type == val) {
          this.valueToDisplay2 = element;
          console.log("GOT value yearchange2" + JSON.stringify(this.valueToDisplay2));
          this.buttonClicked = true;
          this.preselect2 = this.valueToDisplay2.vehicle_type;
          this.vehicleTypeIdString = this.valueToDisplay2.vehicle_type_id;
        }
      })
    }
  }

  onChange(parkingLot: ParkingArrayModel) {
    this.valueToDisplay = parkingLot;
    // this.buttonClicked = true;
    this.preselect = this.valueToDisplay.position;
    console.log("GOT value onchange--->" + JSON.stringify(this.preselect));
    this.parkingId = this.valueToDisplay.parking_id;
    this.GetVehicleTypeList();
  }

  //-=-=-=-=-=-=-=-=-==-=-=For vehicle type list=-=-=-==--=-=-=-=-=-=-===-=-=-=-=
  // onChange2(vehicleType: VehicleTypeArray) {
  //   this.valueToDisplay2 = vehicleType;
  //   console.log("VEHICLE GOT value onchange--->" + JSON.stringify(this.valueToDisplay2));
  //   this.buttonClicked = true;
  //   this.preselect2 = this.valueToDisplay2.vehicle_type;
  //   this.parkingId = this.valueToDisplay2.parking_id;
  // }

  exitVehicle() {

    try {
      this.actLoader.presentLoading();

      this.session.getValidateLoggedInUser(ApiConstant.MainApi + ApiConstant.ValidateLoggedInUser + this.getVendorUserId()).subscribe((value: ValidateUserResponseModel) => {
        this.responseValidateUser = value;
        console.log("json response---> " + JSON.stringify(value));
        if (this.responseValidateUser.status == "success") {
          console.log(this.preselect);
          if (this.responseValidateUser.value == "1") {
            var status = "YES";
            //return status
            if (status == "YES") {
              this.navCtrl.push(ExitPage, {
                parking_id: this.valueToDisplay2.parking_id,
                startLocation: this.valueToDisplay.start_position,
                endLocation: this.valueToDisplay.end_position,
              });
            }
          } else {
            var status = "NO";
            //return status
            this.alertView.showAlert("Alert !!!", "Your account had been blocked due to some temporary technical difficulties. Please contact your admin");
            let alert = this.alertCtrl.create({
              title: 'Alert !!!',
              message: 'Your account had been blocked due to some temporary technical difficulties. Please contact your admin',
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    console.log('Logout clicked');
                    this.nativeStorage.clear();
                    this.navCtrl.setRoot(LandingPage);
                  }
                }
              ]
            });
            alert.present();
          }
        } else {
          this.alertView.showAlert("Oops", "Some error occured. Please try after some times");
        }
      });
      return
    }
    catch (error) {
      console.log(error);
    }
    this.actLoader.dismissLodaing();




    //this.ValidateLoggedInUser().subscribe(status=>{

    //})
  }

  entryVehicle() {
    //this.ValidateLoggedInUser().subscribe(status=>{
    try {
      this.actLoader.presentLoading();

      this.session.getValidateLoggedInUser(ApiConstant.MainApi + ApiConstant.ValidateLoggedInUser + this.getVendorUserId()).subscribe((value: ValidateUserResponseModel) => {
        this.responseValidateUser = value;
        console.log("json response---> " + JSON.stringify(value));
        if (this.responseValidateUser.status == "success") {
          console.log(this.preselect);
          if (this.responseValidateUser.value == "1") {
            var status = "YES";
            //return status
            if (status == "YES") {
              console.log("I'm in if:::" + status);
              this.navCtrl.push(EntryPage, {
                parking_id: this.valueToDisplay2.parking_id,
                vehicle_type_id: this.valueToDisplay2.vehicle_type_id,
                vendor_userid: this.getVendorUserId()
              });
            }
          } else {
            var status = "NO";
            console.log("I'm in else:::" + status);
            //return status
            //else {
            let alert = this.alertCtrl.create({
              title: 'Alert !!!',
              message: 'Your account had been blocked due to some temporary technical difficulties. Please contact your admin',
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    console.log('Logout clicked');
                    this.nativeStorage.clear();
                    this.navCtrl.setRoot(LandingPage);
                  }
                }
              ]
            });
            alert.present();
            //}
            //})
          }
        }
        else {
          this.alertView.showAlert("Oops", "Some error occured. Please try after some times");
        }
      });
      //return
    }
    catch (error) {
      console.log(error);
    }
    this.actLoader.dismissLodaing();
  }




  logout() {
    let alert = this.alertCtrl.create({
      title: 'Confirm logout',
      message: 'Do you want logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Logout',
          handler: () => {
            console.log('Logout clicked');
            this.nativeStorage.clear();
            localStorage.setItem('attandantRememberme', null);
            this.navCtrl.setRoot(LandingPage);
          }
        }
      ]
    });
    alert.present();
  }

  ValidateLoggedInUser(): Observable<any> {
    try {
      this.actLoader.presentLoading();

      this.session.getValidateLoggedInUser(ApiConstant.MainApi + ApiConstant.ValidateLoggedInUser + this.getVendorUserId()).subscribe((value: ValidateUserResponseModel) => {
        this.responseValidateUser = value;
        console.log("json response---> " + JSON.stringify(value));
        if (this.responseValidateUser.status == "success") {
          console.log(this.preselect);
          if (this.responseValidateUser.value == "1") {
            var status = "YES";
            return status
          } else {
            var status = "NO";
            return status
          }
        } else {
          this.alertView.showAlert("Oops", "Some error occured. Please try after some times");
        }
      });
      return
    }
    catch (error) {
      console.log(error);
    }
    this.actLoader.dismissLodaing();
  }

  btnViewPlan() {
    this.actLoader.presentLoading();
    try {
      //url/PakingLocationId/VehicleTypeId
      this.session.getResponseViewPlan(ApiConstant.MainApi + ApiConstant.GetViewPlan + this.parkingId+"/"+this.vehicleTypeIdString).subscribe((value: ViewPlanModel) => {
        this.viewPlanResponse = value;
        console.log("VIEW PLAN json response---> " + JSON.stringify(value));
        if (this.viewPlanResponse.status == "success") {
          console.log("VIEW PLAN--->"+this.viewPlanResponse);
          //---MODAL VC WILL BE USED

          let viewPlanModal = this.modalCtrl.create(ViewPlanModalPage, {
            viewPlanArray: this.viewPlanResponse.plans,
            vehicleType: this.preselect2,
            disclaimer: this.viewPlanResponse.disclaimer
          });
          viewPlanModal.present();

            //-----------------------------------
        } else {
          this.alertView.showAlert("Oops", this.viewPlanResponse.message);
        }
      });
    }
    catch (error) {
      console.log(error.status);
    }
    this.actLoader.dismissLodaing();
  }

  //Ionic Back Button Confirm Before Exit
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Exit',
      message: 'Do you want Exit?',
      buttons: [{
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
            localStorage.clear();
            this.platform.exitApp();
          }
        }
      ]
    });
    alert.present().then(() => {
      this.alertShown = true;
    });
  }

}
