export interface LoginModel{
    phone?: string,
    password?: string,
    //rememberMe?: boolean;
}

// export interface Parking {
//     parking_id: string;
//     locationName: string;
// }

export interface LoginResponseModel {
    vendor_logged_in?: boolean;
    vender_user_id?: string;
    vendor_user_id?: string;
    name?: string;
    vendor_id?: string;
    vendor_phone_no?: string;
    profile_picture?: string;
    user_status?: string;
    // parkings: Parking[];
    login_status?: string;
}