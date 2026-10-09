export interface EntryModel {
    parking_id?: string;
    vehicle_type_id?: string;
    vehicle_number?: string;
    vendor_userid?: string;
    mobile?: string;
    entry_time?: string;
    token_no?: string;
    //-------------------

    // latitude?: string,
    // longitude?: string
}

export interface EntryResponseModel {
    agencyName?:string;
    bookingStatus?:string;
    entryTime?:string;
    html?:string;
    msg?:string;
    parkingLocation?:string;
    status?:string;
    tokenNo?:string;
    vehicleNo?:string;
    vehicleType?:string;
}