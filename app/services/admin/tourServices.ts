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

export const getTours = async () => {

    try {
        const response = await api.get<ApiResponse<TourListItemDto[]>>('/tour');
        return response.data;
    } catch (error) {
        const data : ApiResponse<TourListItemDto[]> = {
        success: false,
        message: typeof error === 'string' ? error : error instanceof Error ? error.message : JSON.stringify(error),
        data: [],
        statusCode: 0
      }
      return data;
    }
  
};

export const createTour = async (userData: AddTourDto) => {
  try {

    const response = await api.post<ApiResponse<TourDetailsDto>>('/tour', userData);
    return response.data;

    
  } catch (error) {
    alert("unknow error "+error);
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
            description:"",
            pricePerPerson: 0,
            durationDays:0,
            bannerImageUrl:"",
            destination:"",
            photos:[],
            hasSpecificDates:false,
            tourDates: { startDate:"",endDate:""}
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
            description:"",
            pricePerPerson: 0,
            durationDays:0,
            bannerImageUrl:"",
            destination:"",
            photos:[],
            hasSpecificDates:false,
            tourDates:{ startDate:"",endDate:""}
        },
        statusCode: 0
      }
      return data;

    }
};
