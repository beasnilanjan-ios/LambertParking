import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, ViewController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { NativeStorage } from '@ionic-native/native-storage';


interface pairedlist {
  "class": number,
  "id": string,
  "address": string,
  "name": string
}

@Component({
  selector: 'page-bluetooth-modal',
  templateUrl: 'bluetooth-modal.html',
})

export class BluetoothModalPage {

  pairedList: pairedlist;
  listToggle: boolean = false;
  pairedDeviceID: number = 0;
  dataSend: string = "";
  nativeSetBool: boolean;

  constructor(
    public navCtrl: NavController, 
    private alertCtrl: AlertController, 
    private bluetoothSerial: BluetoothSerial, 
    private toastCtrl: ToastController,
    public viewCtrl: ViewController,
    private nativeStorage: NativeStorage) {
    this.checkBluetoothEnabled();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BluetoothModalPage');
    this.nativeSetBool = false;
  }

  checkBluetoothEnabled() {
    this.bluetoothSerial.isEnabled().then(success => {
      this.listPairedDevices();
    }, error => {
      this.showError("Please Enable Bluetooth")
    });
  }

  listPairedDevices() {
    this.bluetoothSerial.list().then(success => {
      this.pairedList = success;
      this.listToggle = true;
    }, error => {
      this.showError("Please Enable Bluetooth")
      this.listToggle = false;
    });
  }

  selectDevice() {
    let connectedDevice = this.pairedList[this.pairedDeviceID];
    if (!connectedDevice.address) {
      this.showError('Select Paired Device to connect');
      return;
    }
    let address = connectedDevice.address;
    let name = connectedDevice.name;

    this.connect(address);
  }

  connect(address) {
    // Attempt to connect device with specified address, call app.deviceConnected if success
    this.bluetoothSerial.connect(address).subscribe(success => {
      this.deviceConnected();
      this.showToast("Successfully Connected");
      this.nativeStorage.setItem("DeviceConnected","true").then(
        () => console.log("login stored!!!"),
       error => console.error('Error storing item', error)
      );
      this.nativeSetBool = true;
    }, error => {
      this.showError("Error:Connecting to Device");
      this.nativeStorage.setItem("DeviceConnected","false").then(
        () => console.log("login stored!!!"),
       error => console.error('Error storing item', error)
      );
      this.nativeSetBool = false;
    });
  }

  deviceConnected() {
    // Subscribe to data receiving as soon as the delimiter is read
    this.bluetoothSerial.subscribe('\n').subscribe(success => {
      this.handleData(success);
      this.showToast("Connected Successfullly");
    }, error => {
      this.showError(error);
    });
  }

  deviceDisconnected() {
    // Unsubscribe from data receiving
    this.bluetoothSerial.disconnect();
    this.showToast("Device Disconnected");
    this.nativeStorage.setItem("DeviceConnected","false").then(
      () => console.log("login stored!!!"),
     error => console.error('Error storing item', error)
    );
    this.nativeSetBool = false;
  }

  handleData(data) {
    this.showToast(data);
  }

  // sendData() {
  //   this.dataSend+='\n';
  //   this.showToast(this.dataSend);

  //   this.bluetoothSerial.write(this.dataSend).then(success => {
  //     this.showToast(success);
  //   }, error => {
  //     this.showError(error)
  //   });
  // }

  showError(error) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: error,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  showToast(msj) {
    const toast = this.toastCtrl.create({
      message: msj,
      duration: 1000
    });
    toast.present();

  }

  // openGate() {
  //   this.showToast("OPEN");
  //   this.bluetoothSerial.write('E').then(success => {
  //     this.showToast(success);
  //   }, error => {
  //     this.showError(error)
  //   });
  // }

  // closeGate() {
  //   this.showToast("CLOSE");
  //   this.bluetoothSerial.write('D').then(success => {
  //     this.showToast(success);
  //   }, error => {
  //     this.showError(error)
  //   });
  // }

  back() {
    if (this.nativeSetBool == false) {
      this.nativeStorage.setItem("DeviceConnected","notSet").then(
        () => console.log("login stored!!!"),
       error => console.error('Error storing item', error)
      );
    }
    this.viewCtrl.dismiss();
  }

}
