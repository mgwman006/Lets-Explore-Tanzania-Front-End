
interface TourListItemDto
{
    id:number,
    title:string,
    description:string,
    pricePerPerson: number,
    duration:number,
    isAvailableAllTheTime:boolean,
    destination:string,
    getBannerImageUrl:string
}

interface AddTourDto
{
    title:string,
    description:string,
    pricePerPerson: number,
    duration:number,
    isAvailableAllTheTime:boolean,
    destination:string,
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
    duration:number,
    isAvailableAllTheTime:boolean,
    destination:string,
    getBannerImageUrl:string,
    photos:String[],
    AvailableDates: TourDate[]
}

interface TourDate{
    startDate:String,
    endDate:String
}