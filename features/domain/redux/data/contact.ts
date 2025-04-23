export enum ContactTypes{
    Phone = "Phone",
    Email = "Email",
    SocialMedia = "SocialMedia"
}

export interface ContactDto{
    value:string | null,
    type: ContactTypes
}