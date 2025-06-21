
interface TourListItemDto
{
    id:number,
    title:string,
    description:string,
    pricePerPerson: number,
    durationDays:number,
    bannerImageUrl:string,
    destination:string,
    hasSpecificDates:boolean,
    tourDates:TourDate
}

interface AddTourDto
{
    title:string,
    overView:string,
    durationDays:number,
    destinations:string[],
    hasSpecificDates:boolean,
    tourDates?:TourDate
}

interface CreatedTourDto
{
    id:number,
    title:string,
    description:string,
    pricePerPerson: number,
    duration:number,
    isAvailableAllTheTime:boolean,
    destination:string,
}

interface TourDetailsDto
{
    id:number,
    title:string,
    description:string,
    pricePerPerson: number,
    durationDays:number,
    bannerImageUrl:string,
    destination:string,
    photos:String[],
    hasSpecificDates: boolean,
    tourDates: TourDate
}

interface TourDate{
    startDate:String,
    endDate:String
}

interface CurrencyDTO
{
    code:string,
    symbol:string
}

interface AddTourPriceDTO{
    quantity: number,
    pricePerPerson: number,
    currency: string
}

interface TourPriceDTO{
    id: number,
    quantity: number,
    pricePerPerson: number,
    currency: CurrencyDTO
}