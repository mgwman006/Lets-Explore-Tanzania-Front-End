import { Link, useLocation } from "react-router-dom";
import { Breadcrumb, Button, Card, Col, Image, List, Row, Statistic, Tabs, TabsProps, Typography } from 'antd';
import Meta from "antd/es/card/Meta";
import { CalendarFilled, CalendarOutlined, CalendarTwoTone, ClockCircleFilled, ClockCircleTwoTone, EnvironmentOutlined, EnvironmentTwoTone, FieldTimeOutlined, LikeOutlined, MoneyCollectTwoTone } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { getTourDetails } from "../../services/admin/privateTourService";


export default function TourDetails()
{
    const location = useLocation();
    const tourId= location.state.tourId;
    const [tourDetails, setTourDetails] = useState<TourDetailsDto>();
    const [previewImage,setPreviewImage] = useState("");

    // Fetch tour details using the tourId from the location state
    // This is a placeholder, you should replace it with your actual data fetching logic
    // For example, you might use useEffect to fetch the data when the component mounts
    useEffect(() => {
        getTourDetails(tourId)
            .then((data) => {
                if (data.success) {
                    setTourDetails(data.data);
                    setPreviewImage(data.data.bannerImageUrl || "");
                } else {
                    console.error("Failed to fetch tour details:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching tour details:", error);
            });
    }, [tourId]);

    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Details',
            children: (
                <>
                    {tourDetails && (
                        <>
                            {/* <p><MoneyCollectTwoTone /> <b>Price:</b> {tourDetails.pricePerPerson}      <ClockCircleTwoTone /> <b>Duration:</b> {tourDetails.durationDays}</p> */}
                            <p><EnvironmentTwoTone /> <b>Destination:</b> {tourDetails.destinations.length}</p>
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
                                description={tourDetails.overView}
                            />
                        </>
                    )}
                </>
            ),
        },
        // {
        //     key: '2',
        //     label: 'Photos',
        //     children: (
        //         <div>
        //             <div
        //                 style={{
        //                     display:"flex",
        //                     justifyContent:"center",
                                    
        //                     }}
        //                 >
        //                         {
        //                             tourDetails.photos.map(
        //                                 (photoUrl,index) =>
        //                                 (
        //                                     <Image
        //                                         key={index}
        //                                         src={photoUrl.toString()}
        //                                         width={50}
        //                                         height={50}
        //                                         style={{
        //                                             margin:10,
        //                                             cursor:"pointer",
        //                                         }}
        //                                         onClick={() => setPreviewImage(photoUrl.toString())}
        //                                         preview={false}

        //                                     />
        //                                 )
        //                             )
        //                         }
        //             </div>
                            
        //             <div>
        //                 <Image 
        //                     src={previewImage} 
        //                     preview={false} 
        //                     width="100%"
        //                     height={400}
        //                     style={{
        //                         objectFit:"contain"
        //                     }}
        //                 />
        //             </div>
                            
        //         </div>
        //     ),
        // },
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
                        title: <Link to="/admin">Admin Home</Link>,
                    },
                    {
                        title: <Link to='/admin/tours'> Tours</Link>,
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
                        src={tourDetails?.bannerImageUrl}
                        style={{
                            
                            height:"300px",
                            objectFit: 'cover',// Prevent distortion


                        }}
                    />
                    {
                        tourDetails && tourDetails.tourDates && (
                            <div>
                                <p><CalendarOutlined /> {`${tourDetails.tourDates.startDate}`}</p>
                                <p><CalendarOutlined /> {`${tourDetails.tourDates.endDate}`}</p>
                               
                        
                            </div>
         
                        )
                    }
                    
                    <Card
                        title={tourDetails?.title}
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