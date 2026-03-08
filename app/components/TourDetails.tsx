import { Link, useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, Button, Card, Col, Image, List, Row, Statistic, Tabs, TabsProps, Typography, Table, Flex, Modal, Form, notification, Input, InputNumber, Select, Upload, UploadProps, Alert, Popconfirm, DatePicker, Tag, UploadFile, Space, Timeline, Drawer, Steps, Result, GetProps, Collapse, Calendar } from 'antd';
import { CalendarFilled, CalendarOutlined, CalendarTwoTone, ClockCircleFilled, ClockCircleTwoTone, DeleteColumnOutlined, DeleteOutlined, DeleteRowOutlined, EnterOutlined, EnvironmentFilled, EnvironmentOutlined, EnvironmentTwoTone, ExclamationCircleOutlined, FieldTimeOutlined, LikeOutlined, LoadingOutlined, MoneyCollectTwoTone, PlusOutlined, RightOutlined, SmileOutlined, SolutionOutlined, UploadOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { addBooking, getPrivateTourDetails, getTourGuideDetails, sendOtp, updatePrivateTour, verifyEmail, verifyOtp } from "../services/admin/privateTourService";
import { isMobile } from "react-device-detect";
import TextArea from "antd/es/input/TextArea";
import { Dayjs } from "dayjs";
import { BookingCreateDto } from "../models/booking";
import dayjs from 'dayjs';
import { useParams } from "react-router-dom";


type NotificationType = 'success' | 'info' | 'warning' | 'error';
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;




export default function TourDetails()
{
    
    const { tourId } = useParams();
    const [tourDetails, setTourDeatails] = useState<PrivateTourDetailsDto>();
    const [tourGuide, setTourGuide] = useState<TourGuideDTO>();
    const [apiNotification, notificationContextHolder] = notification.useNotification();
    const [travellers, setTravellers] = useState<number>(0);
    const [pricePerPerson, setPricePerPerson] = useState<number>(0);
    const [miniMumPricePerPerson, setMinimumPricePerPerson] = useState<number>(0);
    const [showBookNowButton, setShowBookButton] = useState<boolean>(true);
    const [tourDate, setTourDate] = useState<Dayjs>(dayjs());
    const navigate = useNavigate();



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

        }
        else{
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
        const bookingDataTemp : BookingCreateDto =
        {
            tourId:tourDetails?.id??0,
            customerName:"",
            email:"",
            phoneNumber:"",
            pricePerPerson:pricePerPerson,
            numberOfPeople:travellers,
            totalPrice:pricePerPerson*travellers,
            tourDate:tourDate,
            specialRequests:"",
            operatorId: tourDetails?.operatorId ?? 0

        };
        localStorage.setItem("bookingData",JSON.stringify(bookingDataTemp));
        localStorage.setItem("tourDetails",JSON.stringify(tourDetails));
        navigate('/tours/booking')
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


    return(
        <div
        >
            {notificationContextHolder}
            <Row
                justify={'center'}
                align={'middle'}
            >
                <Col xs={24} sm={24} lg={24} xl={24} xxl={24}>
                     <Image
                        width={'100%'}
                        alt="basic image"
                        src={tourDetails?.bannerImageUrl}
                        preview={false}
                    />
                </Col>
                <Col xs={24} sm={24} lg={24} xl={24} xxl={24}>
                    <Typography.Title level={3}>{tourDetails?.title}</Typography.Title>
                </Col>
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

        </div>
    );
}

