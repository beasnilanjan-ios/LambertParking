import { ParkingHistoryResponseModel, ParkingHistoryArrayModel } from './../../Model/parkingHistory.model';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform} from 'ionic-angular';
import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { ApiConstant } from '../../Support/ApiConstant';
import { ActivityLoader } from '../../Support/ActivityLoader';
import { AlertCustom } from '../../Support/AlertCustom';
import { MapPage } from '../map/map';

// @IonicPage()
@Component({
  selector: 'page-citizen-parking-history',
  templateUrl: 'citizen-parking-history.html',
})
export class CitizenParkingHistoryPage {

  response?: ParkingHistoryResponseModel;
  historyArray?: ParkingHistoryArrayModel[];
  loader: any;
  tempmobile: string;
  menuTitle: string;
  data: any;
  isSelectedFormSideMenu: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public session: SessionManagerProvider,
    private actLoader: ActivityLoader,
    private alertView: AlertCustom,
    public platform: Platform
    ) {
      platform.ready().then(() => {
        this.platform.registerBackButtonAction(() => {
          this.navCtrl.setRoot(MapPage);
        });
      });
     }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CitizenParkingHistoryPage');  
    // this.data=this.navParams.get('data.data');
    // console.log("menu title:::::" + JSON.stringify(this.data.data));

    // if(this.menuTitle === 'Parking History'){
    //   this.isSelectedFormSideMenu = true;
    // }
    // else{
    //   this.isSelectedFormSideMenu = false;
    // }
  }

  btnDone() {
    try {
      console.log("tempmobile---->" + this.tempmobile);
      if (this.tempmobile) {
        if (this.tempmobile.length == 10) {
          console.log("If mobile number found");
          console.log("Mobile: " + this.tempmobile);
          this.getHistoryData();
        } else {
          this.alertView.showAlert("Parking", "Mobile number should be 10 digits");
        }
      } else {
        console.log("Else no number");
        this.alertView.showAlert("Parking", "Please enter mobile number");
      }
    } catch (error) {
      console.log("catch block---->");
      console.log(JSON.stringify(error));
    }
  }

  getHistoryData() {
    //---PK-8 Mar 2019---Api response was modified by me because citizen table is blank due to no registration or login. Now the data is coming from parking_allotment table & parking_master table.
    try {      
      if (this.tempmobile.length > 0) {       
        this.actLoader.presentLoading();
        console.log("URl----->"+ApiConstant.MainApi + ApiConstant.ParkingHistoryApi+this.tempmobile);
        this.session.getCitizenParkingHistory(ApiConstant.MainApi + ApiConstant.ParkingHistoryApi+this.tempmobile).subscribe((value: ParkingHistoryResponseModel) => {
          this.response = value;
          console.log("history success----->"+JSON.stringify(this.response));
          if (this.response.status == "success") {
            this.historyArray = this.response.parking_history;
          console.log("response history-------"+this.response.parking_history);            
          }else {
            this.alertView.showAlert("Parking", this.response.error);
            this.historyArray = [];
          }         
        });
      }
    } catch (error) {
      console.log(error);      
    }
    this.actLoader.dismissLodaing();
  }
  

}
