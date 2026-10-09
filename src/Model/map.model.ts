export interface Vehicle {
    vpv_id?: string;
    sub_his_id?: string;
    vendor_id?: string;
    parking_id?: string;
    vt_id?: string;
    price?: string;
    num_of_vehicles?: string;
    active?: string;
    vehicle_type_id?: string;
    vehicle_type?: string;
    Total_slot?: string;
    Rate?: string;
    Occupied?: string;
    Free_slots?: number;
}

export interface MapParkingSpaceArrayModel {
    parking_id?: string;
    vendor_id?: string;
    vendor_no?: string;
    vendor_type?: any;
    sub_his_id?: string;
    area_id?: string;
    location?: string;
    latitude?: string;
    start_position?: string;
    end_position?: string;
    longitude?: string;
    image_url?: string;
    vendor_status?: string;
    status?: string;
    created_by?: string;
    create_date?: string;
    active?: string;
    vehicles?: Vehicle[];
}

export interface MapAreaResponseModel {
    status?: string;
    parkingspace_list?: MapParkingSpaceArrayModel[];
}

export interface CheckAdvanceBookingRequestModel {
    parking_id?: string;
    vt_id?: string;
    vendor_id?: string;
}

export interface CheckAdvanceBookingDataModel {
    adv_id?: string;
    vendor_id?: string;
    adv_name?: string;
    parking_id?: string;
    pass_type_id?: string;
    booking_type_id?: string;
    vt_id?: string;
    price?: string;
    free_slot?: number;
}

export interface CheckAdvanceBookingResponseModel {
    status?: string;
    message?: string;
    data?: CheckAdvanceBookingDataModel;
}

export interface AdvanceBookingRequestModel {
    vendor_id?: string;
    citizen_id?: string;
    parking_id?: string;
    advance_id?: string;
    cars_no?: string;
}

export interface AdvanceBookingResponseModel {
    status?: string;
    message?: string;
    data?: any;
}

export interface AdvanceBookingTokenRequestModel {
    vendor_id?: string;
}

export interface AdvanceBookingTokenItemModel {
    id?: string;
    vendor_id?: string;
    customer_id?: string;
    token_no?: string;
    parking_id?: string;
    ref_no?: string;
    status?: string;
    location?: string;
    start_position?: string;
    end_position?: string;
}

export interface AdvanceBookingTokenResponseModel {
    status?: string;
    message?: string;
    data?: AdvanceBookingTokenItemModel[];
}



//-=-=-=-=-=-=-==-=--===-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// export interface MapAreaResponseModel {
//     status?: string,
//     parkingspace_list?: MapParkingSpaceArrayModel[]
// }

// export interface MapParkingSpaceArrayModel {
//     parking_id?: string,
//     area_id?:string,
//     area?: string,
//     latitude?: string,
//     longitude?: string,
//     total_4wheeler_slot?: string,
//     booked_4wheeler_slot?: string,
//     total_2wheeler_slot?: string,
//     booked_2wheeler_slot?: string,
//     fare_4wheeler?: string,
//     fare_2wheeler?: string,
//     fare1_4wheeler?: string,
//     fare1_2wheeler?: string,
//     start_position?:string,
//     end_position?:string,
//     status?:string,
//     created_by?:string,
//     create_date?:string,
//     image_url?: string,

//     booked_bus_slot?: string,
//     end_latitude?: string,
//     end_longitude?: string,
//     fare1_bus?: string,
//     fare_bus?: string,
//     total_bus_slot?: string,
//     zone_name?: string
// }