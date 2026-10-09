import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { MapAreaResponseModel, MapParkingSpaceArrayModel, CheckAdvanceBookingDataModel } from '../../Model/map.model';
import { ApiConstant } from '../../Support/ApiConstant';
import { Geolocation } from '@ionic-native/geolocation';
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { CitizenParkingHistoryPage } from '../citizen-parking-history/citizen-parking-history';
import { Navbar } from 'ionic-angular';
import { ActivityLoader } from '../../Support/ActivityLoader';
import { AlertCustom } from '../../Support/AlertCustom';
import { AdvertisementModel, AdvertisementResponseModel } from '../../Model/advertisement.model';

declare var google: any;

// @IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  
  boolGPS: boolean = false;
  loader: any;
  response: MapAreaResponseModel;
  map:any;
  advertisements: AdvertisementModel[] =[];
  adResponse: AdvertisementResponseModel;
  alertShown: boolean = false;
  private advanceBookingDataMap: { [buttonId: string]: CheckAdvanceBookingDataModel } = {};
  private activeInfoWindow: any = null;

  @ViewChild('map') mapRef: ElementRef;
  @ViewChild(Navbar) navBar: Navbar;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public session: SessionManagerProvider, 
    private geolocation: Geolocation,
    private actLoader: ActivityLoader,
    private alertView: AlertCustom,
    private alertCtrl: AlertController,
    public platform: Platform,
    private ngZone: NgZone,
    
    ) {  
      this.platform.ready().then(() => {
        this.platform.registerBackButtonAction(() => {
          if (this.alertShown == false) {
            this.presentConfirm();
          }
        }, 0)
      })

    }

  ionViewDidLoad() {    
    this.actLoader.presentLoading(); 
    this.showMap();    
    this.showAd();   
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


  slidesDidLoad(slides) {
    console.log("&&&&&"+JSON.stringify(slides));
    slides.startAutoplay();
  }

  showMap(){
    //this.actLoader.presentLoading(); 
    //GET CURRENT LOCATION /* BMC LatLong - "22.5843346","88.4105554" */
    this.geolocation.getCurrentPosition().then((resp) => {
      this.boolGPS = true;
      console.log("lat------>" + resp.coords.latitude);
      console.log("long------>" + resp.coords.longitude);
      const myLocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      //Map Options
      const options = {
        center: myLocation,
        zoom: 13,
        streetViewControl: false,
        mapTypeId: 'roadmap',
        zoomControl: false,
        scaleControl: false,
        componentRestrictions: { country: 'IN' }
      }
      this.map = new google.maps.Map(this.mapRef.nativeElement, options);

      //Add Marker
      var marker = new google.maps.Marker({
        position: myLocation,
        map: this.map,
        title: "I'm here !!!",
        icon: '../../assets/icon/mylocation.png'
      });
      // Add info window
      var infowindow = new google.maps.InfoWindow({
        content: '<div><h3>Lambert Parking</h3></div>'
      });
      //Add click listener
      marker.addListener('click', function () {
        infowindow.open(this.map, marker);
      });
      this.getParkingZoneList();
    }).catch((error) => {
      this.boolGPS = false;
      console.log('Error getting location', error);
    });        

    if (!this.boolGPS) {
      this.showAlert("Lambert PArking","Current location not found. Please enable your GPS from phone settings and wait a few seconds")
    }
    
  }
  
  public handleAddressChange(address: Address) {
    // Do some stuff
    console.log("handle address change");
    const myLocation = new google.maps.LatLng(address.geometry.location.lat(),address.geometry.location.lng());
    const options = {
        center: myLocation,
        zoom: 14,
        streetViewControl: false,
        mapTypeId: 'roadmap',
        zoomControl: false,
        scaleControl: false,
        componentRestrictions: { country: 'IN' }
      }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.getParkingZoneList();
    console.log(address.geometry.location.lng());
    console.log(address.geometry.location.lat());
    console.log(address.geometry.location.toJSON());
    console.log(address.geometry.viewport.getNorthEast());
  }

  getParkingZoneList() {
    this.session.getResponseMapParkingSpace(ApiConstant.MainApi + ApiConstant.MapSpaceApi).subscribe((value: MapAreaResponseModel) => {
      this.response = value;
      if (this.response.status == "success") {
        console.log(this.response);
        this.response.parkingspace_list.forEach((element, index) => {
          const location = new google.maps.LatLng(element.latitude,element.longitude);
          
          //--------------------------------------------------------------
          var AppendInfoWindowContent = '';
          var TotalFreeSlots = 0;
          element.vehicles.forEach(vehicle => {
            var infoWindowContent = '<div class="sub-heading"><h3>'+ vehicle.vehicle_type +'</h3><h2> Free Slot(s): ' + vehicle.Free_slots + ' <br>Fare/hr: ₹ ' + vehicle.price + '</h2></div>';
            AppendInfoWindowContent = AppendInfoWindowContent+infoWindowContent;
            TotalFreeSlots = TotalFreeSlots + vehicle.Free_slots;
          });

          const closeBtnId = 'iw-close-btn-' + index;
          const advanceBookingBtnId = 'advance-booking-btn-' + index;
          const infowindowLocation = '<div class="iw-title">' + element.start_position + ' To ' + element.end_position + '</div>';
          const advanceBookingButton = '<div class="iw-advance-booking-wrap">'
            + '<button id="' + advanceBookingBtnId + '" class="iw-advance-booking-btn iw-advance-booking-loading" disabled>Checking...</button>'
            + '</div>';
          const popupContent = '<div class="iw-popup">'
            + '<div class="iw-popup-header">'
            + '<button id="' + closeBtnId + '" class="iw-close-btn" type="button" aria-label="Close" style="position:absolute;top:2px;right:8px;background:transparent;border:none;color:#666;font-size:22px;font-weight:bold;line-height:1;cursor:pointer;padding:0 4px;">&times;</button>'
            + '</div>'
            + infowindowLocation
            + AppendInfoWindowContent
            + advanceBookingButton
            + '</div>';

          var infowindow = new google.maps.InfoWindow({
            content: popupContent
          });

          infowindow.addListener('domready', () => {
            const defaultClose = document.querySelector('.gm-style-iw-chr, .gm-style-iw + button') as HTMLElement;
            if (defaultClose) {
              defaultClose.style.display = 'none';
            }

            const closeBtn = document.getElementById(closeBtnId);
            if (closeBtn) {
              closeBtn.onclick = () => {
                infowindow.close();
                if (this.activeInfoWindow === infowindow) {
                  this.activeInfoWindow = null;
                }
              };
            }

            const advanceBookingBtn = document.getElementById(advanceBookingBtnId);
            if (advanceBookingBtn) {
              advanceBookingBtn.onclick = () => {
                if (advanceBookingBtn.hasAttribute('disabled')) {
                  return;
                }
                this.onAdvanceBooking(element, advanceBookingBtnId);
              };
            }

            this.fetchAdvanceBookingForPopup(element, advanceBookingBtnId);
          });

          console.log('TOTAL FREE SLOTS---->'+TotalFreeSlots);

          const parkingIcon = TotalFreeSlots > 0
            ? '../../assets/imgs/parking-marker-active.svg'
            : '../../assets/imgs/parking-marker-full.svg';

          var marker = new google.maps.Marker({
            position: location,
            map: this.map,
            title: element.location,
            icon: {
              url: parkingIcon,
              scaledSize: new google.maps.Size(36, 44),
              anchor: new google.maps.Point(18, 44)
            }
          });
          
          // Add click listener
          marker.addListener('click', () => {
            if (this.activeInfoWindow) {
              this.activeInfoWindow.close();
            }
            infowindow.open(this.map, marker);
            this.activeInfoWindow = infowindow;
          });
        });
      } else {
        this.alertView.showAlert("Oops", "Some error occured. Please try after some times");
      }
    });
  this.actLoader.dismissLodaing();
}

showAd(){
  //this.actLoader.presentLoading();
  this.session.getCitizenAdList(ApiConstant.MainApi + ApiConstant.CitizenAdApi).subscribe((res : AdvertisementResponseModel) => {
    this.adResponse = res;
    console.log("response data is::::"+JSON.stringify(this.adResponse));
    if (this.adResponse.status == "success") {
      //this.actLoader.dismissLodaing();
      for(let ad of this.adResponse.advertisements){
        this.advertisements.push(ad);
      }      
    }
  });
  this.actLoader.dismissLodaing();
}

//Alert
showAlert(title: string, msg: string, onOk?: () => void) {
  const alert = this.alertCtrl.create({
    title: title,
    subTitle: msg,
    enableBackdropDismiss: !onOk,
    buttons: [{
      text: 'OK',
      handler: () => {
        if (onOk) {
          this.ngZone.run(() => onOk());
        }
        return true;
      }
    }]
  });
  alert.present();
}
  
  btnHistory() {
    this.navCtrl.push(CitizenParkingHistoryPage);
  }

  onAdvanceBooking(parkingSpace: MapParkingSpaceArrayModel, buttonId: string) {
    const bookingData = this.advanceBookingDataMap[buttonId];
    if (!bookingData || !bookingData.adv_id) {
      this.showAlert('Advance Booking', 'Booking details not available. Please tap the marker again.');
      return;
    }

    const citizenId = localStorage.getItem('citizen_id');
    if (!citizenId) {
      this.showAlert('Advance Booking', 'Citizen ID not found. Please log in again.');
      return;
    }

    const vendorId = bookingData.vendor_id || parkingSpace.vendor_id;
    const parkingId = bookingData.parking_id || parkingSpace.parking_id;
    const requestBody = {
      vendor_id: String(vendorId),
      citizen_id: String(citizenId),
      parking_id: String(parkingId),
      advance_id: String(bookingData.adv_id),
      cars_no: '1'
    };

    console.log('advance_booking_request payload:', requestBody);
    this.actLoader.presentLoading();

    this.session.advanceBookingRequest(
      ApiConstant.MainApi + ApiConstant.AdvanceBookingApi,
      requestBody
    ).subscribe(
      (res) => {
        this.actLoader.dismissLodaing();
        console.log('advance_booking_request response:', JSON.stringify(res));
        const message = (res.message || JSON.stringify(res)).trim();
        const isSuccessfulBooking = message.toLowerCase() === 'sucessfull';

        if (isSuccessfulBooking) {
          console.log('advance_booking_request: Sucessfull — token API will run after OK click');
          this.showAlert('Advance Booking', message, () => {
            this.fetchAdvanceBookingToken(String(vendorId));
          });
        } else {
          console.log('advance_booking_request: token API skipped. message =', message);
          this.showAlert('Advance Booking', message);
        }
      },
      (err) => {
        this.actLoader.dismissLodaing();
        console.error('advance_booking_request error:', err);
        this.showAlert('Advance Booking', 'Request failed. Please try again.');
      }
    );
  }

  fetchAdvanceBookingToken(vendorId: string) {
    console.log('advance_booking_token payload:', { vendor_id: vendorId });
    this.actLoader.presentLoading();

    this.session.advanceBookingToken(
      ApiConstant.MainApi + ApiConstant.AdvanceBookingTokenApi,
      { vendor_id: vendorId }
    ).subscribe(
      (res) => {
        this.actLoader.dismissLodaing();
        console.log('advance_booking_token response:', JSON.stringify(res));
      },
      (err) => {
        this.actLoader.dismissLodaing();
        console.error('advance_booking_token error:', err);
        this.showAlert('Advance Booking Token', 'Request failed. Please try again.');
      }
    );
  }

  fetchAdvanceBookingForPopup(parkingSpace: MapParkingSpaceArrayModel, buttonId: string) {
    const btn = document.getElementById(buttonId);
    if (!btn) {
      return;
    }

    this.setAdvanceBookingButtonLoading(btn);

    if (!parkingSpace.vehicles || parkingSpace.vehicles.length === 0) {
      this.setAdvanceBookingButtonFull(btn);
      return;
    }

    let pendingRequests = 0;
    let hasAvailableSlot = false;
    let noPlanAssignedCount = 0;
    let otherFailureCount = 0;
    let bookingData: CheckAdvanceBookingDataModel = null;

    parkingSpace.vehicles.forEach(vehicle => {
      const parkingId = parkingSpace.parking_id || vehicle.parking_id;
      const vtId = vehicle.vt_id || vehicle.vehicle_type_id;
      const vendorId = parkingSpace.vendor_id || vehicle.vendor_id;

      if (!parkingId || !vtId || !vendorId) {
        console.warn('Missing advance booking params', { parkingId, vtId, vendorId, parkingSpace, vehicle });
        return;
      }

      pendingRequests++;

      this.session.checkAdvanceBookingRequest(
        ApiConstant.MainApi + ApiConstant.CheckAdvanceBookingApi,
        {
          parking_id: String(parkingId),
          vt_id: String(vtId),
          vendor_id: String(vendorId)
        }
      ).subscribe(
        (res) => {
          console.log('check_advance_booking_request response:', {
            parking_id: parkingId,
            vt_id: vtId,
            vendor_id: vendorId,
            response: res
          });

          pendingRequests--;
          const freeSlot = res && res.data ? Number(res.data.free_slot) : 0;
          const responseMessage = (res && res.message) ? res.message.trim() : '';
          const isNoPlanAssigned = responseMessage.toLowerCase() === 'sorry! no plan is assigned';

          if (res && res.status === 'success' && freeSlot > 0) {
            hasAvailableSlot = true;
            if (!bookingData) {
              bookingData = res.data;
            }
          } else if (isNoPlanAssigned) {
            noPlanAssignedCount++;
          } else {
            otherFailureCount++;
          }

          if (pendingRequests === 0) {
            if (hasAvailableSlot) {
              this.advanceBookingDataMap[buttonId] = bookingData;
              this.setAdvanceBookingButtonAvailable(btn);
            } else if (noPlanAssignedCount > 0 && otherFailureCount === 0) {
              delete this.advanceBookingDataMap[buttonId];
              this.hideAdvanceBookingButton(btn);
            } else {
              delete this.advanceBookingDataMap[buttonId];
              this.setAdvanceBookingButtonFull(btn);
            }
          }
        },
        (err) => {
          console.error('check_advance_booking_request error:', err);
          pendingRequests--;
          if (pendingRequests === 0) {
            delete this.advanceBookingDataMap[buttonId];
            this.setAdvanceBookingButtonFull(btn);
          }
        }
      );
    });

    if (pendingRequests === 0) {
      this.setAdvanceBookingButtonFull(btn);
    }
  }

  setAdvanceBookingButtonLoading(btn: HTMLElement) {
    btn.textContent = 'Checking...';
    btn.setAttribute('disabled', 'true');
    btn.classList.remove('iw-advance-booking-available', 'iw-advance-booking-full');
    btn.classList.add('iw-advance-booking-loading');
  }

  setAdvanceBookingButtonAvailable(btn: HTMLElement) {
    btn.textContent = 'Advance Booking';
    btn.removeAttribute('disabled');
    btn.classList.remove('iw-advance-booking-loading', 'iw-advance-booking-full');
    btn.classList.add('iw-advance-booking-available');
  }

  setAdvanceBookingButtonFull(btn: HTMLElement) {
    btn.textContent = 'Advance Booking Slot is Full';
    btn.setAttribute('disabled', 'true');
    btn.classList.remove('iw-advance-booking-loading', 'iw-advance-booking-available');
    btn.classList.add('iw-advance-booking-full');
    btn.style.display = '';
    const wrap = btn.closest('.iw-advance-booking-wrap') as HTMLElement;
    if (wrap) {
      wrap.style.display = '';
    }
  }

  hideAdvanceBookingButton(btn: HTMLElement) {
    const wrap = btn.closest('.iw-advance-booking-wrap') as HTMLElement;
    if (wrap) {
      wrap.style.display = 'none';
    } else {
      btn.style.display = 'none';
    }
  }

}