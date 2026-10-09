import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { ExitModel, ExitResponseModel } from '../../Model/exit.model';
import { ParkedVehicleModel } from '../../Model/parked.vehicle.model';
import { ApiConstant } from '../../Support/ApiConstant';
import { ActivityLoader } from '../../Support/ActivityLoader';
import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { AlertCustom } from '../../Support/AlertCustom';
import { commands } from './../../providers/printer/printer-commands';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { PrinterProvider } from './../../providers/printer/printer';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';


@Component({
  selector: 'page-exit-modal',
  templateUrl: 'exit-modal.html',
})
export class ExitModalPage {

  baseFare: any;
  gstAmount: any;
  gstPercentage: any;
  token_no: any;
  fare: any;
  couponCode: any;
  totalTime: any;
  vehicleType: any;
  allotmentId: any;
  time: any;
  receipt: any;

  //---------------------------------
  data: ExitModel = {
    allotmentId: '',
    fare: '',
    coupon: '',
    exempted: ''
  }
  response: ExitResponseModel;
  //---------------------------------

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private session: SessionManagerProvider,
    private alertView: AlertCustom,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    private actLoader: ActivityLoader,
    private printer: PrinterProvider,
    private bluetoothSerial: BluetoothSerial,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExitModalPage');
    this.baseFare = this.navParams.get('baseFare');
    this.gstAmount = this.navParams.get('gstAmount');
    this.gstPercentage = this.navParams.get('gstPercentage');
    this.token_no = this.navParams.get('token_no');
    this.fare = this.navParams.get('fare');
    this.totalTime = this.navParams.get('totalTime');
    this.vehicleType = this.navParams.get('vehicleType');
    this.allotmentId = this.navParams.get('allotmentId');
    this.time = this.navParams.get('time');
    console.log('got value---->' + JSON.stringify(this.token_no));
  }

  done() {
    if (this.fare.toString().length > 0) {
      if (this.fare <= this.navParams.get('fare')) {
        console.log("IF GOT FARE--->" + JSON.stringify(this.fare));
        this.data.fare = this.fare;
        console.log(this.data.fare);
        this.didSelect();
      } else {
        const alert4 = this.alertCtrl.create({
          title: "Parking Exit",
          subTitle: "Entered amount cannot be greater than total fare",
          buttons: [
            {
              text: 'OK',
              handler: () => {
              }
            }
          ]
        });
        alert4.present();
      }
    } else {
      console.log("ELSE GOT FARE--->" + JSON.stringify(this.fare));
      const alert3 = this.alertCtrl.create({
        title: "Parking Exit",
        subTitle: "Please enter amount",
        buttons: [
          {
            text: 'OK',
            handler: () => {
            }
          }
        ]
      });
      alert3.present();
    }
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  didSelect() {
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
              this.data.allotmentId = this.allotmentId;
              console.log("DATA TO SEND--->" + JSON.stringify(this.data));
              this.session.getExitVehicle(this.data, url).subscribe(
                (response) => {
                  this.actLoader.dismissLodaing();

                  console.log(`response:${JSON.stringify(response)}`);
                  if (response.status == "success") {
                    const alert2 = this.alertCtrl.create({
                      title: "Parking Exit",
                      subTitle: response.msg,
                      buttons: [
                        {
                          text: 'OK',
                          handler: () => {
                            this.viewCtrl.dismiss();
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
              this.data.allotmentId = this.allotmentId;
              console.log("DATA TO SEND--->" + JSON.stringify(this.data));
              this.session.getExitVehicle(this.data, url).subscribe(
                (response) => {
                  this.actLoader.dismissLodaing();

                  console.log(`response:${JSON.stringify(response)}`);
                  if (response.status == "success") {
                    const alert2 = this.alertCtrl.create({
                      title: "Parking Exit",
                      subTitle: response.msg,
                      buttons: [
                        {
                          text: 'OK',
                          handler: () => {
                            // Check if blank put NA in the model objects
                            if (response.tokenNo.length == 0) {
                              response.tokenNo = "NA";
                            }
                            if (response.fare.length == 0) {
                              response.fare = "NA";
                            }
                            //--------------------------------------------

                            try {
                              const encoder = new EscPosEncoder();
                              const result = encoder.initialize();
                          
                              result
                                .codepage('cp936')
                                .align('center')
                                .bold(true)
                                .line(response.agencyName)
                                .line('==== EXIT ====')
                                .raw(commands.TEXT_FORMAT.TXT_NORMAL)
                                .line(commands.HORIZONTAL_LINE.HR2_58MM)
                                .align('left')
                                //-------------------------
                                .bold(true)
                                .line('# Parking Location')
                                .bold(false)
                                .line(response.parkingLocation)
                                //-------------------------
                                .bold(true)
                                .line('# Vehicle Number')
                                .bold(false)
                                .line(response.vehicleNo)
                                //-------------------------
                                .bold(true)
                                .line('# Vehicle Type')
                                .bold(false)
                                .line(response.vehicleType)
                                //-------------------------
                                .bold(true)
                                .line('# Entry Time')
                                .bold(false)
                                .line(response.entryTime)
                                //-------------------------
                                .bold(true)
                                .line('# Exit Time')
                                .bold(false)
                                .line(response.exit_time)
                                //-------------------------
                                .bold(true)
                                .line('# Total Duration')
                                .bold(false)
                                .line(response.hourdiff)
                                //-------------------------
                                .bold(true)
                                .line('# Total Fare')
                                .bold(false)
                                .line(response.fare)
                                //-------------------------
                                .bold(true)
                                .line('# Booking Type')
                                .bold(false)
                                .line(response.bookingStatus)
                                //-------------------------
                                .bold(true)
                                .line('# Token No.')
                                .bold(false)
                                .line(response.tokenNo)
                                //-------------------------
                                .newline()      
                                .align('center')
                                .bold(true)
                                .line('== THANK YOU ==')
                                .newline()
                                .newline()
                          
                              //------------------------------------------                       
                          
                              this.mountAlertBt(result.encode());
                        
                            } catch (err) {
                              console.log("Catch error: " + JSON.stringify(err));
                            }
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

  mountAlertBt(data) {
    this.receipt = data;
    let alert = this.alertCtrl.create({
      title: 'Select your printer',
      buttons: [{
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Select printer',
          handler: (device) => {
            if (!device) {
              this.showToast('Select a printer!');
              return false;
            }
            console.log(device);
            this.printData(device, this.receipt);
          },
        },
      ],
    });

    this.printer
      .enableBluetooth()
      .then(() => {
        this.printer
          .searchBluetooth()
          .then((devices) => {
            devices.forEach((device) => {
              console.log('Devices: ', JSON.stringify(device));
              alert.addInput({
                name: 'printer',
                value: device.address,
                label: device.name,
                type: 'radio',
              });
            });
            alert.present();
          })
          .catch((error) => {
            console.log(error);
            this.showToast(
              'There was an error connecting the printer, please try again!',
            );
            this.mountAlertBt(this.receipt);
          });
      })
      .catch((error) => {
        console.log(error);
        this.showToast('Error activating bluetooth, please try again!');
        this.mountAlertBt(this.receipt);
      });
  }

  printData(device, data) {
    console.log('Device mac: ', device);
    console.log('Data: ', JSON.stringify(data));
    let load = this.loadCtrl.create({
      content: 'Printing...',
    });
    load.present();
    this.printer.connectBluetooth(device).subscribe(
      (status) => {
        console.log(status);
        this.printer
          .printData(data)
          .then((printStatus) => {
            console.log(printStatus);
            let alert = this.alertCtrl.create({
              title: 'Successful print!',
              buttons: [{
                text: 'Ok',
                handler: () => {                  
                  this.printer.disconnectBluetooth();
                  this.viewCtrl.dismiss();
                },
              }, ],
            });
            alert.present();
            load.dismiss();
          })
          .catch((error) => {
            console.log(error);
            let alert = this.alertCtrl.create({
              title: 'There was an error printing, please try again!',
              buttons: [{
                text: 'Ok',
                handler: () => {
                  load.dismiss();
                  //this.printer.disconnectBluetooth();
                },
              }, ],
            });
            alert.present();
          });
      },
      (error) => {
        console.log(error);
        let alert = this.alertCtrl.create({
          title: 'There was an error connecting to the printer, please try again!',
          buttons: [{
            text: 'Ok',
            handler: () => {
              load.dismiss();
              //this.printer.disconnectBluetooth();
            },
          }, ],
        });
        alert.present();
      },
    );
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

}
