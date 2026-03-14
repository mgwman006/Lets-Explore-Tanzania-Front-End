import { Dayjs } from "dayjs";

export interface ContactPerson
{
    firstName:string;
    lastName:string;
    email:string;
    phoneNumber:string
}

export  interface BookingDto
{
    id:number;
    tourId:number;
    contactPerson: ContactPerson;
    pricePerPerson:number;
    numberOfPeople:number;
    totalPrice:number;
    tourDate:Dayjs;
    specialRequests:string,
    referenceNumber:string,
    operatorId:number
}

export  interface BookingFormDataType
{
    id:number;
    tourId:number;
    customerName:string;
    email:string;
    phoneNumber:string;
    pricePerPerson:number;
    numberOfPeople:number;
    totalPrice:number;
    tourDate:Dayjs;
    specialRequests:string,
    referenceNumber:string,
    operatorId:number
}

export interface BookingStepsProps {
  next: () => void;  // function to go to next step (optional)
  back?: () => void; // function to go to previous step (optional)
}