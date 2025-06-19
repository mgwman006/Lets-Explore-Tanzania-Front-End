import { useLocation } from "react-router-dom";
import { Breadcrumb, Button, Card, Col, Image, List, Row, Statistic, Tabs, TabsProps, Typography } from 'antd';
import Meta from "antd/es/card/Meta";
import { CalendarFilled, CalendarOutlined, CalendarTwoTone, ClockCircleFilled, ClockCircleTwoTone, EnvironmentOutlined, EnvironmentTwoTone, FieldTimeOutlined, LikeOutlined, MoneyCollectTwoTone } from '@ant-design/icons';
import { useState } from "react";


export default function TourDetails()
{
    const location = useLocation();
    const state= location.state;
    const tourDetails :TourDetailsDto = state?state.tourDetails:null;
    const [previewImage,setPreviewImage] = useState(tourDetails.bannerImageUrl);

    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Details',
            children: (
                <>
                    <p><MoneyCollectTwoTone /> <b>Price:</b> {tourDetails.pricePerPerson}      <ClockCircleTwoTone /> <b>Duration:</b> {tourDetails.durationDays}</p>
                        <p><EnvironmentTwoTone /> <b>Destination:</b> {tourDetails.destination}</p>
                        <p><CalendarTwoTone /> <b>Availabe Dates:</b>
                            {
                                tourDetails.hasSpecificDates ? 
                                (
                                    <div>
                                        <p><CalendarOutlined /> {`${tourDetails.tourDates.startDate}`}</p>
                                        <p><CalendarOutlined /> {`${tourDetails.tourDates.endDate}`}</p>
                                    </div>
                                ):
                                "Available all the time"
                            }
                         </p>
                         <Meta
                            title={<Typography.Title level={5}>Overview</Typography.Title>}
                            description={tourDetails.description}
                        />
                </>
            ),
        },
        {
            key: '2',
            label: 'Photos',
            children: (
                <div>
                    <div
                        style={{
                            display:"flex",
                            justifyContent:"center",
                                    
                            }}
                        >
                                {
                                    tourDetails.photos.map(
                                        (photoUrl,index) =>
                                        (
                                            <Image
                                                key={index}
                                                src={photoUrl.toString()}
                                                width={50}
                                                height={50}
                                                style={{
                                                    margin:10,
                                                    cursor:"pointer",
                                                }}
                                                onClick={() => setPreviewImage(photoUrl.toString())}
                                                preview={false}

                                            />
                                        )
                                    )
                                }
                    </div>
                            
                    <div>
                        <Image 
                            src={previewImage} 
                            preview={false} 
                            width="100%"
                            height={400}
                            style={{
                                objectFit:"contain"
                            }}
                        />
                    </div>
                            
                </div>
            ),
        },
        {
            key: '3',
            label: 'Activities',
            children: 'No Activity Yet',
            disabled: true,

        },
    ];

    return(
        <div
        >
             <Breadcrumb
                    items={[
                    {
                        title: <a href="/admin">Admin Home</a>,
                    },
                    {
                        title: <a href="/admin/tours">Tours</a>,
                    },
                    {
                        title: 'Tour Details',
                    },
                    ]}
            />
            <Row
                style={{backgroundColor:""}}
            >
                <Col span={24}>
                    <Image 
                        width="100%" 
                        preview={false}
                        src={tourDetails.bannerImageUrl}
                        style={{
                            
                            height:"300px",
                            objectFit: 'cover',// Prevent distortion


                        }}
                    />
                    {
                        tourDetails.tourDates && (
                            <div>
                                <p><CalendarOutlined /> {`${tourDetails.tourDates.startDate}`}</p>
                                <p><CalendarOutlined /> {`${tourDetails.tourDates.endDate}`}</p>
                               
                        
                            </div>
         
                        )
                    }
                    
                    <Card
                        title={tourDetails.title}
                    >
                        <Tabs title="TABB" defaultActiveKey="1" items={tabItems} />

                        <br />
                        <Button type="primary">Edit Details</Button>

                    </Card>
                    
                </Col>
            </Row>
           

        </div>
    );
}