export interface CitizenLoginModel{
    phone: string   
    password: string;
    //rememberMe: boolean;
}

export interface CitizenLoginResponseModel{
    login_status?: string,
    citizen_profile?: CitizenProfileModel,
    error?:string,
    citizen_logged_in?: boolean,
    citizen_id?: string,
    name?: string,
    mobile_no?: string,
    address?: string

}

export interface CitizenProfileModel {
    citizen_id?: string,
    name?: string,
    mobile_no?: string,
    gender?: string,
    email?: string,
    address,
    otp?: string,
    status?: string,
    created_by?: string,
    updated_by?: string,
    created_date?: string,
    updated_date?: string,
    citizen_logged_in?: boolean
}

export interface ChangePasswordModel{
    phone?: string,
    oldPassword?: string,
    password?: string;
    confirmPassword?: string
}
export interface CitizenChangePasswordResponseModel{
    message?: string;
    status?: string;
}
export interface CitizenForgotPasswordModel{
    phone?: string

}
export interface CitizenForgotPasswordResponseModel{
    message?: string;
    status?: string;
    //password?: string
}

export interface AttendantForgotPasswordModel{
    phone?: string

}
export interface AttendantForgotPasswordResponseModel{
    message?: string;
    status?: string;
    //password?: string
}