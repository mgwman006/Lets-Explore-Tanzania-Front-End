import { Link, useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, Button, Card, Col, Image, List, Row, Statistic, Tabs, TabsProps, Typography, Table, Flex, Modal, Form, notification, Input, InputNumber, Select, Upload, UploadProps, Alert, Popconfirm, DatePicker, Tag, UploadFile, Space, Timeline, Drawer, Steps, Result, GetProps, Collapse } from 'antd';
import Meta from "antd/es/card/Meta";
import { CalendarFilled, CalendarOutlined, CalendarTwoTone, ClockCircleFilled, ClockCircleTwoTone, DeleteColumnOutlined, DeleteOutlined, DeleteRowOutlined, EnterOutlined, EnvironmentFilled, EnvironmentOutlined, EnvironmentTwoTone, ExclamationCircleOutlined, FieldTimeOutlined, LikeOutlined, LoadingOutlined, MoneyCollectTwoTone, PlusOutlined, RightOutlined, SmileOutlined, SolutionOutlined, UploadOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { addBooking, getPrivateTourDetails, getTourGuideDetails, sendOtp, updatePrivateTour, verifyEmail, verifyOtp } from "../services/admin/privateTourService";
import { isMobile } from "react-device-detect";
import TextArea from "antd/es/input/TextArea";
import { Dayjs } from "dayjs";
import { BookingCreateDto, CreatedBookingDto } from "../models/booking";
import { TouristStatus } from "../models/tourist";
import { OtpVerificationRequestDTO } from "../models/auth";
import dayjs from 'dayjs';
import NormalizeTrailingSlash from "./NormalizeTrailingSlash";
import { useParams } from "react-router-dom";


type NotificationType = 'success' | 'info' | 'warning' | 'error';
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;




export default function TourDetails()
{
    
    const { tourId } = useParams();
    const [tourDetails, setTourDeatails] = useState<PrivateTourDetailsDto>();
    const [tourGuide, setTourGuide] = useState<TourGuideDTO>();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [apiNotification, notificationContextHolder] = notification.useNotification();
    const [travellers, setTravellers] = useState<number>(0);
    const [pricePerPerson, setPricePerPerson] = useState<number>(0);
    const [miniMumPricePerPerson, setMinimumPricePerPerson] = useState<number>(0);
    const [showBookNowButton, setShowBookButton] = useState<boolean>(true);
    const [tourBookingForm] = Form.useForm<BookingCreateDto>();
    const [openBookingModal, setOpenBookingModal] = useState(false);
    const [tourDate, setTourDate] = useState<Dayjs>();
    const [stepCurrent,setStepCurrent] = useState<number>(0);
    const navigate = useNavigate();
    const [createdBooking, setCreatedBooking] = useState<CreatedBookingDto>();
    const [otpVerificationForm] = Form.useForm<OtpVerificationRequestDTO>();
    const [bokingFormValues, setBookingFormValues] = useState<BookingCreateDto>();
    const [otpVerificationFormValues, setOtpVerificationFormValues] = useState<OtpVerificationRequestDTO>();
    const [resendOtpLoading, setResendOtpLoading] = useState<boolean>(false);



     useEffect(() => {
        
        if(tourId)
        {
            getPrivateTourDetails(Number(tourId))
            .then(
                (apiResponse) =>
                {
                    if(apiResponse.success)
                    {
                        setTourDeatails(apiResponse.data);
                        if(apiResponse.data.tourPrice.length > 0)
                        {
                            const sortedPrice = apiResponse.data.tourPrice.sort();
                            const lastPrice = sortedPrice[sortedPrice.length-1];
                            setPricePerPerson(lastPrice.pricePerPerson);
                            setTravellers(lastPrice.quantity);
                            setMinimumPricePerPerson(lastPrice.pricePerPerson);
                        }
                        else{
                            openNotificationWithIcon('info', "No price set for this tour");
                        }

                    }else
                    {
                        openNotificationWithIcon('error', apiResponse.message);
                    }
                }
            ).catch
            (
                (error) =>
                {
                    openNotificationWithIcon('error', error);
                }
            )

            getTourGuideDetails(Number(tourId))
            .then((apiResponse) => {
            if (apiResponse.success) {
                setTourGuide(apiResponse.data);
            } else {
                openNotificationWithIcon('error', apiResponse.message);
            }
            })
            .catch((error) => {
                openNotificationWithIcon('error', error);
            });

        }else{
            openNotificationWithIcon('error', "Invalid tour Id "+tourId);
        }
           

        const handleScroll = () =>
        {
            const bookNowButton = document.getElementById("book-now-button");
            if(bookNowButton)
            {
                const react = bookNowButton.getBoundingClientRect();
                if(react.top < 0 || react.bottom > window.innerHeight)
                {
                    setShowBookButton(true);
                }
                else
                {
                    setShowBookButton(false);
                }
            }
        }

        window.addEventListener('scroll',handleScroll);
     
        setShowBookButton(false);
                
    }, []);


    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current < dayjs().endOf('day');
    };
    
    
    const openNotificationWithIcon = (type: NotificationType, message:string) => {
        apiNotification[type]({
        message: `${message}`,
        });
    };

    const handleOpenTourBookingModal = () =>
    {
        tourBookingForm.setFieldValue("tourId", tourDetails?.id);
        tourBookingForm.setFieldValue("pricePerPerson",pricePerPerson);
        tourBookingForm.setFieldValue("numberOfPeople",travellers);
        tourBookingForm.setFieldValue("totalPrice",pricePerPerson*travellers);
        tourBookingForm.setFieldValue("tourDate",tourDate);
        setOpenBookingModal(true);
    }


    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Details',
            children: (
            
                <div>
                    <p style={{fontSize:"15px"}}><EnvironmentTwoTone /> {tourDetails?.destinations?.join(", ")} <br /><ClockCircleTwoTone /> {tourDetails?.durationDays} Days</p>
                    <p dangerouslySetInnerHTML={{ __html: (tourDetails?.overView || "").replace(/\n/g, '<br />') }} />
                </div>
                
            ),
        },
        {
            key: '2',
            label:"Price List",
            children: (
                <Table
                        dataSource={tourDetails?.tourPrice}
                        pagination={false}
                        rowKey="id"
                        columns={[
                            {
                                title: 'Quantity',
                                dataIndex: 'quantity',
                                key: 'quantity',
                            },
                            {
                                title: 'Price Per Person',
                                dataIndex: 'pricePerPerson',
                                key: 'pricePerPerson',
                            },
                            {
                                title: 'Currency',
                                dataIndex: ['currency', 'code'],
                                key: 'currencyCode',
                            },
                        ]}
                />
            )
        },
        {
            key: '3',
            label: 'Activities',
            children: (
                       
                <Collapse 
                    accordion 
                    defaultActiveKey={'1'}
                    items={
                        [
                            {
                                key:"1",
                                label: 'On Arival',
                                children:<p>{tourGuide?.pickUpInformation?.details ?? "No pickUpInformation yet"}</p>
                            },
                            {
                                key:"2",
                                label: "Day to Day Activities",
                                children: (
                                    <Timeline
                                        items={
                                            (tourGuide?.tourActivities || [])
                                            .map
                                            ((activity, index) => 
                                                    (
                                                        {
                                                            children: 
                                                            (
                                                                <div>
                                                                    <h3>Day {activity.dayNumber}: {activity.title}</h3>
                                                                    <p><EnvironmentTwoTone /> {activity.location}</p>
                                                                    <p> {activity.description}</p>
                                                                    
                                                                    <List
                                                                        itemLayout="horizontal"
                                                                        dataSource={activity.photos}
                                                                        renderItem={
                                                                            (item) =>{
                                                                                return <Image 
                                                                                    src={item} 
                                                                                    height={60} 
                                                                                    width={80}
                                                                                    style={
                                                                                        {
                                                                                            objectFit: "cover",
                                                                                        }
                                                                                    }
                                                                                />;
                                                                            }
                                                                        }
                                                                    />

                                                                </div>
                                                    
                                                            ),
                                                        }
                                                    )
                                            )
                                        
                                            
                                        }
                                    
                                    />
                                )
                            },
                            {
                                key:"3",
                                label:"End of Tour",
                                children: <p>{tourGuide?.endOfTourInformation?.details ?? "No End Of Info yet"}</p> 
                                        
                            }
                        ]
                    } 
                    
                />
                    
            ),
        }
    ];



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


    const handleSubmitBooking = (values: BookingCreateDto) => {
        setConfirmLoading(true);
        setTimeout(() => {

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
                                    setPricePerPerson(pp as number);
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

    return(
        <div
        >
            <NormalizeTrailingSlash />
            {notificationContextHolder}
            
            <div
                style={
                    { 
                        height:isMobile ? "200px":"300px", 
                        width:"100%",
                        backgroundImage:`url("${tourDetails?.bannerImageUrl}")`,
                        backgroundRepeat:"no-repeat",
                        backgroundSize:"cover",
                        display:"flex",
                        justifyContent:"end",
                        flexDirection:"column",
                        textAlign:"center"                        

                    }
                }
            >
                <h1 style={{color:"black"}}>{tourDetails?.title}</h1>    
            </div>
            <Row
                style={{backgroundColor:""}}
            >
                
                <Col xs={24} sm={15} lg={15} xl={15} xxl={15}>
                
                    <Tabs 
                        size="large"
                        style={
                            {
                                paddingLeft:"10px",
                                paddingRight:"10px",
                                backgroundColor:"white"
                            }
                        }
                        
                        type="card"
                        defaultActiveKey="1" 
                        items={tabItems} 
                    />
                    
                </Col>
                <Col 
                    xs={24} sm={9} lg={9} xl={9} xxl={9} 
                  
                
                >
                    <Row
                        justify={"center"}
                    >
                        <Col xs={24} sm={18} lg={18} xl={18} xxl={18}>
                            <br />
                            <Flex 
                                vertical gap={4}
                                style={
                                    {
                                        padding:"10px",
                                        backgroundColor:"white"
                                    }}
                            >
                                {
                                    tourDetails && tourDetails.tourPrice.length>0 ?
                                    <p><span style={{fontSize:"25px"}}><b>{pricePerPerson}</b></span> pp ({tourDetails?.tourPrice[0].currency.code})</p>:
                                    <p>No price tag yet</p>
                                }
                                
                                

                                <DatePicker 
                                    disabledDate={disabledDate}
                                    format="YYYY-MM-DD"
                                    size="large"
                                    onChange={(date, datestring) => setTourDate(date)}
                                />
                                <InputNumber 
                                    addonBefore={<UserAddOutlined />} 
                                    size="large" 
                                    style={{width:"100%"}}
                                    placeholder="Travellers"
                                    min={1}
                                    value={travellers}
                                    onChange={(value) => {
                                        setTravellers(value as number);
                                        if(tourDetails && tourDetails.tourPrice.length>0)
                                        {
                                            const pp = tourDetails?.tourPrice.find(x => x.quantity==value)?.pricePerPerson??miniMumPricePerPerson;
                                            setPricePerPerson(pp as number);
                                        }
                                        

                                    }}
                                />
                                <Button 
                                    id="book-now-button" 
                                    size="large" 
                                    type="primary" 
                                    onClick={handleOpenTourBookingModal}
                                    disabled={!(tourDetails && tourDetails.tourPrice.length>0)}
                                >
                                        Book Now
                                </Button>
                            </Flex>
                            <br />
                        </Col>
                        <Drawer
                            mask={false}
                            height={100}
                            onClose={() => setShowBookButton(false)}
                            placement="bottom"
                            open={showBookNowButton}
                            closable={false}
                        >
                            <Flex>
                                    <Button 
                                        type="primary" 
                                        block 
                                        size="large"
                                        onClick={handleOpenTourBookingModal}
                                        disabled={!(tourDetails && tourDetails.tourPrice.length>0)}
                                    >
                                        Book Now
                                    </Button>
                            </Flex>
                            
                        </Drawer>
                    </Row>
                        
                    
                </Col>

            </Row>
           

            <Modal
                
                centered
                footer={null}
                title={
                    (
                        <Steps
                            size="small"
                            current={stepCurrent}
                            items={stepsItems}
                        />
                    )
                }
                open={openBookingModal}
                confirmLoading={confirmLoading}
                onCancel={() =>{
                    setOpenBookingModal(false);
                    setStepCurrent(0);

                } }
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                    xxl: '40%',
                    }}
            >
                

                
                <div>{stepsItems[stepCurrent].content}</div>
            </Modal>

        </div>
    );
}

