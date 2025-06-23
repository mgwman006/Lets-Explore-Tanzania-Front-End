import api from '../../api/api';

export const addBannerImage = async (tourId: number,image: FormData) => {
  
    try {
        const response = await api.post<ApiResponse<null>>(`/tour/${tourId}/banner`, image, 
        {
            headers: {'Content-Type': 'multipart/form-data'},
        }
        
        );
        return response.data;
      
    } catch (error) {
      const data : ApiResponse<null> = {
        success: false,
        message: typeof error === 'string' ? error : error instanceof Error ? error.message : JSON.stringify(error),
        data: null,
        statusCode: 0
      }
      return data;

    }
};

export const getPrivateTours = async () => {

    try {
        const response = await api.get<ApiResponse<PrivateTourListItemDto[]>>('/tour/private');
        return response.data;
    } catch (error) {
        const data : ApiResponse<PrivateTourListItemDto[]> = {
        success: false,
        message: typeof error === 'string' ? error : error instanceof Error ? error.message : JSON.stringify(error),
        data: [],
        statusCode: 0
      }
      return data;
    }
  
};

export const createPrivateTour = async (userData: FormData) => {
  try {

    const response = await api.post<ApiResponse<PrivateTourCreatedDto>>(
        '/tour/private', userData,
        {
            headers: {'Content-Type': 'multipart/form-data'},
        }
    );
    return response.data;

    
  } catch (error) {
    const data : ApiResponse<PrivateTourCreatedDto> = {
      success: false,
      message: typeof error === 'string' ? error : error instanceof Error ? error.message : JSON.stringify(error),
      data: {
          id:0,
          title:"",
          overView:"",
          durationDays:0,
          bannerImageUrl:"",
          destinations:[]
      },
      statusCode: 0
    }
    return data;
  }
};

export const deteleTour = async (tourId: number) => {
  
    try {
        const response = await api.delete<ApiResponse<null>>(`/tour/${tourId}`);
        return response.data;
      
    } catch (error) {
      const data : ApiResponse<null> = {
        success: false,
        message: typeof error === 'string' ? error : error instanceof Error ? error.message : JSON.stringify(error),
        data: null,
        statusCode: 0
      }
      return data;

    }
};

export const addPhotos = async (tourId: number,photos: FormData) => {
  
    try {
        const response = await api.post<ApiResponse<TourDetailsDto>>(`/tour/${tourId}/photos`, photos, 
        {
            headers: {'Content-Type': 'multipart/form-data'},
        }
        
        );
        return response.data;
      
    } catch (error) {
      const data : ApiResponse<TourDetailsDto> = {
        success: false,
        message: typeof error === 'string' ? error : error instanceof Error ? error.message : JSON.stringify(error),
        data: {
            id:0,
            title:"",
            overView:"",
            durationDays:0,
            bannerImageUrl:"",
            destinations:[],
            hasSpecificDates:false,
            tourDates: { startDate:"",endDate:""},
            tourPrice:[]
        },
        statusCode: 0
      }
      return data;

    }
};

export const getTourDetails = async (tourId: number) => {
  
    try {
        const response = await api.get<ApiResponse<TourDetailsDto>>(`/tour/${tourId}`);
        return response.data;
      
    } catch (error) {
      const data : ApiResponse<TourDetailsDto> = {
        success: false,
        message: typeof error === 'string' ? error : error instanceof Error ? error.message : JSON.stringify(error),
        data: {
            id:0,
            title:"",
            overView:"",
            durationDays:0,
            bannerImageUrl:"",
            destinations:[],
            hasSpecificDates:false,
            tourDates: { startDate:"",endDate:""},
            tourPrice:[]
        },
        statusCode: 0
      }
      return data;

    }
};

export const getDestinations = async () => {

    try {
        const response = await api.get<ApiResponse<string[]>>('/destination');
        return response.data;
    } catch (error) {
      const data : ApiResponse<string[]> = {
        success: false, 
        message: typeof error === 'string' ? error : error instanceof Error ? error.message : JSON.stringify(error),
        data: [],
        statusCode: 0
      }
      return data;
      
    }
  
};

export const getCurrencies = async () => {

    try {
        const response = await api.get<ApiResponse<CurrencyDTO[]>>('/currency');
        return response.data;
    } catch (error) {
      const data : ApiResponse<CurrencyDTO[]> = {
        success: false, 
        message: typeof error === 'string' ? error : error instanceof Error ? error.message : JSON.stringify(error),
        data: [],
        statusCode: 0
      }
      return data;
      
    }
  
};

export const addTourPrices = async (tourId: number,tourPrices : AddTourPriceDTO[]) => {

    try {
        const response = await api.post<ApiResponse<TourPriceDTO[]>>(`tour/private/${tourId}/prices`, tourPrices);
        return response.data;
    } catch (error) {
      const data : ApiResponse<TourPriceDTO[]> = {
        success: false, 
        message: typeof error === 'string' ? error : error instanceof Error ? error.message : JSON.stringify(error),
        data: [],
        statusCode: 0
      }
      return data;
      
    }
  
};

export const addTourActivity = async (tourId: number,formData:FormData) => {
  
    
      try {
          
          const photoResponse = await api.post<ApiResponse<TourActivityDTO[]>>(`/tour/private/${tourId}/activity`, formData, 
          {
              headers: {'Content-Type': 'multipart/form-data'},
          }
          
          );
          return photoResponse.data;
        
      } catch (error) {
        const data : ApiResponse<TourActivityDTO[]> = {
          success: false,
          message: typeof error === 'string' ? error : error instanceof Error ? error.message : JSON.stringify(error),
          data: [],
          statusCode: 0
        }
        return data;
  
      }
};

export const createTourGuide = async (tourId: number,pickUpInformation: MeetingPoint) => {
  
    try {
        const response = await api.post<ApiResponse<TourGuideDTO>>(`/tour/private/${tourId}/guide`, pickUpInformation);
        return response.data;
      
    } catch (error) {
      const data : ApiResponse<TourGuideDTO> = {
        success: false,
        message: typeof error === 'string' ? error : error instanceof Error ? error.message : JSON.stringify(error),
        data: {
            id:0,
            pickUpInformation:{details:"",location:"",dateTime:""},
            endOfTourInformation:{details:"",location:"",dateTime:""},
            tourActivities:[]
        },
        statusCode: 0
      }
      return data;

    }
}

export const addEndOfTourInformation = async (tourGuideId: number,endOfTourInformation: MeetingPoint) => {
  
    try {
        const response = await api.post<ApiResponse<MeetingPoint>>(`/tour/private/guide/${tourGuideId}/point/end`, endOfTourInformation);
        return response.data;
      
    } catch (error) {
      const data : ApiResponse<MeetingPoint> = {
        success: false,
        message: typeof error === 'string' ? error : error instanceof Error ? error.message : JSON.stringify(error),
        data: {
            details:"",
            location:"",
            dateTime: ""
        },
        statusCode: 0
      }
      return data;

    }
}