import { useNavigate } from "react-router-dom";
import { Button, Col, Image, List, Row,Tabs, TabsProps, Typography, Table, Flex, notification,Timeline, Drawer, Collapse } from 'antd';
import { ClockCircleTwoTone, EnvironmentTwoTone} from '@ant-design/icons';
import { useEffect, useState } from "react";
import { getPrivateTourDetails, getTourGuideDetails } from "../services/admin/privateTourService";
import { useParams } from "react-router-dom";


type NotificationType = 'success' | 'info' | 'warning' | 'error';


export default function TourDetails()
{
    
    const { tourId } = useParams();
    const [tourDetails, setTourDeatails] = useState<PrivateTourDetailsDto>();
    const [tourGuide, setTourGuide] = useState<TourGuideDTO>();
    const [apiNotification, notificationContextHolder] = notification.useNotification();
    const [showBookNowButton, setShowBookButton] = useState<boolean>(true);
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
    
    
    const openNotificationWithIcon = (type: NotificationType, message:string) => {
        apiNotification[type]({
        message: `${message}`,
        });
    };

    const handleOpenTourBookingModal = () =>
    {
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
                <Col xs={24} sm={24} lg={18} xl={18} xxl={18}>
                    <Typography.Title level={3} style={{textAlign:"center"}}>{tourDetails?.title}</Typography.Title>
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
                <Col xs={24} sm={24} lg={8} xl={8} xxl={8} >
                    <Button 
                        size="large" 
                        type="primary" 
                        block
                        disabled={!(tourDetails && tourDetails.tourPrice.length>0)}
                        onClick={handleOpenTourBookingModal}
                    >
                        Book Now
                    </Button>
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

        </div>
    );
}

