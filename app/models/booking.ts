import { Dayjs } from "dayjs";
export  interface BookingCreateDto
{
    tourId:number;
    customerName:string;
    email:string;
    phoneNumber:string;
    pricePerPerson:number;
    numberOfPeople:number;
    totalPrice:number;
    tourDate:Dayjs;
    specialRequests:string
}

export  interface CreatedBookingDto
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
    referenceNumber:string
}