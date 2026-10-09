export interface FareModel {
    allotmentId?: string,
    time?: string
}

export interface FareResponseModel {
    fare?:string,
    token_no?: string,
    status?:string,
    hourdiff?:string,
    exit_time?:string,
    error?:string,
    type?:string,
    gstAmount?:string,
    gstPercentage?:string,
    baseFare?:string
}