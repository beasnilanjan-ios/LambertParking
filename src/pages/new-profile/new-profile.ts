import { Component } from '@angular/core';
import { MapPage } from './../map/map';
import { CitizenSignupModel, CitizenSignupResponseModel, VehicleArrayModel } from './../../Model/citizenSignup.model';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { ApiConstant } from '../../Support/ApiConstant';
import { NativeStorage } from '@ionic-native/native-storage';
import { Keyboard } from '@ionic-native/keyboard';
import { TermsNConditionsPage } from '../terms-n-conditions/terms-n-conditions';

// @IonicPage()
@Component({
  selector: 'page-new-profile',
  templateUrl: 'new-profile.html',
})
export class NewProfilePage {

  dataToSend: CitizenSignupModel = {
    
    name:'',
    address: '',
    mobile_no:'',
    gender:'',
    email:'',
    vehicleArray:[]
  }
  response: CitizenSignupResponseModel;
  loader: any;
  vehicleNo:string;
  vehicleType:string;
  public items:any = [];
  boolOneTimeEntry:boolean;
  isSelectedTermsNCond: boolean = false;


  constructor(private nativeStorage: NativeStorage, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public session: SessionManagerProvider, public activityLoader: LoadingController, private keyboard: Keyboard) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewProfilePage');
    //Activity loader init
    this.loader = this.activityLoader.create({
      content: "Loading...",
      // duration: 3000,
      spinner: "ios",
      dismissOnPageChange: true //dismiss can be also used
    });

    this.boolOneTimeEntry = false;
  }

  signup(){
     this.presentLoading();
    
    if (this.dataToSend.name.length > 0) {
      if (this.dataToSend.mobile_no.length > 0){
        if (this.dataToSend.mobile_no.length == 10) {
          if (this.dataToSend.gender.length > 0){
            if (this.dataToSend.email.length > 0) {
              if (this.vehicleNo != undefined && this.vehicleType != undefined) {
                // this.items = {'vehicleNo': this.vehicleNo, 'vehicleType': this.vehicleType};
                // this.dataToSend.vehicleArray.push(this.items);
                // console.dir(this.dataToSend.vehicleArray);
                if (this.dataToSend.vehicleArray.length > 0) {
                  var lastAddress = this.dataToSend.vehicleArray[this.dataToSend.vehicleArray.length - 1];
                  if (lastAddress.vehicleNo.length > 0 && lastAddress.vehicleType.length > 0) {
                    // this.dataToSend.vehicleArray.forEach(element => {
                    //   if (element.vehicleNo != this.vehicleNo) {
                    //     console.log("------->if push" + element.vehicleNo);
                        
                    //     this.items = [];
                    //     this.items = {'vehicleNo': this.vehicleNo, 'vehicleType': this.vehicleType};
                    //     this.dataToSend.vehicleArray.push(this.items);
                    //   }
                    // });
                    // this.items = [];
                    // this.items = {'vehicleNo': this.vehicleNo, 'vehicleType': this.vehicleType};
                    // this.dataToSend.vehicleArray.push(this.items);
                    if (this.boolOneTimeEntry == false) {
                      this.items = [];
                      this.items = {'vehicleNo': this.vehicleNo, 'vehicleType': this.vehicleType};
                      this.dataToSend.vehicleArray.push(this.items);
                      this.boolOneTimeEntry = true;
                    }
                    console.log(JSON.stringify(this.dataToSend));
                    this.session.getCitizenSignup(ApiConstant.MainApi + ApiConstant.CitizenSignupApi, this.dataToSend).subscribe((value : CitizenSignupResponseModel) => {
                      this.response = value;
                      console.log(JSON.stringify(this.response));
                      if (this.response.status == "success") {
                        const alert = this.alertCtrl.create({
                          title: "Parking",
                          subTitle: "Registration successful!",
                          buttons: [                    
                            {
                              text:'OK',
                              handler:()=>{
                                //Store login details
                                ////////
                              this.nativeStorage.setItem("NSUDIsCitizenLoggedIn","true").then(
                                () => console.log("is logged in"),
                               error => console.error('Error storing item', error)
                              );
                              this.nativeStorage.setItem("NSUDCitizenLoggedInMobile",this.response.mobile_no).then(
                                () => console.log("is logged in"),
                               error => console.error('Error storing item', error)
                              );
                              //////////
                                this.nativeStorage.setItem("NSUDCitizenDetail",this.response).then(
                                  () => console.log("login stored!!!"),
                                  error => console.error('Error storing item', error)
                                );
                                this.navCtrl.push(MapPage, 
                                {mobile: this.response.mobile_no
                                });
                              }
                            }
                          ]
                        });
                        alert.present();                      
                      } else {
                        this.showAlert("Parking", "The Mobile number entered already exists. Please enter another.");
                      }
                     });  
                  } else {
                    this.showAlert("Parking", "Vehicle number or Vehicle type cannot be empty");
                  }             
                }else{
                  this.dataToSend.vehicleArray.forEach(element => {
                    if (element.vehicleNo != this.vehicleNo) {
                      this.items = [];
                      this.items = {'vehicleNo': this.vehicleNo, 'vehicleType': this.vehicleType};
                      this.dataToSend.vehicleArray.push(this.items);
                    }
                  });                  
                  
                  console.dir(this.dataToSend);
                  this.session.getCitizenSignup(ApiConstant.MainApi + ApiConstant.CitizenSignupApi, this.dataToSend).subscribe((value : CitizenSignupResponseModel) => {
                    this.response = value;
                    console.log(JSON.stringify(this.response));
                    
                    if (this.response.status == "success") {
                      console.log("array count if--"+this.dataToSend.vehicleArray.length);
                      const alert = this.alertCtrl.create({
                        title: "Parking",
                        subTitle: "Registration successful!",
                        buttons: [                    
                          {
                            text:'OK',
                            handler:()=>{
                              //Store login details
                              ////////
                              this.nativeStorage.setItem("NSUDIsCitizenLoggedIn","true").then(
                                () => console.log("is logged in"),
                               error => console.error('Error storing item', error)
                              );
                              this.nativeStorage.setItem("NSUDCitizenLoggedInMobile",this.response.mobile_no).then(
                                () => console.log("is logged in"),
                               error => console.error('Error storing item', error)
                              );
                              //////////
                              this.nativeStorage.setItem("NSUDCitizenDetail",this.response).then(
                                () => console.log("login stored!!!"),
                                error => console.error('Error storing item', error)
                              );
                              this.navCtrl.push(MapPage);
                              // this.navCtrl.push(MapPage, 
                              // {mobile: this.response.mobile_no
                              // });
                            }
                          }
                        ]
                      });
                      alert.present();
                      
                    } else {
                      console.log("array count else--"+this.dataToSend.vehicleArray.length);
                      this.showAlert("Parking", "The Mobile number entered already exists. Please enter another.");
                    }
                   });
                }             
              }else{
                this.showAlert("Parking", "Must provide one vehicle information");
                
              }            
              // if (this.dataToSend.vehicleNo.length > 0) {
                console.log(this.dataToSend.gender);            
              
              // }else {
              //   this.showAlert("Error", "Please enter vehicle number");
              // }
            } else {
              this.showAlert("Error", "Please enter email id");
            }
          } else {
            this.showAlert("Error", "Please select gender");
          }
        } else {
          this.showAlert("Error", "Mobile number must be 10 digit")
        }    
      }else{
        this.showAlert("Error", "Please enter mobile number");
      }
    }else{
      this.showAlert("Error", "Please enter name");
    }
    this.dismissLodaing();
  }

  //go to Terms and conditions page
  goToTermsNCondPage(){
    this.navCtrl.push(TermsNConditionsPage);
  }

  //Alert
  showAlert(title:string, msg:string){
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

  // genderChange(val: any) {    
  //   if (val != "") {
  //     this.dataToSend.gender = val;
  //     console.log('Year Change:', val);                    
  //   }    
  // }

  //ADD ROW
  btnAdd(){
    // this.dataToSend.vehicleArray.forEach(element => {
    //   if (element.vehicleNo != this.vehicleNo) {
    //     console.log("------->if push" + element.vehicleNo);
        
    //     this.items = [];
    //     this.items = {'vehicleNo': this.vehicleNo, 'vehicleType': this.vehicleType};
    //     this.dataToSend.vehicleArray.push(this.items);
    //   }
    // });
    // if (this.boolOneTimeEntry == false) {
    //   this.items = [];
    //   this.items = {'vehicleNo': this.vehicleNo, 'vehicleType': this.vehicleType};
    //   this.dataToSend.vehicleArray.push(this.items);
    //   this.boolOneTimeEntry = true;
    // } else {
      
    // }
    //new code
    // if (this.dataToSend.vehicleArray.length > 0) {
    //   var lastAddress = this.dataToSend.vehicleArray[this.dataToSend.vehicleArray.length - 1];

    //   console.log("got--->"+lastAddress.vehicleNo);        
    //   console.dir(this.dataToSend.vehicleArray);

    //   if (lastAddress.vehicleNo.length > 0 && lastAddress.vehicleType.length > 0) {
    //     this.dataToSend.vehicleArray.push({'vehicleNo': '', 'vehicleType': ''});     
    //     console.log("If --------> A");        
    //   } else {
    //     this.showAlert("Parking", "Vehicle number or Vehicle type cannot be empty");
    //     console.log("Else--------> A");
    //   }             
    // } else {
    //   // this.showAlert("Parking", "Vehicle number or Vehicle type cannot be empty");
    //   if (this.vehicleNo != undefined && this.vehicleType != undefined) {
    //     this.dataToSend.vehicleArray.push({'vehicleNo': '', 'vehicleType': ''});     
    //     console.log("If --------> B");
        
    //   }else{
    //     this.showAlert("Parking", "Vehicle number or Vehicle type cannot be empty");
    //     console.log("Else--------> B");
    //   }
    // }
  //new code end
    // if (this.vehicleNo != undefined || this.vehicleType != undefined || lastAddress.vehicleNo != undefined) {
    //   this.dataToSend.vehicleArray.push({'vehicleNo': '', 'vehicleType': ''});     
    //   console.log("If-------->");
      
    // }else{
    //   this.showAlert("Parking", "Vehicle number or Vehicle type cannot be empty");
    //   console.log("Else-------->");
    // }
    
  }

  btnRemove(){
    // this.dataToSend.vehicleArray.pop();
    // console.dir(this.dataToSend.vehicleArray);
  }

  //Keyboard Function
  hideKeyboard() {
    this.keyboard.hide();
  }

}