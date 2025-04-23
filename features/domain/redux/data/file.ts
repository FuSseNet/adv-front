export enum Extension{
    NotDefined = "NotDefined",
    Doc = "Doc",
    Docx = "Docx",
    Bmp = "Bmp",
    Gif = "Gif",
    Jpeg = "Jpeg",
    Jpg = "Jpg",
    Png = "Png",
    Pdf = "Pdf",
    Rar = "Rar",
    Xls = "Xls",
    Xlsx = "Xlsx",
    Zip = "Zip",
    Txt = "Txt",
    Heic = "Heic",
    Heif = "Heif",
    Sig = "Sig"
}
export interface fileDto{
    id:string,
    name:string | null,
    extension: Extension,
    size: number
}