import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { MapPage } from '../map/map';
import { SessionManagerProvider } from '../../providers/session-manager/session-manager';
import { ApiConstant } from '../../Support/ApiConstant';
import { ActivityLoader } from '../../Support/ActivityLoader';
import { AlertCustom } from '../../Support/AlertCustom';
import { AdvanceBookingTokenItemModel } from '../../Model/map.model';

@Component({
  selector: 'page-coupons',
  templateUrl: 'coupons.html',
})
export class CouponsPage {

  couponList: AdvanceBookingTokenItemModel[] = [];
  noCouponsMessage: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private session: SessionManagerProvider,
    private actLoader: ActivityLoader,
    private alertView: AlertCustom
  ) {
    platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        this.navCtrl.setRoot(MapPage);
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CouponsPage');
    this.loadCoupons();
  }

  loadCoupons() {
    this.actLoader.presentLoading();
    this.couponList = [];
    this.noCouponsMessage = '';

    this.session.getResponseMapParkingSpace(ApiConstant.MainApi + ApiConstant.MapSpaceApi).subscribe(
      (mapRes) => {
        if (mapRes.status !== 'success' || !mapRes.parkingspace_list) {
          this.actLoader.dismissLodaing();
          this.alertView.showAlert('Coupons', 'Unable to load parking vendors.');
          return;
        }

        const vendorIds = Array.from(new Set(
          mapRes.parkingspace_list
            .filter(p => p.vehicles && p.vehicles.length > 0)
            .map(p => p.vendor_id)
            .filter(id => !!id)
        ));

        if (vendorIds.length === 0) {
          this.actLoader.dismissLodaing();
          this.noCouponsMessage = 'No vendors found.';
          return;
        }

        this.fetchCouponsForVendors(vendorIds);
      },
      (err) => {
        this.actLoader.dismissLodaing();
        console.error('loadCoupons parkingspace_list error:', err);
        this.alertView.showAlert('Coupons', 'Unable to load coupons. Please try again.');
      }
    );
  }

  fetchCouponsForVendors(vendorIds: string[]) {
    let pendingRequests = vendorIds.length;
    const allCoupons: AdvanceBookingTokenItemModel[] = [];

    vendorIds.forEach(vendorId => {
      console.log('advance_booking_token payload:', { vendor_id: vendorId });

      this.session.advanceBookingToken(
        ApiConstant.MainApi + ApiConstant.AdvanceBookingTokenApi,
        { vendor_id: String(vendorId) }
      ).subscribe(
        (res) => {
          console.log('advance_booking_token response:', JSON.stringify(res));

          if (res && res.status === 'success' && res.data && res.data.length > 0) {
            allCoupons.push(...res.data.filter(item => this.hasTokenNo(item)));
          }

          pendingRequests--;
          if (pendingRequests === 0) {
            this.finishCouponLoad(allCoupons);
          }
        },
        (err) => {
          console.error('advance_booking_token error:', err);
          pendingRequests--;
          if (pendingRequests === 0) {
            this.finishCouponLoad(allCoupons);
          }
        }
      );
    });
  }

  hasTokenNo(item: AdvanceBookingTokenItemModel): boolean {
    return item.token_no != null && String(item.token_no).trim().length > 0;
  }

  finishCouponLoad(allCoupons: AdvanceBookingTokenItemModel[]) {
    this.actLoader.dismissLodaing();
    this.couponList = allCoupons;
    if (this.couponList.length === 0) {
      this.noCouponsMessage = 'No coupons available.';
    }
  }

}
