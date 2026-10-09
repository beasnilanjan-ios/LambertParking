import { ParkedVehicleModel, ParkedVehicleList } from './../../Model/parked.vehicle.model';
import { ActivityLoader } from './../../Support/ActivityLoader';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, ToastController } from 'ionic-angular';
import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { ApiConstant } from '../../Support/ApiConstant';
import { ExitModel, ExitResponseModel } from '../../Model/exit.model';
import { FareModel, FareResponseModel } from '../../Model/calculate.fare.model';
import { Keyboard } from '@ionic-native/keyboard';
// import { ExitModalPage } from '../exit-modal/exit-modal';
import { AlertCustom } from '../../Support/AlertCustom';
import * as moment from "moment"; 
import { ExitModalPage } from '../exit-modal/exit-modal';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { BluetoothModalPage } from '../bluetooth-modal/bluetooth-modal';
import { NativeStorage } from '@ionic-native/native-storage';



// @IonicPage()
@Component({
  selector: 'page-exit',
  templateUrl: 'exit.html',
})
export class ExitPage {

  gateBool: boolean;
  isChecked: boolean = false;
  filterVehicle: Array<any>;

  //----------------------------------
  dataToSend: ParkedVehicleList = {
    parking_id: ''
  }
  //-----------------------------------


  //----------------------------------
  vehicleList: ParkedVehicleModel[];
  location: string;
  //---------------------------------

  //-----------------------------------
  fareData: FareModel = {
    allotmentId: '',
    time: ''
  }
  fareResponse: FareResponseModel;
  //---------------------------------

  //---------------------------------
  data: ExitModel = {
    allotmentId: '',
    fare: '',
    exempted: '',
    coupon: '',
    time: ''
  }
  response: ExitResponseModel;
  //---------------------------------

  // preFilterVehicleNumber: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private session: SessionManagerProvider,
    private keyboard: Keyboard,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private actLoader: ActivityLoader,
    private alertView: AlertCustom,
    private bluetoothSerial: BluetoothSerial,
    private toastCtrl: ToastController,
    private nativeStorage: NativeStorage
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExitPage');
    this.gateBool = false;
    this.dataToSend.parking_id = this.navParams.get('parking_id');
    this.location = this.navParams.get('startLocation') + " To " + this.navParams.get('endLocation');
    console.log("Parking_id--->" + this.dataToSend.parking_id);
    
    //Current Time Log
    let date = new Date();
    let formatDate = (date.getFullYear() + '-' + ((date.getMonth() + 1)) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
    console.log("Current Date ", formatDate);
    this.getVehicleList();
    // this.checkBluetoothEnabled();
  }

  private getVehicleList() {
    try {
      let url = `${ApiConstant.MainApi}${ApiConstant.ParkedVehicles}`
      this.actLoader.presentLoading();
      this.session.getParkedVehicleList(this.dataToSend, url).subscribe(
        (response) => {
          this.actLoader.dismissLodaing();

          console.log(`response:${JSON.stringify(response)}`);
          if (response.status == "success") {
            this.vehicleList = response.parkedvehicle_list;
            this.filterVehicle = this.vehicleList;
          } else {
            this.vehicleList = [];
            this.filterVehicle = [];
            this.alertView.showAlert("Parking", "No vehicle available");
          }
        },
        (error) => {
          this.actLoader.dismissLodaing();
          console.log("error--->" + JSON.stringify(error));
        }
      )
    } catch (error) {
      this.actLoader.dismissLodaing();
      console.log(error);
    }
  }

  didSelect(item: ParkedVehicleModel) {
    console.log("did select ----->");

    const alert = this.alertCtrl.create({
      title: "Parking",
      subTitle: "Exit the vehicle ?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Exit',
          handler: () => {
            try {
              let url = `${ApiConstant.MainApi}${ApiConstant.ExitVehicle}`
              this.actLoader.presentLoading();

              //Current Time Log
              let date = new Date();
              let formatDate = (date.getFullYear() + '-' + ((date.getMonth() + 1)) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
              console.log("Current Date ", formatDate);

              this.data.time = formatDate;
              this.data.allotmentId = item.allotment_id;
              console.log("DATA TO SEND--->" + JSON.stringify(this.data));
              this.session.getExitVehicle(this.data, url).subscribe(
                (response) => {
                  this.actLoader.dismissLodaing();

                  console.log(`response:${JSON.stringify(response)}`);
                  if (response.status == "success") {
                    const alert2 = this.alertCtrl.create({
                      title: "Parking Exit",
                      subTitle: "Exit Successful",
                      buttons: [
                        {
                          text: 'OK',
                          handler: () => {
                            this.getVehicleList();
                            // this.navCtrl.pop();            
                          }
                        }
                      ]
                    });
                    alert2.present();
                  } else {
                    this.alertView.showAlert("Parking", "Some error occured. Please try after sometimes");
                  }
                },
                (error) => {
                  this.actLoader.dismissLodaing();
                  console.log(error);
                }
              )
            } catch (error) {
              this.actLoader.dismissLodaing();
              console.log(error);
            }
          }
        },
        {
          text: 'Exit & Print',
          handler: () => {
            try {
              let url = `${ApiConstant.MainApi}${ApiConstant.ExitVehicle}`
              this.actLoader.presentLoading();

              //Current Time Log
              let date = new Date();
              let formatDate = (date.getFullYear() + '-' + ((date.getMonth() + 1)) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
              console.log("Current Date ", formatDate);

              this.data.time = formatDate;
              this.data.allotmentId = item.allotment_id;
              console.log("DATA TO SEND--->" + JSON.stringify(this.data));
              this.session.getExitVehicle(this.data, url).subscribe(
                (response) => {
                  this.actLoader.dismissLodaing();

                  console.log(`response:${JSON.stringify(response)}`);
                  if (response.status == "success") {
                    const alert2 = this.alertCtrl.create({
                      title: "Parking Exit",
                      subTitle: "Exit Successful",
                      buttons: [
                        {
                          text: 'OK',
                          handler: () => {
                            this.getVehicleList();
                            // this.navCtrl.pop();            
                          }
                        }
                      ]
                    });
                    alert2.present();
                  } else {
                    this.alertView.showAlert("Parking", "Some error occured. Please try after sometimes");
                  }
                },
                (error) => {
                  this.actLoader.dismissLodaing();
                  console.log(error);
                }
              )
            } catch (error) {
              this.actLoader.dismissLodaing();
              console.log(error);
            }
          }
        }]
    });
    alert.present();
  }


  //Button
  exit(item: ParkedVehicleModel) {
    try {
      this.actLoader.presentLoading();

      //Current Time Log
      // let date = new Date();
      // let formatDate = (date.getFullYear() + '-' + ((date.getMonth() + 1)) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
      // console.log("Current Date ", formatDate);

      const date2 = moment().format("YYYY-MM-DD HH:mm:ss");
      console.log("Current Date Moment.js---> ", date2);

      let url = `${ApiConstant.MainApi}${ApiConstant.CalculateFareApi}`
      this.fareData.allotmentId = item.allotment_id;
      this.fareData.time = date2;
      console.log("allotment id--->"+this.fareData.allotmentId);
      console.log("time--->"+this.fareData.time);
      console.log("url--->"+url);
      this.session.getTotalFare(url, this.fareData).subscribe(
        (fareResponse) => {
          console.log("exit response---->" + JSON.stringify(fareResponse));
          if (fareResponse.status.toLowerCase() == "success") {

            //---MODAL VC WILL BE USED

            if (fareResponse.gstAmount.length == 0) {
              fareResponse.gstAmount = "NA"
            }
            if (fareResponse.gstPercentage.length == 0) {
              fareResponse.gstPercentage = "NA"
            }
            if (fareResponse.token_no.length == 0) {
              fareResponse.token_no = "NA"
            }

            let profileModal = this.modalCtrl.create(ExitModalPage, {
              baseFare: fareResponse.baseFare,
              gstAmount: fareResponse.gstAmount,
              gstPercentage: fareResponse.gstPercentage,
              token_no: fareResponse.token_no,
              fare: fareResponse.fare,
              totalTime: fareResponse.hourdiff,
              vehicleType: item.vehicle_type,
              allotmentId: this.fareData.allotmentId,
              time: this.fareData.time
            });
            profileModal.present();
            profileModal.onDidDismiss(data => {
              this.getVehicleList();
            });

          };
        });
            //-------------------------------------------------

    //         if (fareResponse.gstAmount.length == 0) {
    //           fareResponse.gstAmount = "NA"
    //         }
    //         if (fareResponse.gstPercentage.length == 0) {
    //           fareResponse.gstPercentage = "NA"
    //         }
    //         if (fareResponse.token_no.length == 0) {
    //           fareResponse.token_no = "NA"
    //         }

    //         var infoWindowContent = '<div class="py-10px"><b>Base Fare: </b>' + fareResponse.baseFare + '</div>' + '<div><b>GST Percentage (%): </b>' + fareResponse.gstPercentage + '</div>' + '<div><b>GST Amount (₹): </b>' + fareResponse.gstAmount + '</div>' + '<div><b>Total Fare: ₹ </b>' + fareResponse.fare + '</div>' + '<div><b>Vehicle Type: </b>' + item.vehicle_type + '</div>' + '<div><b>Total Time: </b>' + fareResponse.hourdiff + '</div>' + '<div><b>Token no.: </b>' + fareResponse.token_no + '</div>';

    //         const alert2 = this.alertCtrl.create({
    //           title: '<div><u>Parking Charges</u></div>',
    //           subTitle: infoWindowContent,              
    //           inputs: [
    //             {
    //               name: 'CouponCode',
    //               placeholder: 'Coupon Code',
    //               type: 'string'
    //             },
    //             {
    //               name: 'Amount',
    //               placeholder: 'Amount received',
    //               value: fareResponse.fare,
    //               type: 'number'
    //             }
    //           ],
    //           buttons: [
    //             {
    //               text: 'Cancel',
    //               role: 'cancel',
    //               handler: () => {
    //               }
    //             },
    //             {
    //               text: 'Confirm',
    //               handler: dataFromTxtField => {
    //                 //check amt and proceed
    //                 console.log(dataFromTxtField.Amount.toString().length);
    //                 if (dataFromTxtField.Amount.toString().length > 0) {
    //                   if (dataFromTxtField.Amount <= fareResponse.fare) {
    //                     console.log("IF GOT FARE--->" + JSON.stringify(dataFromTxtField.Amount));
    //                       this.data.coupon = dataFromTxtField.CouponCode
    //                       this.data.fare = dataFromTxtField.Amount;
    //                       this.data.exempted = "0";
    //                       console.log(this.data.fare);
    //                       this.didSelect(item);
    //                   } else {
    //                     const alert4 = this.alertCtrl.create({
    //                       title: "Parking Exit",
    //                       subTitle: "Entered amount cannot be greater than total fare",
    //                       buttons: [
    //                         {
    //                           text: 'OK',
    //                           handler: () => {
    //                           }
    //                         }
    //                       ]
    //                     });
    //                     alert4.present();
    //                   }
    //                 } else {
    //                   console.log("ELSE GOT FARE--->" + JSON.stringify(dataFromTxtField.Amount));
    //                   const alert3 = this.alertCtrl.create({
    //                     title: "Parking Exit",
    //                     subTitle: "Please enter amount",
    //                     buttons: [
    //                       {
    //                         text: 'OK',
    //                         handler: () => {
    //                         }
    //                       }
    //                     ]
    //                   });
    //                   alert3.present();
    //                 }                  
    //               }
    //             }
    //           ]
    //         });
    //         alert2.present();            
    //       } else if (fareResponse.status.toLowerCase() == "fail") {
    //         this.alertView.showAlert("Parking", fareResponse.error);
    //       } else {
    //         this.alertView.showAlert("Oops", "Some error occured. Please try after some times");
    //       }
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   )
    } catch (error) {
      console.log(error);
    }
    this.actLoader.dismissLodaing();
        
  }

  //------------- EXEMPTED VEHICLE -------------//
  exemptedVehicle(item: ParkedVehicleModel) {
    try {
      this.actLoader.presentLoading();
      //Current Time Log
      let date = new Date();
      // let exitTime = date.toISOString();
      let formatDate = (date.getFullYear() + '-' + ((date.getMonth() + 1)) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
      console.log("Current Date ", formatDate);

      let url = `${ApiConstant.MainApi}${ApiConstant.CalculateFareApi}`
      this.fareData.allotmentId = item.allotment_id;
      this.fareData.time = formatDate;
      this.session.getTotalFare(url, this.fareData).subscribe(
        (fareResponse) => {
          console.log("exit response---->" + JSON.stringify(fareResponse));
          if (fareResponse.status == "success") {

            // var infoWindowContent = '<div class="py-10px"><b>Total Fare: ₹ </b>' + fareResponse.fare + '</div>' + '<div><b>Vehicle Type: </b>' + item.vehicle_type + '</div>' + '<div><b>Total Time: </b>' + fareResponse.hourdiff + '</div>';

            const alert2 = this.alertCtrl.create({
              title: '<div><u>Exempted Vehicle</u></div>',
              // subTitle: infoWindowContent, //---Commented on 11-04-2019 as told by Paantuya (Dipankar)
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {
                  }
                },
                {
                  text: 'Confirm',
                  handler: () => {
                    this.data.fare = "0"; //fareResponse.fare;
                    this.data.coupon = '';
                    this.data.exempted = "1";
                    console.log(this.data.fare);
                    this.didSelect(item);
                  }

                }
              ]
            });
            alert2.present();
          }
        },
        (error) => {
          this.actLoader.dismissLodaing();
          console.log(error);
        }
      )
    } catch (error) {
      console.log(error);
    }
    this.actLoader.dismissLodaing();

    // if (this.isChecked == false) {
    //   this.isChecked = true;
    //   console.log('Cucumbers new state:' + this.isChecked);
    // } else {
    //   this.isChecked = false;
    //   console.log('Cucumbers new state:' + this.isChecked);
    // }
  }

  filterItems(ev: any) {
    console.log("ev----->", ev);

    this.filterVehicle = this.vehicleList;

    let val = ev.target.value;

    if (val && val.trim() !== '') {
      this.filterVehicle = this.filterVehicle.filter(function (item) {
        console.log("Filterrrr-->" + item.vehicle_number);
        return item.vehicle_number.toLowerCase().includes(val.toLowerCase());
      });
    }
  }

  //Keyboard Function
  hideKeyboard() {
    this.keyboard.hide();
  }

  btnGateOpen() {
    this.nativeStorage.getItem('EnableBoomGate').then(
      data => {
        console.log('My value enable boom gate:::::' + data);
        if (data == "YES") {
          this.checkBluetoothEnabled();
        } else if (data == "NO") {
          console.log("btnGateOpen--- enableBoomGate NO--->");
        } else {
          const alert2 = this.alertCtrl.create({
            title: 'Activated Boom Gate?',
            buttons: [
              {
                text: 'Yes',
                handler: () => {
                  this.nativeStorage.setItem("EnableBoomGate","YES").then(
                    () => this.checkBluetoothEnabled(),
                   error => console.error('Error storing item', error)
                  );
                }
              },
              {
                text: 'No',
                handler: () => {
                  this.nativeStorage.setItem("EnableBoomGate","NO").then(
                    () => console.error('stored enable boom gate!!!'),
                   error => console.error('Error storing item', error)
                  );
                }
              }
            ]
          });
          alert2.present();
        }
      },
      error => {
        console.error('enable boom gate Error**** ' + error)
      }
    );

    //-=-=-==-=-==-=-Original Working COde //Commented on 24 Feb 2020=-=-=-=-=-=-=-=-=-=-=-=
      // if (this.gateBool == false) {
      //   this.gateBool = true;
      //   this.showToast("OPEN");
      //   this.bluetoothSerial.write('E').then(success => {
      //     this.showToast(success);
      //   }, error => {
      //     this.showError(error)
      //   });
      // } else {
      //   this.gateBool = false;
      //   this.showToast("CLOSE");
      //   this.bluetoothSerial.write('D').then(success => {
      //     this.showToast(success);
      //   }, error => {
      //     this.showError(error)
      //   });
      // }
  }

  showToast(msj) {
    const toast = this.toastCtrl.create({
      message: msj,
      duration: 1000
    });
    toast.present();

  }

  showError(error) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: error,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  //Check bluetooth is enabled or not
  checkBluetoothEnabled() {
    this.bluetoothSerial.isEnabled().then(success => {
      //Check device is connected or not
      this.nativeStorage.getItem('DeviceConnected').then(
        data => {
          console.log('My value:::::' + data);
          if (data == "true") {
            this.showToast("OPEN");
            this.bluetoothSerial.write('E').then(success => {
              this.showToast(success);
              // Remove the below code afterward if printer is implemented.-------------------------------->
              this.nativeStorage.setItem("DeviceConnected","false").then(
                () => console.log("login stored!!!"),
               error => console.error('Error storing item', error)
              );
              this.bluetoothSerial.disconnect();
              //------------------------------------------------------------------------------
            }, error => {
              this.showError(error)
            });
          } else {
            const alert2 = this.alertCtrl.create({
              title: 'Bluetooth not connected',
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    let bluetoothModal = this.modalCtrl.create(BluetoothModalPage, {                
                    });
                    bluetoothModal.present();                    
                  }
                }
              ]
            });
            alert2.present();
          }          
        },
        error => {
          console.error('Attendant Error**** ' + error)
        }
      );
    }, error => {
      const alert2 = this.alertCtrl.create({
        title: 'Please Enable Bluetooth and connect',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              let bluetoothModal = this.modalCtrl.create(BluetoothModalPage, {                
              });
              bluetoothModal.present();
              // bluetoothModal.onDidDismiss(data => {
                
              // });
            }
          }
        ]
      });
      alert2.present();
    });
  }

}
