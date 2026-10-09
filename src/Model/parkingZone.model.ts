export interface ParkingZoneResponseModel {
    status?: string,
    parking?: ParkingArrayModel[]
}

export interface ParkingArrayModel {
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
    position?: string;
}

export interface VehicleTypeArray {
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
    corp_sub_id?: string;
    advance_slot?: string;
    plan_id?: string;
    free_minute?: string;
    occupied_advance_slot?: string;
}

export interface VehicleListModel {
    status?: string;
    parkings?: VehicleTypeArray[];
}

export interface ValidateUserResponseModel {
    value?: string;
    status?: string;
}

export interface ViewPlanModel {
    status?: string;
    plans?: ViewPlansArray[];
    message?: string;
    disclaimer?: string;
}

export interface ViewPlansArray {
    free_minute?: string;
    vt_id?: string;
    scheme_id?: string;
    one_time?: string;
    from_hour?: string;
    upto_price?: string;
    repeat_hour?: string;
    charge?: string;
}
