import { OCRMobileResponseModel } from './../../Model/ocrMobile.model';
import { ParkingHistoryResponseModel } from './../../Model/parkingHistory.model';
import { HttpClient } from '@angular/common/http';
import { Http, RequestOptions, Headers } from "@angular/http";
import { Injectable } from '@angular/core';
import { LoginModel, LoginResponseModel } from '../../Model/login.model';
import { ParkingZoneResponseModel, VehicleListModel, ValidateUserResponseModel, ViewPlanModel } from '../../Model/parkingZone.model';
import { EntryModel, EntryResponseModel } from '../../Model/entry.model';
import { ParkedVehicleResponseModel, ParkedVehicleList } from './../../Model/parked.vehicle.model';
import { ExitModel, ExitResponseModel } from '../../Model/exit.model';
import { FareModel, FareResponseModel } from '../../Model/calculate.fare.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MapAreaResponseModel, CheckAdvanceBookingRequestModel, CheckAdvanceBookingResponseModel, AdvanceBookingRequestModel, AdvanceBookingResponseModel, AdvanceBookingTokenRequestModel, AdvanceBookingTokenResponseModel } from '../../Model/map.model';
import { CitizenSignupModel, CitizenSignupResponseModel, VehicleArrayModel, CitizenDeRegistrationModel, CitizenDeRegistrationResponseModel } from '../../Model/citizenSignup.model';
import { CitizenLoginModel, CitizenLoginResponseModel, CitizenProfileModel, CitizenChangePasswordResponseModel, ChangePasswordModel, CitizenForgotPasswordModel, CitizenForgotPasswordResponseModel, AttendantForgotPasswordModel, AttendantForgotPasswordResponseModel  } from '../../Model/citizenLogin.model';
import { AdvertisementModel, AdvertisementResponseModel } from '../../Model/advertisement.model';
import { ContactUsResponseModel } from '../../Model/contactUs.model';
import { TermsAndConditionsResponseModel } from '../../Model/termsAndConditions.model';
import { OCRModelResponse } from '../../Model/ocr.model';

@Injectable()
export class SessionManagerProvider {

  constructor(public http: HttpClient) {
    console.log('Hello SessionManagerProvider Provider');
  }

  private parseWebserviceJson<T>(text: string, fallback: T): T {
    const jsonStart = text.lastIndexOf('{"message"');
    if (jsonStart < 0) {
      const fallbackStart = text.indexOf('{');
      if (fallbackStart < 0) {
        return fallback;
      }
      return JSON.parse(text.substring(fallbackStart)) as T;
    }
    return JSON.parse(text.substring(jsonStart)) as T;
  }

  //LOGIN
  getResponseLogin(body: LoginModel, URL: string):Observable<LoginResponseModel>{
     let params = new FormData(); 
     params.append('phone', body.phone);
     params.append('password', body.password); 
     return this.http.post<LoginResponseModel>(URL,params)
  }

  //Signup by new user
  getCitizenSignup(URL: string, body: CitizenSignupModel):Observable<CitizenSignupResponseModel>{
    console.log("Signup details in getCitizenSignup()::::" + JSON.stringify(body));
    let params = new FormData(); 
    params.append('name', body.name);
    params.append('address', body.address); 
    params.append('mobile_no', body.mobile_no); 
    params.append('email', body.email); 
    params.append('password', body.password); 
    return this.http.post<CitizenSignupResponseModel>(URL,params)
 }
 //login by citizen
 getCitizenLogin(URL: string, body: CitizenLoginModel):Observable<CitizenLoginResponseModel>{
  console.log("Login details in getCitizenLogin()::::" + JSON.stringify(body));
  let params = new FormData(); 
  params.append('phone', body.phone); 
  params.append('password', body.password); 
  return this.http.post<CitizenLoginResponseModel>(URL,params)
}

//citizen change password
postCitizenChangePassword(URL: string, body: ChangePasswordModel):Observable<CitizenChangePasswordResponseModel>{
  console.log("Change password details in postCitizenChangePassword()::::" + JSON.stringify(body));
  let params = new FormData(); 
  params.append('phone', body.phone); 
  params.append('password', body.password); 
  return this.http.post<CitizenChangePasswordResponseModel>(URL,params)
}
//citizen forgot password
getCitizenForgotPassword(URL: string, body: CitizenForgotPasswordModel):Observable<CitizenForgotPasswordResponseModel>{
  console.log("Forgot password details in getCitizenForgotPassword()::::" + JSON.stringify(body));
  let params = new FormData(); 
  params.append('phone', body.phone); 
  return this.http.post<CitizenForgotPasswordResponseModel>(URL,params)
}
//get advertisement list
getCitizenAdList(URL: string):Observable<AdvertisementResponseModel>{
  return this.http.get<AdvertisementResponseModel>(URL)
}

//citizen de-registration
getCitizenDeRegistration(URL: string, body: CitizenDeRegistrationModel):Observable<CitizenDeRegistrationResponseModel>{
  console.log("de-registration details in getCitizenDeRegistration()::::" + JSON.stringify(body));
  let params = new FormData(); 
  params.append('citizen_id', body.citizen_id); 
  return this.http.post<CitizenDeRegistrationResponseModel>(URL,params)
}
//Get contact details
getContactUsDetails(URL: string):Observable<ContactUsResponseModel>{
  return this.http.get<ContactUsResponseModel>(URL)
}

//get terms-and-conditions
getTermsAndConditions(URL: string):Observable<TermsAndConditionsResponseModel>{
  return this.http.get<TermsAndConditionsResponseModel>(URL)
}

//anttendant forgot password
getAtendantForgotPassword(URL: string, body: AttendantForgotPasswordModel):Observable<AttendantForgotPasswordResponseModel>{
  console.log("Forgot password details in getAtendantForgotPassword()::::" + JSON.stringify(body));
  let params = new FormData(); 
  params.append('phone', body.phone); 
  return this.http.post<AttendantForgotPasswordResponseModel>(URL,params)
}

  //VALIDATE LOGGED IN USER --- Ifthe vendor has been disabled after login, then further functionality will be blocked
  getValidateLoggedInUser(URL: string):Observable<ValidateUserResponseModel>{
    return this.http.get<ValidateUserResponseModel>(URL)
  }
    
  //PARKING ZONES
  getResponseParkingZones(URL: string):Observable<ParkingZoneResponseModel> {
    return this.http.get<ParkingZoneResponseModel>(URL)
  }

  //VEHICLE TYPES
  getResponseVehicleType(URL: string):Observable<VehicleListModel> {
    return this.http.get<VehicleListModel>(URL)
  }

  //VIEW PLAN
  getResponseViewPlan(URL: string): Observable<ViewPlanModel> {
    console.log("ViewPlan URL--->"+URL)
    return this.http.get<ViewPlanModel>(URL)
  }

  //MAP PARKING LOCATION
  getResponseMapParkingSpace(URL: string):Observable<MapAreaResponseModel> {
    return this.http.get<MapAreaResponseModel>(URL)
  }

  checkAdvanceBookingRequest(URL: string, body: CheckAdvanceBookingRequestModel): Observable<CheckAdvanceBookingResponseModel> {
    const params = new FormData();
    params.append('parking_id', body.parking_id);
    params.append('vt_id', body.vt_id);
    params.append('vendor_id', body.vendor_id);
    return this.http.post(URL, params, { responseType: 'text' }).pipe(
      map((text: string) => this.parseWebserviceJson(
        text,
        { status: 'fail', message: 'Invalid response', data: { free_slot: 0 } }
      ))
    );
  }

  advanceBookingRequest(URL: string, body: AdvanceBookingRequestModel): Observable<AdvanceBookingResponseModel> {
    const params = new FormData();
    params.append('vendor_id', body.vendor_id);
    params.append('citizen_id', body.citizen_id);
    params.append('parking_id', body.parking_id);
    params.append('advance_id', body.advance_id);
    params.append('cars_no', body.cars_no);
    return this.http.post(URL, params, { responseType: 'text' }).pipe(
      map((text: string) => this.parseWebserviceJson(
        text,
        { status: 'fail', message: 'Invalid response' }
      ))
    );
  }

  advanceBookingToken(URL: string, body: AdvanceBookingTokenRequestModel): Observable<AdvanceBookingTokenResponseModel> {
    console.log('advance_booking_token HTTP POST:', URL, body);
    const params = new FormData();
    params.append('vendor_id', body.vendor_id);
    return this.http.post(URL, params, { responseType: 'text' }).pipe(
      map((text: string) => this.parseWebserviceJson(
        text,
        { status: 'fail', message: 'Invalid response' }
      ))
    );
  }

  //PARKING ENTRY
  getResponseParkingEntry(body: EntryModel, URL: string):Observable<EntryResponseModel>{
    let params = new FormData();
    params.append('parking_id',body.parking_id);
    params.append('mobile',body.mobile);
    params.append('vehicle_number',body.vehicle_number);
    params.append('vehicle_type_id',body.vehicle_type_id);
    params.append('vendor_userid',body.vendor_userid);
    params.append('entry_time', body.entry_time);
    params.append('token_no', body.token_no);
    // params.append('latitude', body.latitude);
    // params.append('longitude', body.longitude);
    return this.http.post<EntryResponseModel>(URL,params)
  }

  getParkedVehicleList(body:ParkedVehicleList, URL:string):Observable<ParkedVehicleResponseModel>{
    let params = new FormData();
    params.append('parking_id',body.parking_id);
    return this.http.post<ParkedVehicleResponseModel>(URL,params);
  }

  //EXIT VEHICLE
  getExitVehicle(body: ExitModel, URL: string):Observable<ExitResponseModel>{
    let params = new FormData();
    params.append('allotment_id', body.allotmentId);
    params.append('fare', body.fare);
    params.append('exempted', body.exempted);
    params.append('coupon', body.coupon);
    params.append('time',body.time);
    return this.http.post<EntryResponseModel>(URL, params);
  }

  //GET TOTAL FARE
  getTotalFare(URL:string, body: FareModel):Observable<FareResponseModel>{
    let params = new FormData();
    params.append('allotment_id', body.allotmentId);
    params.append('time', body.time);
    return this.http.post<FareResponseModel>(URL, params);
  }
 

  //CITIZEN PARKING HISTORY
  getCitizenParkingHistory(URL: string):Observable<ParkingHistoryResponseModel>{
    return this.http.get<ParkingHistoryResponseModel>(URL);
  }

  //GET OCR MOBILE NUMBER
  getOCRMobile(URL: string):Observable<OCRMobileResponseModel>{
    return this.http.get<OCRMobileResponseModel>(URL);
  }
  
  //Get Car number (added by Ipsita, 11/12/2019)
  scanCarImage(URL: string, image: string): Observable<OCRModelResponse>{
    const base64Image = image.indexOf('base64,') >= 0
      ? image.split('base64,')[1]
      : image;

    const imageBlob = this.base64ToBlob(base64Image, 'image/jpeg');
    const params = new FormData();
    params.append('image', imageBlob, 'numberplate.jpg');

    console.log("Number Plate OCR request sent (multipart file upload)");
    return this.http.post<OCRModelResponse>(URL, params);
  }

  private base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    return new Blob([new Uint8Array(byteNumbers)], { type: contentType });
  }
  
}