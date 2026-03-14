import { Form,notification, Input, Button,Row, Col } from 'antd';
import { BookingStepsProps, ContactPerson } from "../../models/booking";
import { OtpVerificationRequestDTO } from '../../models/auth';
import { useState } from 'react';
import { sendOtp, verifyEmail, verifyOtp } from '../../services/admin/privateTourService';
import { TouristStatus } from '../../models/tourist';


type NotificationType = 'success' | 'info' | 'warning' | 'error';


export default function BookingContactPerson({next}:BookingStepsProps)
{
    const [contactPersonForm] = Form.useForm<ContactPerson>();
    const [otpVerificationForm] = Form.useForm<OtpVerificationRequestDTO>();
    //const [resendOtpLoading, setResendOtpLoading] = useState<boolean>(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [isVerifyOtp, setIsVerifyOtp] = useState(false);
    const [apiNotification, notificationContextHolder] = notification.useNotification();


    const openNotificationWithIcon = (type: NotificationType, message:string) => {
        apiNotification[type]({
        message: `${message}`,
        });
    };

    const requestOtp = (body:{email:string}) => {
        sendOtp(body)
        .then
        (
            (apiResponse) =>
            {
                if(apiResponse.success)
                {
                    openNotificationWithIcon('success',"otp send");
                    setIsVerifyOtp(true);
                }
                else
                {
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

    const verifyTourist = (values:ContactPerson) =>
    {
        setConfirmLoading(true);
        const requestDto = {
            email:values.email
        };
    
        verifyEmail(requestDto)
            .then
            (
                (apiResponse) =>
                {
                    if(apiResponse.success)
                    {
                        if(apiResponse.data == TouristStatus.EXIST)
                        {
                            setConfirmLoading(false);
                            localStorage.setItem("bookingContactPerson",JSON.stringify(contactPersonForm.getFieldsValue()))
                            if(next) next();
                        }
                        else if ( apiResponse.data == TouristStatus.NONEXISTENT)
                        {
                            //SEND OTP
                            requestOtp(requestDto);
                        }
                        else{
                            //error
                            openNotificationWithIcon('error',"unknown error");
                            setConfirmLoading(false);
                        }
                    }
                    else{
                        openNotificationWithIcon('error',apiResponse.message);
                        setConfirmLoading(false);
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
        setConfirmLoading(true);
        verifyOtp(values)
        .then(
            (apiResponse) =>
            {
                if(apiResponse.success)
                {
                    localStorage.setItem("bookingContactPerson",JSON.stringify(contactPersonForm.getFieldsValue()));
                    openNotificationWithIcon('success',"verified");
                    if(next) next();
                }
                else
                {
                    openNotificationWithIcon('error',apiResponse.message);
                }
                setConfirmLoading(false);
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

    // const resendOtp = (emailValue : string) => {
    //     setResendOtpLoading(true);
    //     sendOtp(
    //         {
    //             email: emailValue
    //         }
    //     )
    //     .then(
    //         (apiResponse) =>
    //         {
    //             if(apiResponse.success)
    //             {
    //                 openNotificationWithIcon('success',"otp send");
    //             }
    //             else{
    //                 openNotificationWithIcon('error',apiResponse.message);
    //             }
    //             setResendOtpLoading(false);
                
    //         }
    //     )
    //     .catch(
    //         (error) =>
    //         {
    //             setResendOtpLoading(false);
    //             openNotificationWithIcon('error','unknown error '+error);
    //         }
    //     )
    // }

    
    
    return(
       <Row justify={'center'} align={'middle'}>
            {notificationContextHolder}
            <Col xs={22} sm={22} md={6} lg={6} xl={6} xxl={6}>
                {
                    isVerifyOtp ? (
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
                                <Input type="email" disabled/>
                            </Form.Item>
                            <Form.Item
                                name="otp"
                                label="OTP"
                                rules={[{required:true, message:"Otp value is required"}]}
                            >
                                <Input type="text" />
                            </Form.Item>
                        
                            <Form.Item
                            >
                                
                                <Button 
                                    loading={confirmLoading} 
                                    type="primary" 
                                    htmlType="submit"
                                    block
                                >
                                    Submit
                                </Button>
                                
                            </Form.Item>
                        </Form>
                    ):
                    (
                        <Form<ContactPerson>
                            layout={'vertical'}
                            form={contactPersonForm}
                            onFinish={verifyTourist}
                        >
                            <Form.Item
                                name="firstName"
                                label="First Name"
                                rules={[{required:true, message:"First Name is Required"}]}
                            >
                                <Input type="text" />
                            </Form.Item>
                            <Form.Item
                                name="lastName"
                                label="Last Name"
                                rules={[{required:true, message:"Last Name is Required"}]}
                            >
                                <Input type="text" />
                            </Form.Item>
                            <Form.Item
                                name="phoneNumber"
                                label="Phone Number"
                                rules={[{required:true, message:"Phone Number Value is Required"}]}
                            >
                                <Input type="text" />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{required:true, message:"Email Value is Required"}]}
                            >
                                <Input type="email" />
                            </Form.Item>
                        
                            <Form.Item
                            >
                                
                                <Button 
                                    loading={confirmLoading} 
                                    type="primary" 
                                    htmlType="submit"
                                    block
                                >
                                    Submit
                                </Button>
                                
                                
                            </Form.Item>
                        </Form>
                    )
                }
                
            </Col>
       </Row>
    );
}
