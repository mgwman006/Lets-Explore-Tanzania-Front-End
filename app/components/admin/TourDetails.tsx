import { Link, useLocation } from "react-router-dom";
import { Breadcrumb, Button, Card, Col, Image, List, Row, Statistic, Tabs, TabsProps, Typography, Table, Flex, Modal, Form, notification, Input, InputNumber, Select, Upload, UploadProps, Alert, Popconfirm } from 'antd';
import Meta from "antd/es/card/Meta";
import { CalendarFilled, CalendarOutlined, CalendarTwoTone, ClockCircleFilled, ClockCircleTwoTone, DeleteColumnOutlined, DeleteOutlined, DeleteRowOutlined, EnvironmentOutlined, EnvironmentTwoTone, FieldTimeOutlined, LikeOutlined, MoneyCollectTwoTone, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { addTourPrices, deleteTourPrice, getCurrencies, getDestinations, getPrivateTourDetails, getTourGuideDetails, updatePrivateTour } from "../../services/admin/privateTourService";
import TextArea from "antd/es/input/TextArea";
import ImgCrop from "antd-img-crop";
import { Update } from "vite/types/hmrPayload.js";

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export default function TourDetails()
{
    const location = useLocation();
    const tourId= location.state.tourId;
    const [tourDetails, setTourDetails] = useState<PrivateTourDetailsDto>();
    const [previewImage,setPreviewImage] = useState("");
    const [tourGuide, setTourGuide] = useState<TourGuideDTO>();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm<UpdateTourDetailsDTO>();
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
    const [apiNotification, notificationContextHolder] = notification.useNotification();
    const [destinationsOptions, setDestinationsOptions] = useState<string[]>([]);
    const [currencies, setCurrencies] = useState<CurrencyDTO[]>([]);
    const [openPriceModal, setOpenPriceModal] = useState(false);
    const [tourPriceForm] = Form.useForm<UpdateTourPriceDTO>();



   
    

     function onSubmitTourPrice(values: AddTourPriceDTO): void {
    
        setConfirmLoading(true);
        const pricesToadd: AddTourPriceDTO[] = [];
        pricesToadd.push(values);

        if (tourDetails?.id !== undefined) {
            addTourPrices(tourDetails.id, pricesToadd).then(
                (apiResponse) => {
                    if(apiResponse.success)
                    {
                        
                        setTourDetails({
                            ...tourDetails,
                            tourPrice: [...apiResponse.data] // or whatever new data you have
                        });

                        tourPriceForm.resetFields(); // Reset the form after submission
                        openNotificationWithIcon('success', 'Tour prices added successfully.');
                        setConfirmLoading(false);
                    } else {
                        openNotificationWithIcon('error', apiResponse.message);
                    }
                }
            );
        } else {
            openNotificationWithIcon('error', 'Tour ID is undefined.');
        }
            
            
    }

    const openNotificationWithIcon = (type: NotificationType, message:string) => {
        apiNotification[type]({
        message: `${message}`,
        });
    };

    const showModal = () => {
        form.setFieldValue("title", tourDetails?.title || "");
        form.setFieldValue("overView", tourDetails?.overView || "");
        form.setFieldValue("durationDays", tourDetails?.durationDays || 1);
        form.setFieldValue("destinations", tourDetails?.destinations || []);
        setOpen(true);
    };

    const showPriceModal = () => {
        setOpenPriceModal(true);
    };

    const handleCancelTourPriceModel = () => {
        setOpenPriceModal(false);
    }

  

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

     const onSubmitPrivateTourForm = (values: UpdateTourDetailsDTO) =>
        {
            setConfirmLoading(true);
            setTimeout(() => {

                values.destinations = selectedDestinations;
                updatePrivateTour(tourId,values).then(
                (apiResponse) =>
                {
                    if(apiResponse?.success)
                    {
                        
                        setTourDetails(apiResponse.data);
                        openNotificationWithIcon('success',`${apiResponse.data.title} tour has created successfully`);
                        setOpen(false);
                        setConfirmLoading(false);
                    }
                    else
                    {
                        openNotificationWithIcon('error',`${apiResponse?.message}`);
                        setConfirmLoading(false);
                    }
                }
                ).catch(
                    (error) =>  
                    {
                        openNotificationWithIcon('error',`${error}`);
                        setConfirmLoading(false);
                    }
            );
            
            }, 2000); 
        }

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

        getDestinations().then(
                    (apiResponse) => {
                        if(apiResponse.success)
                        {
                            setDestinationsOptions(apiResponse.data);
                        }
                        else
                        {
                            openNotificationWithIcon('error',`${apiResponse.message}`);
                        }
                    }
        );
        
        getCurrencies().then(
            (apiResponse) => {
                if(apiResponse.success)
                {
                    setCurrencies(apiResponse.data);
                }
                else
                {
                    openNotificationWithIcon('error',`${apiResponse.message}`);
                }
            }
        );
                
    }, [tourId]);


    const filteredOptions = destinationsOptions.filter((o) => !selectedDestinations.includes(o));


    const activitiesTabItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'Details',
            children: (
            
                <div>
                    {notificationContextHolder}
                    <Flex   gap={"small"} >
                        <Button variant="outlined" color="green" size="small" onClick={showModal}>Update Details</Button>
                        <Button variant="outlined" color="green" size="small" onClick={showPriceModal}>Update Price list</Button>
                        <Modal
                            title="Update Tour Details"
                            centered
                            footer={null}
                            open={open}
                            onCancel={handleCancel}
                             width={{
                                xs: '90%',
                                sm: '80%',
                                md: '70%',
                                lg: '60%',
                                xl: '50%',
                                xxl: '40%',
                                }}
                        >
                            <Form<UpdateTourDetailsDTO>
                                title={"New Tour"}
                                size={"large"}
                                layout="vertical"
                                name="basic"
                                form={form}
                                initialValues={{ remember: true }}
                                onFinish={onSubmitPrivateTourForm}
                                autoComplete="on"
                            >

                                <Form.Item
                                    label="Title"
                                    name="title"
                                    rules={[{ required: true, message: 'Please enter title!' }]}
                                >
                                    <Input maxLength={100} showCount />
                                </Form.Item>

                                <Form.Item
                                    label="Over View For Tour (Short Description)"
                                    name="overView"
                                    rules={[{ required: true, message: 'Please enter over view' }]}
                                >
                                    <TextArea rows={4}  maxLength={500} showCount/>
                                </Form.Item>

                                <Form.Item
                                    label="Duration (Days)"
                                    name="durationDays"
                                    rules={[{ required: true, message: 'Please enter duration' }]}
                                >
                                    <InputNumber min={1}  style={{ width: '100%' }} />
                                </Form.Item>
                                
                                <Form.Item
                                    label="Destinations"
                                    name={"destinations"}
                                    rules={[{ required: true, message: 'Please enter destination' }]}
                                >
                                    <Select
                                        mode="multiple"
                                        value={selectedDestinations}
                                        onChange={setSelectedDestinations}

                                        style={{ width: '100%' }}
                                            options={filteredOptions.map((item) => ({
                                                value: item,
                                                label: item,
                                            }))}
                                        placeholder="Select destinations"
                                        allowClear
                                    />
                                </Form.Item>

                                <Form.Item label={null}>
                                    <Button type="primary" htmlType="submit" loading={confirmLoading}>
                                        Submit
                                    </Button>
                                </Form.Item>
                        </Form>
                        </Modal>

                        <Modal
                            title="Update Price List"
                            centered
                            footer={null}
                            open={openPriceModal}
                            onCancel={handleCancelTourPriceModel}
                             width={{
                                xs: '90%',
                                sm: '80%',
                                md: '70%',
                                lg: '60%',
                                xl: '50%',
                                xxl: '40%',
                                }}
                        >
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
                                    {
                                        title: 'Actions',
                                        key: 'actions',
                                        render: (_, record) => (
                                           
                                            <Popconfirm
                                                key={record.id}
                                                onConfirm={() => handleDeleteTourPrice(record.id )}
                                                title={record.quantity + " - " + record.pricePerPerson + " " + record.currency.code}
                                                description="Are you sure to delete this Tour?"
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <DeleteOutlined key="setting" />
                                            </Popconfirm>
                                        ),
                                    },
                                ]}
                            />
                            
                
                            <Form<AddTourPriceDTO>
                                layout="vertical"
                                name="basic"
                                form={tourPriceForm}
                                initialValues={{ remember: true }}
                                onFinish={onSubmitTourPrice}
                                autoComplete="on"
                            >
                                <Form.Item
                                    label="Quantity"
                                    name="quantity"
                                    rules={[{ required: true, message: 'Please enter quantity!' }]}
                                >
                                    <InputNumber min={1}  style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item
                                    label="Price Per Person"
                                    name="pricePerPerson"
                                    rules={[{ required: true, message: 'Please enter price per person' }]}
                                >
                                    <InputNumber min={1}  style={{ width: '100%' }}  />
                                </Form.Item>

                                <Form.Item
                                    label="Currency"
                                    name="currency"
                                    rules={[{ required: true, message: 'Please select currency' }]}
                                >
                                    <Select
                                        style={{ width: '100%' }}
                                        options={currencies.map((currency) => ({
                                            value: currency.code,
                                            label: `${currency.symbol} (${currency.code})`,
                                        }))}
                                        placeholder="Select Currency"
                                        allowClear
                                    />
                                </Form.Item>


                                
                                <Form.Item>
                                    <Alert message="You can add multiple tour prices." type="warning" showIcon />
                                </Form.Item>
                                
                                <Form.Item label={null}>
                                    <Button 
                                        type="primary" 
                                        
                                        htmlType="submit" 
                                        loading={confirmLoading}
                                    > 
                                        Add Tour Price <PlusOutlined />
                                    </Button>
                                </Form.Item>
                                    
                            </Form>

                        </Modal>


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



    const handleDeleteTourPrice = (tourPriceId: number) => 
        new Promise((resolve) => 
        {
            setTimeout(
                () =>
                {
                    if (tourDetails?.id !== undefined) {
                        deleteTourPrice(tourDetails.id, tourPriceId).then(
                            (apiResponse) => {
                                if(apiResponse.success)
                                {
                                    
                                    setTourDetails({
                                        ...tourDetails,
                                        tourPrice: [...apiResponse.data] // or whatever new data you have
                                    });

                                    openNotificationWithIcon('success', 'Tour price removed successfully.');
                                    setConfirmLoading(false);
                                } else {
                                    openNotificationWithIcon('error', apiResponse.message);
                                }
                            }
                        );
                    } else {
                        openNotificationWithIcon('error', 'Tour ID is undefined.');
                    }

                    resolve(null);
                    
                }
                    , 
                1000
            );
        }
    );






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