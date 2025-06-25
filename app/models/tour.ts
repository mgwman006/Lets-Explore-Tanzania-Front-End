
interface PrivateTourListItemDto
{
    id:number,
    title:string,
    overView:string,
    durationDays:number,
    bannerImageUrl:string,
    destinations:string[],
    tourPrice: TourPriceDTO[],
}

interface PrivateTourAddDto
{
    title:string,
    overView:string,
    durationDays:number,
    destinations:string[],
}

interface PrivateTourCreatedDto
{
    id:number,
    tourGuideId:number,
    title:string,
    overView:string,
    durationDays:number,
    bannerImageUrl:string,
    destinations:string[],
}

interface PrivateTourDetailsDto
{
    id:number,
    title:string,
    overView:string,
    durationDays:number,
    bannerImageUrl:string,
    destinations:string[],
    tourPrice: TourPriceDTO[],
    photo:string[]
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

interface AddTourActivityDTO
{
    dayNumber: number,
    title: string,
    description: string,
    location: string,
    startTime: string,
    endTime: string,

}

interface TourActivityDTO
{
    id: number,
    dayNumber: number,
    title: string,
    description: string,
    location: string,
    startTime: string,
    endTime: string,
    photos: string[]
}

interface MeetingPoint
{
    details: string,
    location: string,
    dateTime: string,
}

interface TourGuideDTO
{
    id: number,
    pickUpInformation: MeetingPoint,
    endOfTourInformation: MeetingPoint,
    tourActivities: TourActivityDTO[]
}

interface UpdateTourDetailsDTO
{
    title: string,
    overView: string,
    durationDays: number,
    destinations: string[],
}

interface UpdateTourPriceDTO{
    quantity: number,
    pricePerPerson: number,
    currency: string
}