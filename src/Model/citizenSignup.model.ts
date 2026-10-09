export interface CitizenSignupModel {
    mobile_no?: string,    
    name?: string,
    address?: string;
    gender?: string,
    email?: string,
    password?: string,
    vehicleArray?: VehicleArrayModel[]
}

export interface CitizenSignupResponseModel {
    status?: string,
    mobile_no?: string,
    error?: string
}

export interface VehicleArrayModel {
    vehicleNo?:any,
    vehicleType?:any
}

export interface CitizenDeRegistrationModel {
    citizen_id?: string;
}

export interface CitizenDeRegistrationResponseModel {
    message?: string;
    status?: string;
}