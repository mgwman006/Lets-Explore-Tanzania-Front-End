import { CalendarFilled, CalendarOutlined, CalendarTwoTone, ClockCircleFilled, ClockCircleTwoTone, DeleteColumnOutlined, DeleteOutlined, DeleteRowOutlined, EnterOutlined, EnvironmentFilled, EnvironmentOutlined, EnvironmentTwoTone, ExclamationCircleOutlined, FieldTimeOutlined, LikeOutlined, LoadingOutlined, MoneyCollectTwoTone, PlusOutlined, RightOutlined, SmileOutlined, SolutionOutlined, UploadOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { InputNumber,Form,notification, Input, DatePicker, Button, Flex, Result, Steps, Row, Col } from 'antd';
import { BookingCreateDto, CreatedBookingDto } from "../models/booking";
import { useEffect, useState } from 'react';
import { addBooking, getPrivateTourDetails, getTourGuideDetails, sendOtp, updatePrivateTour, verifyEmail, verifyOtp } from "../services/admin/privateTourService";
import { TouristStatus } from '../models/tourist';
import TextArea from 'antd/es/input/TextArea';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { OtpVerificationRequestDTO } from '../models/auth';
import { useNavigate } from 'react-router-dom';



type NotificationType = 'success' | 'info' | 'warning' | 'error';


export default function BookingPage()
{
    const navigate = useNavigate();
    const [tourBookingForm] = Form.useForm<BookingCreateDto>();
    const [bokingFormValues, setBookingFormValues] = useState<BookingCreateDto>();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [createdBooking, setCreatedBooking] = useState<CreatedBookingDto>();
    const [apiNotification, notificationContextHolder] = notification.useNotification();
    const [stepCurrent,setStepCurrent] = useState<number>(0);
    const [resendOtpLoading, setResendOtpLoading] = useState<boolean>(false);
    const [travellers, setTravellers] = useState<number>(0);
    const [tourDetails, setTourDetails] = useState<PrivateTourDetailsDto>();
    const [otpVerificationForm] = Form.useForm<OtpVerificationRequestDTO>();
    const [otpVerificationFormValues, setOtpVerificationFormValues] = useState<OtpVerificationRequestDTO>();
    const [miniMumPricePerPerson, setMinimumPricePerPerson] = useState<number>(0);

    useEffect(() => {
        try 
        {
            const data = localStorage.getItem("bookingData");
            const dataTourDetails = localStorage.getItem("tourDetails");

            if (!data) return;
            if (!dataTourDetails) return;

            const parsedData = JSON.parse(data);
            const parsedDataTourDetails = JSON.parse(dataTourDetails);
            

            if (parsedData.tourDate) {
                parsedData.tourDate = dayjs(parsedData.tourDate);
            }

            if (parsedDataTourDetails){
                const sortedPrice = parsedDataTourDetails.tourPrice.sort();
                const lastPrice = sortedPrice[sortedPrice.length-1];
                setTravellers(lastPrice.quantity);
                setMinimumPricePerPerson(lastPrice.pricePerPerson);
                setTourDetails(parsedDataTourDetails);
            }

            setBookingFormValues(parsedData);
            tourBookingForm.setFieldsValue(parsedData);

        } 
        catch (error) 
        {
            console.error("Invalid booking data in localStorage");
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

     const handleSubmitBooking = (values: BookingCreateDto) => {
            setConfirmLoading(true);
            setTimeout(() => {
                console.log(JSON.stringify(values));
                addBooking(values).then(
                (apiResponse) =>
                {
                    if(apiResponse.success)
                    {
                        setCreatedBooking(apiResponse.data);
                        openNotificationWithIcon('success',"booking created");
                        setStepCurrent(2);
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
    const requestOtp = (emailValue : string) => {
        setConfirmLoading(true);
        sendOtp(
            {
                email: emailValue
            }
        )
        .then(
            (apiResponse) =>
            {
                if(apiResponse.success)
                {
                    openNotificationWithIcon('success',"otp send");
                    setStepCurrent(1);
                    
                }
                else{
                    openNotificationWithIcon('error',apiResponse.message);
                }
                setConfirmLoading(false);
            }
        )
        .catch(
            (error) =>
            {
                openNotificationWithIcon('error','unknown error '+error);
                setConfirmLoading(false);
            }
        )
    }

    const resendOtp = (emailValue : string) => {
        setResendOtpLoading(true);
        sendOtp(
            {
                email: emailValue
            }
        )
        .then(
            (apiResponse) =>
            {
                if(apiResponse.success)
                {
                    openNotificationWithIcon('success',"otp send");
                    setStepCurrent(1);
                    
                }
                else{
                    openNotificationWithIcon('error',apiResponse.message);
                }
                setResendOtpLoading(false);
                
            }
        )
        .catch(
            (error) =>
            {
                setResendOtpLoading(false);
                openNotificationWithIcon('error','unknown error '+error);
            }
        )
    }

     const verifyTourist = (values:BookingCreateDto) =>
        {
            setBookingFormValues(values);
            setConfirmLoading(true);
            const requestDto = {
                email:values.email
            };
    
            verifyEmail(requestDto)
            .then(
                (apiResponse) =>
                {
                    if(apiResponse.success)
                    {
                        if(apiResponse.data == TouristStatus.EXIST)
                        {
                            //add booking
                            console.log(JSON.stringify(values));
                            console.log(JSON.stringify(bokingFormValues));
                            handleSubmitBooking(values);
                           
                        }
                        else if ( apiResponse.data == TouristStatus.NONEXISTENT)
                        {
                            //SEND OTP
                            requestOtp(values.email);
                        }
                        else{
                            //error
                            openNotificationWithIcon('error',"unknown error");
                        }
                    }
                    else{
                        openNotificationWithIcon('error',apiResponse.message);
                    }
                    
                }
            ).catch( 
                (error) =>
                {
                    openNotificationWithIcon('error',error);
                    setConfirmLoading(false);
                }
            );
        }
    const sendOtpVerification = (values: OtpVerificationRequestDTO) => {
        setOtpVerificationFormValues(values);
        setConfirmLoading(true);
        verifyOtp(values)
        .then(
            (apiResponse) =>
            {
                if(apiResponse.success)
                {
                    if(bokingFormValues)
                    {
                        handleSubmitBooking(bokingFormValues);
                         setConfirmLoading(false);
                    }
                    else{
                        openNotificationWithIcon('error', "For some reasons booking data is null");
                         setConfirmLoading(false);
                        return;
                    }
                        
                    openNotificationWithIcon('success',"verified");
                }
                else{
                    openNotificationWithIcon('error',apiResponse.message);
                    setConfirmLoading(false);
                }
            }
        )
        .catch(
            (error) =>
            {
                setConfirmLoading(false);
                openNotificationWithIcon('error','unknown error '+error);
            }
        )
    }

    const stepsItems = [
        {
                        
            title: 'Booking Details',
            icon: <UserOutlined />,
            content: 
            (
                <Form<BookingCreateDto>
                    layout={"vertical"}
                    form={tourBookingForm}
                    onFinish={verifyTourist}
                >
                    <Form.Item 
                        label="Operator Id"
                        name="operatorId"
                    >
                        <InputNumber disabled style={{ width:"100%"}}/>
                    </Form.Item>
                    <Form.Item 
                        label="TourId"
                        name="tourId"
                    >
                        <InputNumber disabled style={{ width:"100%"}}/>
                    </Form.Item>
                    <Form.Item 
                        label="Name"
                        name="customerName"
                        rules={[{required:true, message:"user name is required"}]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item 
                        label="Email"
                        name="email"
                        rules={[{required:true, message:"email is required"}]}
                    >
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item 
                        label="Phone Number"
                        name="phoneNumber"
                        rules={[{required:true, message:"phoneNumber is required"}]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item 
                        label="Price PerPerson"
                        name="pricePerPerson"
                        rules={[{required:true, message:"price is required"}]}
                    >
                        <InputNumber disabled style={{ width:"100%"}} />
                    </Form.Item>
                    <Form.Item 
                        label="NumberOfPeople"
                        name="numberOfPeople"
                        rules={[{required:true, message:"number of people is required"}]}
                    >
                        <InputNumber 
                            onChange={(value : number | null) => {
                                setTravellers(value??0);
                                if(tourDetails && tourDetails?.tourPrice?.length>0)
                                {
                                    const pp = tourDetails?.tourPrice.find(x => x.quantity==value)?.pricePerPerson??miniMumPricePerPerson;
                                    tourBookingForm.setFieldValue("pricePerPerson",pp);
                                    tourBookingForm.setFieldValue("totalPrice", (value??0) *pp)
                                }
                                
                            }}
                            style={{ width:"100%"}} 
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Total Price"
                        name="totalPrice"
                        
                    >
                        <InputNumber style={{ width:"100%"}} disabled/>
                    </Form.Item>

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
                        label="Special Requests"
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
                        <Button type="primary" htmlType="submit" loading={confirmLoading}>Submit</Button>
                    </Form.Item>
                </Form>
            )
        },
        {
            title: 'Verification',
            icon: <SolutionOutlined />,
            content:(
                <Form<OtpVerificationRequestDTO>
                    layout={'vertical'}
                    form={otpVerificationForm}
                    onFinish={sendOtpVerification}
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{required:true, message:"Email Value is Required"}]}
                    >
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item
                        name="otp"
                        label="Otp"
                        rules={[{required:true, message:"Otp value is required"}]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item
                    >
                        <Flex vertical={false} gap={'small'}>
                            <Button 
                                loading={resendOtpLoading} 
                                variant="solid"
                                color="green" 
                                onClick={() => resendOtp(tourBookingForm.getFieldValue('email'))}
                            >
                                Request New Otp
                            </Button>
                            <Button 
                                loading={confirmLoading} 
                                type="primary" 
                                htmlType="submit"
                            >
                                Submit Otp
                            </Button>
                        </Flex>
                        
                    </Form.Item>
                </Form>
            )
        },
        {
            title: 'Done',
            icon: <SmileOutlined />,
            content: (
                <Result
                    status="success"
                    title="Your Booking Successfully Received!"
                    subTitle={`Your Booking reference number is : ${createdBooking?.referenceNumber}`}
                    extra={[
                    <Button type="primary" onClick={() => navigate("/")}>Ok Done <RightOutlined /></Button>,
                    ]}
                />
            )
        },
    ];

    return (
        <Row justify={'center'} align={'middle'} style={{padding:10}}>
            <Col xs={22} sm={22} md={18} lg={18} xl={18} xxl={18} >
                <Steps
                size="small"
                current={stepCurrent}
                items={stepsItems}
                />
            </Col>
            <Col xs={22} sm={22} md={18} lg={18} xl={18} xxl={18}>
                <div>{stepsItems[stepCurrent].content}</div>
            </Col>
            
            
        </Row>
        
    );
}