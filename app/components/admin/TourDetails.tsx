import { Link, useLocation } from "react-router-dom";
import { Breadcrumb, Button, Card, Col, Image, List, Row, Statistic, Tabs, TabsProps, Typography, Table, Flex } from 'antd';
import Meta from "antd/es/card/Meta";
import { CalendarFilled, CalendarOutlined, CalendarTwoTone, ClockCircleFilled, ClockCircleTwoTone, EnvironmentOutlined, EnvironmentTwoTone, FieldTimeOutlined, LikeOutlined, MoneyCollectTwoTone } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { getPrivateTourDetails, getTourGuideDetails } from "../../services/admin/privateTourService";


export default function TourDetails()
{
    const location = useLocation();
    const tourId= location.state.tourId;
    const [tourDetails, setTourDetails] = useState<PrivateTourDetailsDto>();
    const [previewImage,setPreviewImage] = useState("");
    const [tourGuide, setTourGuide] = useState<TourGuideDTO>();

    // Fetch tour details using the tourId from the location state
    // This is a placeholder, you should replace it with your actual data fetching logic
    // For example, you might use useEffect to fetch the data when the component mounts
    useEffect(() => {
        getPrivateTourDetails(tourId)
            .then((apiResponse) => {
                if (apiResponse.success) {
                    setTourDetails(apiResponse.data);
                    setPreviewImage(apiResponse.data.bannerImageUrl || "");
                } else {
                    console.error("Failed to fetch tour details:", apiResponse.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching tour details:", error);
            });

        // Fetch tour guide details if needed
        getTourGuideDetails(tourId)
            .then((apiResponse) => {
            if (apiResponse.success) {
                setTourGuide(apiResponse.data);
            } else {
                console.error("Failed to fetch tour guide details:", apiResponse.message);
            }
        })
        .catch((error) => {
            console.error("Error fetching tour guide details:", error);
        });   
    }, [tourId]);

    const activitiesTabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Details',
            children: (
            
                <div>
                    <Flex   gap={"small"} >
                        <Button variant="outlined" color="green" size="small">Update Details</Button>
                        <Button variant="outlined" color="green" size="small">Update Price list</Button>
                    </Flex>
                    <p><EnvironmentTwoTone /> {tourDetails?.destinations?.join(", ")} <br /><ClockCircleTwoTone /> {tourDetails?.durationDays} Days</p>
                    <Meta
                        title='Overview'
                        description={tourDetails?.overView}
                    />
                    <Table
                        title={() => <Typography.Title level={5}>Tour Price</Typography.Title>}
                        style={{ marginTop: '20px' }}
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
                    
                        
                </div>
                
            ),
        },
        {
            key: '2',
            label: 'Activities',
            children: (
                tourGuide && tourGuide.tourActivities?.length > 0 ? (
                    <div
                        style={{
                            padding: '10px',
                            borderRadius: '8px', // Rounded corners
                        }}
                    >
                        <Button variant="outlined" size="small" color="green" onClick={() => alert("Add Activities")}>Update Activities</Button>
                        <br />
                        <Meta
                            title={<p><EnvironmentOutlined /> Pick Up Information</p>} 
                            description={tourGuide?.pickUpInformation?.details}
                        />
                        <List
                            itemLayout="vertical"
                            dataSource={tourGuide?.tourActivities}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={<Typography.Title level={5}>Day {item.dayNumber}: {item.title}</Typography.Title>}
                                        description={
                                            <div>
                                                <p>{item.description}</p>
                                                <p><EnvironmentOutlined /> {item.location}</p>
                                                <p><ClockCircleFilled /> {item.startTime} - {item.endTime}</p>
                                            </div>
                                        }
                                    />
                                    <List
                                        grid={{ gutter: 10, column: 10 }}
                                        dataSource={item.photos}
                                        renderItem={(photo) => (
                                            <List.Item>
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    src={photo}
                                                    alt={photo}
                                                    style={{ objectFit: 'cover' }}
                                                    // onClick={() => setPreviewImage(photo)}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </List.Item>
                            )}
                        />
                        <Meta
                            title={<p><EnvironmentOutlined /> End of Tour Information</p>}
                            description={tourGuide?.endOfTourInformation?.details}
                        />
                    </div>
                ) : (
                    <div>
                        <Meta
                            title='No Activities Available'
                            description='This tour currently has no activities scheduled.'
                        />
                        <br />
                        <Button variant="outlined" size="small" color="green" onClick={() => alert("Add Activities")}>Add Activities</Button>
                    </div>
                )
            ),
        },
        {
            key: '3',
            label: 'Photos',
            children: (
                <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={tourDetails?.photo}
                    renderItem={(item) => (
                        <List.Item>
                            <Image
                                width={200}
                                height={200}
                                src={item}
                                alt={item}
                                style={{ objectFit: 'cover' }}
                            />
                        </List.Item>
                    )}
                />
            ),
            disabled:true
        }
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
                        title: <a href="/admin/tours" type="button">Tours</a>,
                    },
                    {
                        title: 'Tour Details',
                    },
                    ]}
            />

            <br />
            <div>
                <Image 
                    width="100%" 
                    preview={false}
                    src={tourDetails?.bannerImageUrl}
                    style={{
                        width:"100%",
                        // height:"300px",
                        objectFit: "cover",// Prevent distortion


                    }}
                />
            </div>
            <Row
                style={{backgroundColor:""}}
            >
                <Col span={24}>
                
                    <Card
                        title={tourDetails?.title}
                    >
                        <Tabs title="TABB" defaultActiveKey="1" items={activitiesTabItems} />
                    </Card>
                    
                </Col>
            </Row>
           

        </div>
    );
}