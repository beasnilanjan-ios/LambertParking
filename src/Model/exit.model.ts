export interface ExitModel {
    allotmentId?: string,
    fare?: string,
    exempted?: string,
    coupon?: string,
    time?: string
}

export interface ExitResponseModel {
    agencyName?: string;
    bookingStatus?: string;
    entryTime?: string;
    exit_time?: string;
    fare?: string;
    hourdiff?: string;
    html?: string;    
    msg?: string;
    parkingLocation?: string;
    status?: string;
    tokenNo?: string;
    vehicleNo?: string;
    vehicleType?: string;
    
}