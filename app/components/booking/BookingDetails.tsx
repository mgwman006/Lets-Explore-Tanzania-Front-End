import { Button, Card, Col, DatePicker, Form, Input, InputNumber, notification, Row, Statistic, Typography } from "antd";
import { BookingStepsProps, BookingDto, ContactPerson } from "../../models/booking";
import Meta from "antd/es/card/Meta";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { addBooking } from "../../services/admin/privateTourService";


//         localStorage.setItem("bookingData",JSON.stringify(currenBbookingData));

           // setBookingFormValues(values);


type NotificationType = 'success' | 'info' | 'warning' | 'error';          
export default function BookingDetails({ next }:BookingStepsProps)
{

    const [tourBookingForm] = Form.useForm<BookingDto>();
    const [bookingContactPerson,setBookingContactPerson] = useState<ContactPerson>();
    const [travellers, setTravellers] = useState<number>(1);
    const [tourDetails, setTourDetails] = useState<PrivateTourDetailsDto>();
    const [miniMumPricePerPerson, setMinimumPricePerPerson] = useState<number>(0);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [apiNotification, notificationContextHolder] = notification.useNotification();
    const [createdBooking, setCreatedBooking] = useState<BookingDto>();


    


    useEffect(() =>{
        const contactPerson = localStorage.getItem("bookingContactPerson");
        const dataTourDetails = localStorage.getItem("tourDetails");
        if(contactPerson)
        {
            const parsedContactPerson = JSON.parse(contactPerson);
            setBookingContactPerson(parsedContactPerson);
        }

        if(dataTourDetails)
        {
            const parsedDataTourDetails = JSON.parse(dataTourDetails);
            if (parsedDataTourDetails){
                const sortedPrice = parsedDataTourDetails.tourPrice.sort();
                const lastPrice = sortedPrice[sortedPrice.length-1];
                setTravellers(lastPrice.quantity);
                setMinimumPricePerPerson(lastPrice.pricePerPerson);
                setTourDetails(parsedDataTourDetails);
                tourBookingForm.setFieldValue("numberOfPeople",lastPrice.quantity);
            }
        }

    },[]);

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current < dayjs().endOf('day');
    };

    const openNotificationWithIcon = (type: NotificationType, message:string) => {
        apiNotification[type]({
        message: `${message}`,
        });
    };

    const handleSubmitBooking = (values: BookingDto) => {
            setConfirmLoading(true);
            setTimeout(() => {
                console.log(JSON.stringify(values));

                if(!bookingContactPerson || !values) return;

                const currenBbookingData : BookingDto =
                {
                    id:0,
                    tourId:tourDetails?.id??0,
                    pricePerPerson:values.pricePerPerson,
                    numberOfPeople:values.numberOfPeople,
                    totalPrice:values.numberOfPeople*miniMumPricePerPerson,
                    tourDate:values.tourDate,
                    specialRequests:values.specialRequests,
                    operatorId: tourDetails?.operatorId ?? 0,
                    referenceNumber:"",
                    contactPerson:bookingContactPerson
                };
                

                addBooking(currenBbookingData).then(
                (apiResponse) =>
                {
                    if(apiResponse.success)
                    {
                        setCreatedBooking(apiResponse.data);
                        openNotificationWithIcon('success',"booking created");
                        if(next) next();
                    }else
                    {
                        openNotificationWithIcon('error',apiResponse.message);
                    }
                    setConfirmLoading(false);
                    
                }
            ).catch(
                (error) =>
                {
                    openNotificationWithIcon('error',error);
                    setConfirmLoading(false);
                }
            );
    
            },1000);
           
            
            
            
    }

    return(
       <Row>
            {notificationContextHolder}
            <Col xs={22} sm={22} md={18} lg={12} xl={12} xxl={12}>
                <div>
                    <Typography.Title level={5}>Contact Person</Typography.Title>
                    <p>First Name : {bookingContactPerson?.firstName}</p>
                    <p>Last Name : {bookingContactPerson?.lastName}</p>
                    <p>Email : {bookingContactPerson?.email}</p>
                    <p>Phone Number : {bookingContactPerson?.phoneNumber}</p>
                </div>
                
                <Row gutter={16}>
                    <Col span={12}>
                    <Statistic title="Price Per Person" value={miniMumPricePerPerson}  />
                    </Col>
                    <Col span={12}>
                    <Statistic title="Total Price" value={travellers*miniMumPricePerPerson} />
                    </Col>
                </Row>
            </Col>
            <Col xs={22} sm={22} md={18} lg={12} xl={12} xxl={12}>
                <Form<BookingDto>
                    layout={"vertical"}
                    form={tourBookingForm}
                    // onFinish={verifyTourist}
                >
                    <Form.Item 
                        
                        label="Tour Date"
                        name="tourDate"
                        rules={[{required:true, message:"date is required"}]}
                    >
                        <DatePicker 
                            disabledDate={disabledDate}
                            format="YYYY-MM-DD"
                            style={{ width:"100%"}} 
                        />
                    </Form.Item>

                    <Form.Item 
                        label="Number Of People"
                        name="numberOfPeople"
                        rules={[{required:true, message:"number of people is required"}]}
                    >
                        <InputNumber 
                            onChange={(value : number | null) => {
                                setTravellers(value??0);
                                if(tourDetails && tourDetails?.tourPrice?.length>0)
                                {
                                    const pp = tourDetails?.tourPrice.find(x => x.quantity==value)?.pricePerPerson??miniMumPricePerPerson;
                                    setMinimumPricePerPerson(pp);
                                }
                                
                            }}
                            style={{ width:"100%"}} 
                        />
                    </Form.Item>

                    
                    <Form.Item 
                        label="Special Requests (Optional)"
                        name="specialRequests"
                    >
                        <TextArea 
                            rows={4} 
                            count={{
                            show: true,
                            max: 500,
                            }}
                        />
                    </Form.Item>


                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={confirmLoading}
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form> 
            </Col>
       </Row>
    );
}


