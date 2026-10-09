import { OCRMobileResponseModel } from './../../Model/ocrMobile.model';
import { OCRModelResponse } from './../../Model/ocr.model';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, ToastController, ModalController, LoadingController } from 'ionic-angular';
import { EntryModel, EntryResponseModel } from '../../Model/entry.model';
import { Camera } from '@ionic-native/camera';
import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { ApiConstant } from '../../Support/ApiConstant';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Keyboard } from '@ionic-native/keyboard';
import { ActivityLoader } from '../../Support/ActivityLoader';
import { AlertCustom } from '../../Support/AlertCustom';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { BluetoothModalPage } from '../bluetooth-modal/bluetooth-modal';
import { NativeStorage } from '@ionic-native/native-storage';
import { commands } from './../../providers/printer/printer-commands';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { PrinterProvider } from './../../providers/printer/printer';

// @IonicPage()

declare let sunmiInnerPrinter: any;

@Component({
  selector: 'page-entry',
  templateUrl: 'entry.html',
})
export class EntryPage {

  selectedImage: string;
  imageText: string;
  loader: any;
  location: string;
  formatDate: any;
  // entrySuccess: boolean;
  ocrResponse: OCRModelResponse;
  ocrMobileResponse: OCRMobileResponseModel;
  entryModel: EntryModel = {
    parking_id: '',
    vehicle_type_id: '',
    vehicle_number: '',
    mobile: '',
    vendor_userid: '',
    entry_time: '',
    token_no: ''
  }
  entryResponse: EntryResponseModel;
  receipt: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private camera: Camera,
    // private transfer: FileTransfer,
    public loadCtrl: LoadingController,
    public session: SessionManagerProvider,
    public platform: Platform,
    private keyboard: Keyboard,
    private actLoader: ActivityLoader,
    private alertView: AlertCustom,
    private bluetoothSerial: BluetoothSerial,
    private toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private nativeStorage: NativeStorage,
    private printer: PrinterProvider
  ) {} // public progress: NgProgress, private actionSheetCtrl: ActionSheetController,

  ionViewDidLoad() {
    console.log('ionViewDidLoad EntryPage');
    this.setupGUI();
    // this.checkBluetoothEnabled();
  }

  //Setup GUI
  setupGUI() {
    this.entryModel.parking_id = this.navParams.get('parking_id');
    this.entryModel.vehicle_type_id = this.navParams.get('vehicle_type_id');
    this.entryModel.vendor_userid = this.navParams.get('vendor_userid');

    //Current Time Log
    let date = new Date();
    this.formatDate = (date.getFullYear() + '-' + ((date.getMonth() + 1)) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
    console.log("Current Date ", this.formatDate);
    this.entryModel.entry_time = this.formatDate;

    // //Current GPS Coordinates
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   console.log("lat------>"+resp.coords.latitude);
    //   console.log("long------>"+resp.coords.longitude);
    //   this.entryModel.latitude = resp.coords.latitude.toString();
    //   this.entryModel.longitude = resp.coords.longitude.toString();
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });
  }

  //Button Function

  done() {

    try {
      this.actLoader.presentLoading();
      var validate = this.validate();
      if (validate == true) {
        // this.entryModel.vendorUserId = "2";// temp REMOVE AFTER - shall be coming from native storage
        console.log("entry---->" + JSON.stringify(this.entryModel));
        this.session.getResponseParkingEntry(this.entryModel, ApiConstant.MainApi + ApiConstant.ParkingEntryApi).subscribe((response: EntryResponseModel) => {
          this.entryResponse = response;
          console.log("entry response---->" + JSON.stringify(this.entryResponse));
          if (this.entryResponse.status.toLowerCase() == "success") {
            const alert = this.alertCtrl.create({
              title: "Parking Entry",
              subTitle: "Entry Successful",
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {
                    /* Pop navigation controlelr will be disable as attendant needs to print the receipt and open gate ***pk16jan2020***/
                    // this.navCtrl.pop();
                    /* Clear all previous input data for new entry */
                    this.entryModel.vehicle_number = '';
                    this.entryModel.mobile = '';
                    this.entryModel.token_no = '';
                  }
                }]
            });
            alert.present();
          } else if (this.entryResponse.status.toLowerCase() == "fail") {
            this.alertView.showAlert("Oops", "Vehicle is already inside");
          } else if (this.entryResponse.status.toLowerCase() == "invalidtoken") {
            this.entryModel.token_no = '';
            this.alertView.showAlert("Oops", this.entryResponse.msg);
          } else {
            this.alertView.showAlert("Oops", "Some error occured. Please try after some times");
          }
        });
      }
    } catch (error) {
      console.log(error);
    }

    this.actLoader.dismissLodaing();
  }

  cancel() {
    this.navCtrl.pop();
  }

  ocrScan() {
    this.actLoader.presentLoading();

    this.camera.getPicture({
      quality: 90,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true,
      saveToPhotoAlbum: false,
      allowEdit: false
    }).then((imageData) => {
      console.log("IMAGE DATA captured for OCR");
      this.selectedImage = `data:image/jpeg;base64,${imageData}`;
      this.sendImageToServer(this.selectedImage);
    }, (err) => {
      console.log("Camera error::::" + err);
      this.actLoader.dismissLodaing();
      this.handleCameraError(err);
    });
  }

  private handleCameraError(err: any) {
    const errorCode = String(err);

    if (errorCode === '3' || errorCode === 'No Image Selected') {
      return;
    }

    if (errorCode === '20') {
      this.alertView.showAlert(
        'Camera Permission Required',
        'Please allow Camera access for Lambert Parking in Settings > Apps > Lambert Parking > Permissions, then try Auto Scan again.'
      );
      return;
    }

    this.alertView.showAlert('Camera Error', 'Unable to open the camera. Please check permissions and try again.');
  }

  sendImageToServer(b64: string) {
    try {
      // success
      this.session.scanCarImage(ApiConstant.OCRApi, b64)
        .subscribe((data) => {
          this.ocrResponse = data;
          console.log("RESPONSE--->" + JSON.stringify(this.ocrResponse));

          const status = (this.ocrResponse.status || '').toLowerCase();
          const numberPlate = (this.ocrResponse.numberPlate || '').trim();
          const mobileNo = (this.ocrResponse.mobileNo || '').trim();

          if (status === 'success' && numberPlate.length > 0) {
            this.imageText = numberPlate;
            this.entryModel.vehicle_number = numberPlate;

            if (mobileNo.length > 0) {
              this.entryModel.mobile = mobileNo;
            }

            let message = 'Vehicle no.: ' + numberPlate;
            if (mobileNo.length > 0) {
              message += '\nMobile no.: ' + mobileNo;
            }
            this.alertView.showAlert('Auto Scan', message);
          } else if (this.ocrResponse.error) {
            this.alertView.showAlert('Sorry', this.ocrResponse.error);
          } else {
            this.alertView.showAlert('Auto Scan', 'Unable to read the number plate. Please try again.');
          }

          this.actLoader.dismissLodaing();
        }, (err) => {
          console.log("OCR Error--->" + JSON.stringify(err));
          this.actLoader.dismissLodaing();
          if (err && err.status === 0) {
            this.alertView.showAlert(
              "OCR Failed",
              "Unable to reach the OCR service. Check that your phone and server (192.168.1.144:8082) are on the same network."
            );
          } else {
            this.alertView.showAlert("OCR Failed", "Some error occurred. Please try again later.");
          }
        });
    } catch (error) {
      this.actLoader.dismissLodaing();
      console.log(error);
    }
  }

  //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  btnPrint() {
    console.log("PRINT----------------->");

    // try {
    // //   // if (JSON.stringify(sunmiInnerPrinter) !== "{}") {
    // //   //   console.log("if no printer----------------->");
    // //   //   return;
    // //   // }
    //   if (sunmiInnerPrinter.hasPrinter()) {
    //     console.log("Has PRINTer----------------->");

    //     sunmiInnerPrinter.printerInit();
    //     sunmiInnerPrinter.enterPrinterBuffer(true);
    //     sunmiInnerPrinter.printString("\n");
    //     sunmiInnerPrinter.setAlignment(1);
    //     sunmiInnerPrinter.printTextWithFont("====ENTRY====",30.0);
    //     sunmiInnerPrinter.lineWrap(2);
    //     sunmiInnerPrinter.printColumnsText(["Parking\nLocation","Pal-Pos-1 to Pal-Pos-2"], [16,15],[0,0]);
    //     sunmiInnerPrinter.printString("----------------");
    //     sunmiInnerPrinter.printColumnsText(["Vehicle Number","truck2"], [16,15],[0,0]);
    //     sunmiInnerPrinter.printString("----------------");
    //     sunmiInnerPrinter.printColumnsText(["Vehicle Type ","Truck"], [16,15],[0,0]);
    //     sunmiInnerPrinter.printString("----------------");
    //     sunmiInnerPrinter.printColumnsText(["Entry Time","20-02-2020 01:27:06"], [16,105],[0,0]);
    //     sunmiInnerPrinter.printString("----------------");
    //     sunmiInnerPrinter.printColumnsText(["Exit Time","20-02-2020 07:50:58"], [16,15],[0,0]);
    //     sunmiInnerPrinter.printString("----------------");
    //     sunmiInnerPrinter.printColumnsText(["Total Duration","6 Hour(s) 23 Minute(s)"], [16,15],[0,0]);
    //     sunmiInnerPrinter.printString("----------------");
    //     sunmiInnerPrinter.printColumnsText(["Total Fare","350"], [16,15],[0,0]);
    //     sunmiInnerPrinter.printString("----------------");
    //     sunmiInnerPrinter.printColumnsText(["Token No.","AIUY4674FG"], [16,15],[0,0]);
    //     sunmiInnerPrinter.printString("\n");
    //     sunmiInnerPrinter.printString("\n");
    //     sunmiInnerPrinter.setAlignment(1);
    //     sunmiInnerPrinter.printString("-----Thank You-----");

    // //     // var base64Image = "Qk12nAAAAAAAADYAAAAoAAAAZAAAAJz///8BACAAAAAAAAAAAABhDwAAYQ8AAAAAAAAAAAAA/////////////w=="
    // //     // sunmiInnerPrinter.printBitmap(base64Image);

    //     sunmiInnerPrinter.exitPrinterBuffer(true);

    //   } else {
    //     console.log("No PRINTer------------------>");
    //   }

    // } catch (err) {
    //   console.log("error: " + JSON.stringify(err));
    // }

    //------------------------------------------------

    // Check if blank put NA in the model objects
    if (this.entryResponse.tokenNo.length == 0) {
      this.entryResponse.tokenNo = "NA";
    }        
    //--------------------------------------------

    try {
      if (this.entryResponse.status.toLowerCase() == "success") {
        const encoder = new EscPosEncoder();
        const result = encoder.initialize();

        result
          .codepage('cp936')
          .align('center')
          .bold(true)
          .line(this.entryResponse.agencyName)
          .line('==== ENTRY ====')
          .raw(commands.TEXT_FORMAT.TXT_NORMAL)
          .line(commands.HORIZONTAL_LINE.HR2_58MM)
          .align('left')
          //-------------------------
          .bold(true)
          .line('# Parking Location')
          .bold(false)
          .line(this.entryResponse.parkingLocation)
          //-------------------------
          .bold(true)
          .line('# Vehicle Number')
          .bold(false)
          .line(this.entryResponse.vehicleNo)
          //-------------------------
          .bold(true)
          .line('# Vehicle Type')
          .bold(false)
          .line(this.entryResponse.vehicleType)
          //-------------------------
          .bold(true)
          .line('# Entry Time')
          .bold(false)
          .line(this.entryResponse.entryTime)
          //-------------------------
          .bold(true)
          .line('# Booking Type')
          .bold(false)
          .line(this.entryResponse.bookingStatus)
          //-------------------------        
          .bold(true)
          .line('# Token No.')
          .bold(false)
          .line(this.entryResponse.tokenNo)
          //-------------------------
          .newline()
          .align('center')
          .bold(true)
          .line('== THANK YOU ==')
          .newline()
          .newline()

        //------------------------------------------      

        this.mountAlertBt(result.encode());
      } else {
        this.showError("First enter a vehicle");
      }
    } catch (err) {
      this.showError("Please try again");
      console.log("Catch error: " + JSON.stringify(err));
    }

  }
  // Convert array buffer to string
  // ab2str(buf) {
  //   return String.fromCharCode.apply(null, new Uint8Array(buf));
  // }

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
                },
              },],
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
              },],
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
          },],
        });
        alert.present();
      },
    );
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
                  this.nativeStorage.setItem("EnableBoomGate", "YES").then(
                    () => this.checkBluetoothEnabled(),
                    error => console.error('Error storing item', error)
                  );
                }
              },
              {
                text: 'No',
                handler: () => {
                  this.nativeStorage.setItem("EnableBoomGate", "NO").then(
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

    //-=-=-=-=-=-=-=-=-=-=-=Below code for manually open & close gate-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
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

  // getPicture(sourceType: PictureSourceType) {
  //   this.camera.getPicture({
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     sourceType: sourceType,
  //     allowEdit: true,
  //     saveToPhotoAlbum: false,
  //     correctOrientation: true
  //   }).then((imageData) => {
  //     this.presentLoading();
  //     this.selectedImage = `data:image/jpeg;base64,${imageData}`;
  //     this.recognizeImage();
  //   });
  // }

  // recognizeImage() {    
  //   Tesseract.recognize(this.selectedImage)
  //   .progress(message => {
  //     // if (message.status === 'recognizing text')
  //     // this.presentLoading();
  //   })
  //   .catch(err => console.error(err))
  //   .then(result => {
  //     this.imageText = result.text;
  //     this.entryModel.vehicleNo = result.text;
  //     this.dismissLodaing();
  //   })
  //   .finally(resultOrError => {
  //     this.dismissLodaing();
  //   });

  // }

  // //Below function is not required as mobile number will be manual entry-----//

  // //Input change api call
  // inputChanged() {
  //   // let TIME_IN_MS = 1000; 
  //   // setTimeout( () => {
  //      // somecode
  //      console.log("Input field got hitt------>"+this.entryModel.vehicleNo);
  //      try {      
  //         this.presentLoading();
  //         this.session.getOCRMobile(ApiConstant.MainApi + ApiConstant.OCRMobileNoApi+this.entryModel.vehicleNo).subscribe((value: OCRMobileResponseModel) => {
  //           this.ocrMobileResponse = value;
  //           if (this.ocrMobileResponse.status == "success") {
  //             console.log("history success----->");
  //             if (this.ocrMobileResponse.mobileNo != "") {
  //               this.entryModel.mobileNo = this.ocrMobileResponse.mobileNo;
  //             } else {
  //               this.showAlert("Parking", "No mobile number registered");
  //               this.dismissLodaing();
  //             }              
  //           }else {
  //             this.showAlert("Parking", "No number found");
  //             this.dismissLodaing();
  //           }           
  //         });
  //     } catch (error) {
  //       this.dismissLodaing();
  //     }
  //      console.log("Input field got hitt------>");
  //   // }, TIME_IN_MS);
  //   this.dismissLodaing();

  // }

  //Validation
  private validate(): boolean {
    if (this.entryModel.vehicle_number.length > 0) {
      if (this.entryModel.mobile.length > 0) {
        if (this.entryModel.mobile.length == 10) {
          return true
        } else {
          this.alertView.showAlert("Parking", "Mobile number must be 10 digits");
        }
      } else {
        return true
        // this.showAlert("Parking", "Enter mobile number");
      }
    } else {
      this.alertView.showAlert("Parking", "Enter vehicle number");
    }
    return false
  }

  //Keyboard Function
  hideKeyboard() {
    this.keyboard.hide();
  }

}