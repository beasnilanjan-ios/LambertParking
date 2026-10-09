export interface ParkingHistoryArrayModel  {
    allotment_id?: string;
    parking_id?: string;
    vendor_userid?: string;
    citizen_id?: string;
    mobile?: string;
    vehicle_number?: string;
    vt_id?: string;
    entry_time?: string;
    exit_time?: string;
    fare?: string;
    exempted?: string;
    coupon?: string;
    position?: string;
    location?: string;
    vehicle_type?: string;
}

export interface ParkingHistoryResponseModel {
    status?: string;
    error?: string;
    parking_history?: ParkingHistoryArrayModel[];
}

// export interface ParkingHistoryResponseModel {
//     status?: string,
//     error?: string,
//     parking_history?:ParkingHistoryArrayModel[]    
// }

// export interface ParkingHistoryArrayModel {
//     name?:string,
//     allotment_id?: string,
//     parking_id?: string,
//     vendor_userid?: string,
//     citizen_id?: string,
//     mobile?: string,
//     vehicle_number?: string,
//     vehicle_type?: string,
//     entry_time?: string,
//     exit_time?: string,
//     fare?: string,
//     area_id?: string,
//     area_name?:string
//     start_position?:string,
//     end_position?:string
// }