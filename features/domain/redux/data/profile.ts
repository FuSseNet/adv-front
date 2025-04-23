import { ContactDto } from "./contact";
import { CountryDto } from "./country";
import { fileDto } from "./file";

export enum UserType{
    Student = "Student",
    Employee = "Employee"
}
export enum Gender{
    NotDefined = "NotDefined",
    Male = "Male",
    Female = "Female"
}
export interface Profile{
    id: string,
    email: string | null,
    lastName: string | null,
    firstName: string | null,
    patronymic: string | null,
    birthDate: Date,
    gender: Gender,
    avatar: fileDto,
    citizenship: CountryDto,
    adress: string | null,
    contacts: Array<ContactDto>,
    userTypes: Array<UserType>

}