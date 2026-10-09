export interface ParkedVehicleModel{
    allotment_id?: string,
    citizen_id?: string,
    coupon?: string,
    entry_time?: string,
    exempted?: string,
    exit_time?: string,
    fare?: string,
    mobile?: string,    
    parking_id?: string,
    sub_his_id?: string,
    token_no?: string,
    type?: string,
    vehicle_number?: string,
    vehicle_type?: string,
    vendor_userid?: string,   
    vt_id?: string
}

export interface ParkedVehicleResponseModel{
    status?:string,
    parkedvehicle_list?:ParkedVehicleModel[],
    
}

export interface ParkedVehicleList {
    parking_id?:string,
}
