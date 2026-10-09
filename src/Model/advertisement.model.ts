export interface AdvertisementModel {
    ad_id: string;
    ad_title: string;
    ad_description: string;
    ad_filename: string;
    ad_file_extension?: any;
    ad_external_link: string;
    created_date: string;
    status: string;
}

export interface AdvertisementResponseModel {
    advertisements: AdvertisementModel[];
    status: string;
}