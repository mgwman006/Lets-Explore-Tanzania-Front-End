import { ClockCircleTwoTone, DeleteColumnOutlined, DeleteOutlined, DeleteRowOutlined, EnterOutlined, EnvironmentFilled, EnvironmentOutlined, EnvironmentTwoTone, ExclamationCircleOutlined, FieldTimeOutlined, LikeOutlined, LoadingOutlined, MoneyCollectOutlined, MoneyCollectTwoTone, PlusOutlined, RightOutlined, SmileOutlined, SolutionOutlined, UploadOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { InputNumber,Form,notification, Input, DatePicker, Button, Flex, Result, Steps, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { addBooking, getPrivateTourDetails, getTourGuideDetails, sendOtp, updatePrivateTour, verifyEmail, verifyOtp } from "../../services/admin/privateTourService";
import { TouristStatus } from '../../models/tourist';
import TextArea from 'antd/es/input/TextArea';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { OtpVerificationRequestDTO } from '../../models/auth';
import { useNavigate } from 'react-router-dom';
import BookingDetails from './BookingDetails';
import BookingContactPerson from './BookingContactPerson';


export default function BookingPage()
{
    const navigate = useNavigate();
    //const [bokingFormValues, setBookingFormValues] = useState<BookingCreateDto>();
    const [resendOtpLoading, setResendOtpLoading] = useState<boolean>(false);

    const [stepCurrent,setStepCurrent] = useState<number>(0);
    const [otpVerificationFormValues, setOtpVerificationFormValues] = useState<OtpVerificationRequestDTO>();

    const next = () => setStepCurrent((s) => s + 1);
    const back = () => setStepCurrent((s) => s - 1);

    useEffect(() => {
        try 
        {
            const data = localStorage.getItem("bookingData");
            

            if (!data) return;

            const parsedData = JSON.parse(data);
            
            

            if (parsedData.tourDate) {
                parsedData.tourDate = dayjs(parsedData.tourDate);
            }

            

           // setBookingFormValues(parsedData);
         //   tourBookingForm.setFieldsValue(parsedData);

        } 
        catch (error) 
        {
            console.error("Invalid booking data in localStorage");
        }
    },[]);
    
  


    

    

   


    

    const stepsItems = [
        {
            title: 'Contact Person',
            icon: <SolutionOutlined />,
            content:<BookingContactPerson  next={next}/>
        },
        //  {
        //     title: 'User Verification',
        //     icon: <SolutionOutlined />,
        //     content:<VerifyOTP />
        // },
        {        
            title: 'Booking Details',
            icon: <UserOutlined />,
            content: <BookingDetails next={next} />
        },
        {
            title: 'Done',
            icon: <SmileOutlined />,
            content: (
                <Result
                    status="success"
                    title="Your Booking Successfully Received!"
                   // subTitle={`Your Booking reference number is : ${createdBooking?.referenceNumber}`}
                    extra={[
                    <Button type="primary" onClick={() => navigate("/")}> Pay Now <RightOutlined /></Button>,
                    <Button type="primary" onClick={() => navigate("/")}> Pay Later <RightOutlined /></Button>,
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