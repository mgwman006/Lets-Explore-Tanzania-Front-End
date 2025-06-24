import { Alert, Breadcrumb, Button, Col, DatePicker, Drawer, Flex, Form, GetProp, Input, InputNumber, List, message, notification, Result, Row, Select, Space, Steps, Table, TableProps, Tag, Typography, Upload, UploadFile, UploadProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import ImgCrop from 'antd-img-crop';
import { EnvironmentOutlined, LoadingOutlined, PlusOutlined, RightOutlined, SmileOutlined, SolutionOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { addBannerImage, addEndOfTourInformation, addPhotos, addTourActivity, addTourPrices, createPrivateTour, createTourGuide, getCurrencies, getDestinations } from "../../services/admin/privateTourService";
import { useBeforeUnload, useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const columns: TableProps<TourPriceDTO>['columns'] = [
  {
    title: 'Quantity',
    dataIndex: 'quantity',
  },
  {
    title: 'Price Per Person',
    dataIndex: 'pricePerPerson',
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
    render: (currency: any) => `${currency.symbol} (${currency.code || currency.name})`
  },
];

export default function AddTour()
{
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [createdTour,setCreatedTour] = useState<PrivateTourCreatedDto>();
    const [bannerImageFileList, setBannerImageFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [fileListMultiplePhotos, setFileListMultiplePhotos] = useState<UploadFile[]>([]);
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
    const [destinationsOptions, setDestinationsOptions] = useState<string[]>([]);
    const [currencies, setCurrencies] = useState<CurrencyDTO[]>([]);
    const [tourPrices, setTourPrices] = useState<TourPriceDTO[]>([]);
    const [tourPriceForm] = Form.useForm<AddTourPriceDTO>();
    const [tourActivitisies, setTourActivities] = useState<TourActivityDTO[]>([]);
    const [tourActivityForm] = Form.useForm<AddTourActivityDTO>();
    const [tourGuideCurrentStep, setTourGuideCurrentStep] = useState<number>(0);
    const [pickUpInformationForm] = Form.useForm<MeetingPoint>();
    const [endOfTourInformationForm] = Form.useForm<MeetingPoint>();
    const [tourGuide, setTourGuide] = useState<TourGuideDTO | null>(null);
    const [open, setOpen] = useState(false);


    const { Option } = Select;

    const showDrawer = () => {
        tourActivityForm.setFieldsValue({
            dayNumber: tourActivitisies.length+1,
            title: "",
            description: "",
            startTime: "",
            endTime: "",
            location: ""
        });
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };


    const filteredOptions = destinationsOptions.filter((o) => !selectedDestinations.includes(o));

    useEffect(() => {
        // Fetch destinations from the server or any other source 
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

        tourActivityForm.setFieldsValue({dayNumber: 0}); // Initialize dayNumber to 1
    }, []);

   
 
    const openNotificationWithIcon = (type: NotificationType, message:string) => {
        api[type]({
        message: `${message}`,
        });
    };

    const onSubmitPrivateTourForm = (values: PrivateTourAddDto) =>
    {
        setLoading(true);
        values.destinations = selectedDestinations;
        const formData = new FormData();
        formData.append("metadata", new Blob([JSON.stringify(values)], { type: "application/json" }));
        if (bannerImageFileList.length > 0 && bannerImageFileList[0].originFileObj) {
            formData.append("bannerImage", bannerImageFileList[0].originFileObj as File);
        }   


        setTimeout(() => {
            createPrivateTour(formData).then(
            (apiResponse) =>
            {
                if(apiResponse?.success)
                {
                    
                    setCreatedTour(apiResponse.data);
                    setCurrent(current+1);
                    openNotificationWithIcon('success',`${apiResponse.data.title} tour has created successfully`);
                }
                else
                {
                    openNotificationWithIcon('error',`${apiResponse?.message}`)
                }
                setLoading(false);
            }
        );
       
        }, 1000);

        
    }

    
    function onSubmitTourPrice(values: AddTourPriceDTO): void {

        setLoading(true);
        const pricesToadd: AddTourPriceDTO[] = [];
        pricesToadd.push(values);

        if (createdTour?.id !== undefined) {
            addTourPrices(createdTour.id, pricesToadd).then(
                (apiResponse) => {
                    if(apiResponse.success)
                    {
                        setTourPrices(apiResponse.data);
                        tourPriceForm.resetFields(); // Reset the form after submission
                        openNotificationWithIcon('success', 'Tour prices added successfully.');
                    } else {
                        openNotificationWithIcon('error', apiResponse.message);
                    }
                }
            );
        } else {
            openNotificationWithIcon('error', 'Tour ID is undefined.');
        }
            
        setLoading(false);
          
    }

    function submitTourActivity(values: AddTourActivityDTO) {
        setLoading(true);
        const formData = new FormData();
        fileListMultiplePhotos.forEach((file, idx) => {
            if (file.originFileObj) {
                formData.append("images", file.originFileObj as File);
            }
        });

        const activityToAdd: AddTourActivityDTO = {
                ...values,
                startTime: values.startTime ? values.startTime : "00:00",
                endTime: values.endTime ? values.endTime : "00:00"
            };

        
        
        formData.append("metadata", new Blob([JSON.stringify(activityToAdd)], { type: "application/json" }));
     
        if (tourGuide?.id !== undefined) {
            
            addTourActivity(tourGuide.id, formData).then(
                (apiResponse) => {
                    if(apiResponse.success)
                    {
                        setTourActivities(apiResponse.data);
                        tourActivityForm.resetFields(); // Reset the form after submission
                        tourActivityForm.setFieldsValue({
                            dayNumber: apiResponse.data.length+1,
                            title: "",
                            description: "",
                            startTime: "",
                            endTime: "",
                            location: ""
                        });
                        if (createdTour?.durationDays !== undefined && apiResponse.data.length >= createdTour.durationDays) {
                            setTourGuideCurrentStep(tourGuideCurrentStep + 1); // Move to next step in tour guide steps
                        }
                        
                        setFileListMultiplePhotos([]); // Clear the file list after submission
                        openNotificationWithIcon('success', 'Tour activity added successfully.');
                        
                    } else {
                        openNotificationWithIcon('error', apiResponse.message);
                    }
                }
            );
        } else {
            openNotificationWithIcon('error', 'Tour ID or Tour Guide ID is undefined.');
        }

        setLoading(false);
    }

    const propsUploadBannerImage: UploadProps = {
        name: 'bannerImage',
        multiple: false,
        maxCount: 1,
        listType: 'picture',
        accept: 'image/*',
        fileList: bannerImageFileList,
        customRequest: ({ file, onSuccess }) => {
            onSuccess?.('ok');
        },
        onChange: ({ file, fileList }) => {
            setBannerImageFileList(fileList);
            
        }
    };

    const propsMoreImages: UploadProps = {
        fileList:fileListMultiplePhotos,
        maxCount: 10,
        listType: "picture-card",
        
        onRemove: (file) => {
            setFileListMultiplePhotos(prev => prev.filter(item => item.uid !== file.uid));
            return true;
        }
        ,
        beforeUpload: (file) => {

            if (!(file instanceof File)) {
                openNotificationWithIcon("error","invalid file")
                return false;
            }

            if (!file.type.startsWith('image/')) {
                openNotificationWithIcon("error","only image allowed")

                return false;
            }
            if (file.type.startsWith('image/svg+xml')) {
                openNotificationWithIcon("error","SVG file not supported")
                return false;
             }
            return true;
        },
        customRequest: ({ file, onSuccess}) =>
        {
                
            setFileListMultiplePhotos(prev => [
                ...prev,
                {
                    ...(file as UploadFile),
                    uid: (file as any).uid || Date.now().toString(),
                    name: (file as File).name,
                    status: 'done',
                    url: (file as any).url,
                    originFileObj: file as any, // keep as any to satisfy UploadFile type
                }
            ]);
            onSuccess?.('ok');
            
        },
        onChange(info)
        {
            // alert("file "+info.file.error+" "+info.file.status);
           
        }
    };

    function submitPickUpInformation(values: MeetingPoint) {
        
        setLoading(true);
        setTimeout(() => {
            if (createdTour?.id !== undefined) {
                createTourGuide(createdTour.id, values).then(
                    (apiResponse) => {
                        if (apiResponse.success) {

                            setTourGuide(apiResponse.data);
                            pickUpInformationForm.resetFields(); // Reset the form after submission
                            setTourGuideCurrentStep(tourGuideCurrentStep + 1); // Move to next step in tour guide steps
                            openNotificationWithIcon('success', 'Pick up information submitted successfully.');

                        } else {
                            openNotificationWithIcon('error', apiResponse.message);
                        }
                    }
                );
            } else {
                openNotificationWithIcon('error', 'Tour ID is undefined.');
            }
            setLoading(false);
        }, 1000);

    }

    function submitEndOfTourInformation(values: MeetingPoint) {
        setLoading(true);
        setTimeout(() => {
            if (tourGuide?.id !== undefined) {
                addEndOfTourInformation(tourGuide?.id, values).then(
                    (apiResponse) => {
                        if (apiResponse.success) {

                            tourGuide.endOfTourInformation = apiResponse.data;
                            setTourGuide(tourGuide);
                            setTourGuideCurrentStep(tourGuideCurrentStep + 1); // Move to next step in tour guide steps

                            openNotificationWithIcon('success', 'Pick up information submitted successfully.');

                        } else {
                            openNotificationWithIcon('error', apiResponse.message);
                        }
                    }
                );
            } else {
                openNotificationWithIcon('error', 'Tour ID is undefined.');
            }
            setLoading(false);
        }, 1000);
    }
    const tourGuideSteps = [
        {
            title: 'Pick Up Information',
            icon: tourGuideCurrentStep===0 ? <EnvironmentOutlined />:"",
            description: (
                <Form<MeetingPoint>
                    hidden={tourGuideCurrentStep !== 0}
                    title={"Pick Up Information"}
                    layout="vertical"
                    name="pickUpInfo"
                    form={pickUpInformationForm}
                    onFinish={(values) => {submitPickUpInformation(values)}}
                >
                    <Form.Item
                        label="Pick Up Location (Optional)"
                        name="location"
                        rules={[{ required: false, message: 'Please enter pick up location!' }]}
                    >
                        <Input maxLength={100} showCount />
                    </Form.Item>

                    <Form.Item
                        hidden={true}
                        label="Pick Up Date"
                        name="date"
                        rules={[{ required: false, message: 'Please select pick up date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>


                    <Form.Item
                        label="More Information"
                        name="details"
                        rules={[{ required: true, message: 'Please enter more information' }]}>
                        <TextArea rows={4} maxLength={500} showCount />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Submit Pick Up Information
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            title: 'Day To Day Tour Guide',
            icon: tourGuideCurrentStep===1 ? <SolutionOutlined />:"",

            description: (
                <>
                {tourGuideCurrentStep === 1 && (
                    <>
                        <List<TourActivityDTO>
                            bordered
                            size="small"
                            header={<div>Tour Activities</div>}
                            dataSource={tourActivitisies}
                            renderItem={(item, index) => (
                                <List.Item key={item.id}>
                                    <Typography.Text strong>{`Day ${item.dayNumber}: ${item.title}`}</Typography.Text>
                                    
                                    
                                </List.Item>
                            )}
                        />
                        <Button 
                            key="addActivity" 
                            type="primary" 
                            onClick={showDrawer}
                            style={{ marginTop: 16 }}
                        >
                            Add Day {tourActivitisies.length+1} Activity <PlusOutlined />
                        </Button>

                        <Drawer
                            title="Add Tour Activity"
                            width={720}
                            onClose={onClose}
                            open={open}
                            styles={{
                            body: {
                                paddingBottom: 80,
                            },
                            }}
                            extra={
                            <Space>
                                <Button onClick={onClose}>Cancel</Button>
                            </Space>
                            }
                        >
                            <Form<AddTourActivityDTO>
                                layout="vertical"
                                name="basic"
                                form={tourActivityForm}
                                initialValues={tourActivityForm.getFieldsValue()}
                                onFinish={(values) => {submitTourActivity(values)}}
                            >
                                <Form.Item 
                                    label="Day Number"
                                    name="dayNumber"
                                    rules={[{ required: true, message: 'Please enter day number' }]}
                                    >
                                    <InputNumber 
                                        min={0}  
                                        style={{ width: '100%' }} 
                                    
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Activity Title"                            
                                    name="title"
                                    rules={[{ required: true, message: 'Please enter activity title!' }]}
                                >
                                    <Input 
                                        maxLength={100} 
                                        showCount
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Description"
                                    name="description"
                                    rules={[{ required: true, message: 'Please enter activity description' }]}
                                >
                                    <TextArea rows={4}  maxLength={100} showCount/>
                                </Form.Item>

                                <Form.Item
                                    label='location'
                                    name="location"
                                    rules={[{ required: true, message: 'Please enter activity location' }]}
                                >
                                    <Input maxLength={100} showCount />
                                </Form.Item>

                        

                                <Form.Item
                                    label="Start Time (Optional)"
                                    name="startTime"
                                    rules={[{ required: false, message: 'Please enter start time' }]}
                                    >
                                    <Input type="time" style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item
                                    label="End Time (Optional)"
                                    name="endTime"
                                    rules={[{ required: false, message: 'Please enter end time' }]}
                                    >
                                    <Input type="time" style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item
                                    label="Add Photos (Required)"
                                    name={"photos"}
                                    rules={[{ required: true, message: 'Please upload at least one photo' }]}
                                >
                                    <Upload
                                        {...propsMoreImages}
                                    >
                                        {fileListMultiplePhotos.length >= 8 ? null : 
                                        (<div style={{backgroundColor:"white", width:"100%"}}>
                                            <p>+</p>
                                            <p>Upload</p>
                                        </div>)}
                                    </Upload>
                                </Form.Item>

                                <Form.Item>
                                    <Flex justify="space-between" align="center" gap="10px">
                                        <Button type="primary" htmlType="submit" loading={loading}>
                                            Add Activity
                                        </Button>
                                    </Flex>

                                </Form.Item>
                            </Form>
                        </Drawer>
                    </>
                )}
                
                
                </>
            ),
        },
        {
            title: 'End of Tour / Departure',
            icon: tourGuideCurrentStep===2 ? <EnvironmentOutlined />:"",
            description: (
                <Form<MeetingPoint>
                    hidden={tourGuideCurrentStep !== 2}
                    title={"End of Tour Information"}
                    layout="vertical"
                    name="endOfTourInfo"
                    form={endOfTourInformationForm}
                    onFinish={(values) => {submitEndOfTourInformation(values)}}
                >
                    <Form.Item
                        label="Dearture point (optional)"
                        name="location"
                        rules={[{ required: false, message: 'Please enter location!' }]}
                    >
                        <Input maxLength={100} showCount />
                    </Form.Item>

                    <Form.Item
                        hidden={true}
                        label="Pick Up Date"
                        name="dateTime"
                        rules={[{ required: false, message: 'Please select  date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>


                    <Form.Item
                        label="More Information"
                        name="details"
                        rules={[{ required: true, message: 'Please enter more information' }]}>
                        <TextArea rows={4} maxLength={500} showCount />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Submit Information
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            title: 'Complete',
            icon: tourGuideCurrentStep==3 ?<SmileOutlined /> : "",
            description:(
                <div
                    hidden = {tourGuideCurrentStep != 3}

                >
                    <Result
                    icon={<SmileOutlined />}
                    title="Great, we have done all the operations!"
                    extra={<Button type="primary" onClick={() => setCurrent(current+1)}>Next</Button>}
                />
                </div>
                
            )
        }
    ];


    const steps = [
        {
            title: 'Add new Tour',
            content: (
                <Form<PrivateTourAddDto>
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

                    <Form.Item
                        label="Banner Image (Required)"
                    >
                        <ImgCrop 
                            
                            aspect={3 / 1}
                            rotationSlider
                            showGrid={true}
                            modalTitle="Crop Banner Image"
                        >
                            <Upload
                                {...propsUploadBannerImage}
                            >
                                <Button icon={<UploadOutlined />}>Upload Banner Image</Button>
                            </Upload>
                        </ImgCrop>
                    </Form.Item>
                    
                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            title: 'Tour Pricces',
            content: (
                <>
                 <Table<TourPriceDTO>
                    columns={columns}
                    dataSource={tourPrices}
                    bordered
                    title={() => 'Added Tour Prices'}
                    
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
                        <Alert message="You can add multiple tour prices." type="info" showIcon />
                    </Form.Item>
                    
                    <Flex justify="space-between" align="center" gap="10px">
                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit" loading={loading}> 
                                Add Tour Price <PlusOutlined />
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button 
                                color="green" 
                                variant="solid" 
                                onClick={() => setCurrent(current+1)}
                            >
                                Next Step <RightOutlined />
                            </Button>
                        </Form.Item>
                    </Flex>
                </Form>

               

                </>
            ),
        },
        {
            title: 'Tour Guide',
            content: (
               
                <Steps
                    direction="vertical"
                    size="small"
                    current={tourGuideCurrentStep}
                    items={tourGuideSteps}
                />
               
            )
                
        },
        {
            title:"Done",
            content: (
                <div>
                    <Result
                        status="success"
                        title="Successfully Created a Tour!"
                        extra={[
                        <Button type="primary" onClick={() => navigate("/admin/tours")}>
                            Go to list
                        </Button>,
                        <Button  
                            onClick={
                                () => {
                                   
                                    navigate(
                                        {
                                            pathname: "/admin/tours/tourdetails",
                                        },
                                        {
                                            state: { tourId: createdTour?.id},
                                        }
                                    );

                                }
                            } key="buy">View Tour Drtails</Button>,
                        ]}
                    />

                </div>
            )
        }
    ];

    return (
        <div
            style={
                {
                    padding:"10px"
                }
            }
        >
                {contextHolder}
                  <Breadcrumb
                    items={[
                    {
                        title: <a href="/admin">Admin Home</a>,
                    },
                    {
                        title: <a href="/admin/tours">Tours</a>,
                    },
                    {
                        title: 'Add Tour',
                    },
                    ]}
                />
                <div>
                    <Row justify={"center"}>
                        <Col 
                            xs={24} sm={12} lg={12} xl={12} xxl={12} 
                            style={
                                {
                                    backgroundColor:"white",
                                    padding:"10px"
                                }
                        }>
                            <Steps onChange={(value)=> setCurrent(value)} current={current} items={steps} />
                        </Col>
                    </Row>
                
                <Row
                    justify={"center"}
                >
                    <Col 
                        xs={24} sm={12} lg={12} xl={12} xxl={12} 
                        style={
                            {
                                textAlign:"center",
                            }
                        }>
                            <Typography.Title level={3}>{createdTour?.title}</Typography.Title>
                        </Col>
                </Row>
                <Row 
                    justify={"center"}
                    style={{ }}
                >
                    <Col 
                        xs={24} sm={12} lg={12} xl={12} xxl={12} 
                        style={
                            {
                                justifyContent:"center", 
                                alignContent:"center", 
                                alignItems:"center",
                                backgroundColor:"lightyellow",
                                padding:"20px",
                                margin:"20px"
                            }
                        }>
                            {steps[current].content}

                    </Col>
                </Row>

                </div>
                
            
        </div>
    )
}












