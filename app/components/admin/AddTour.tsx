import { Alert, Breadcrumb, Button, Col, DatePicker, Flex, Form, GetProp, Input, InputNumber, message, notification, Result, Row, Select, Space, Steps, Table, TableProps, Upload, UploadFile, UploadProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import ImgCrop from 'antd-img-crop';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { addBannerImage, addPhotos, addTourPrices, createTour, getCurrencies, getDestinations } from "../../services/admin/tourServices";
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
    const [hideRangePicker,setHideRangePicker] = useState(true);
    const [createdTour,setCreatedTour] = useState<TourDetailsDto>();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [fileListMultiplePhotos, setFileListMultiplePhotos] = useState<UploadFile[]>([]);
    const [tourDetails, setTourDetails] = useState<TourDetailsDto>();
    const [rangePickerValue, setRangePickerValue] = useState<string[]>([]);
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
    const [destinationsOptions, setDestinationsOptions] = useState<string[]>([]);
    const [currencies, setCurrencies] = useState<CurrencyDTO[]>([]);
    const [tourPrices, setTourPrices] = useState<TourPriceDTO[]>([]);
    const [tourPriceForm] = Form.useForm<AddTourPriceDTO>();


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
    }, []);

   
 
    const openNotificationWithIcon = (type: NotificationType, message:string) => {
        api[type]({
        message: `${message}`,
        });
    };

    function handleChange(value: boolean): void {
       setHideRangePicker(!value);
    }

    const onSubmitForm = (values: AddTourDto) =>
    {
        values.tourDates = { startDate:rangePickerValue[0], endDate:rangePickerValue[1]};
        values.destinations = selectedDestinations;

        setLoading(true);
        setTimeout(() => {
            createTour(values).then(
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
       
        }, 3000);

        
    }


    const handleSubmitMorePhotoes = () => {

        setLoading(true);
        const formData = new FormData();
        fileListMultiplePhotos.forEach((file, idx) => {
            if (file.originFileObj) {
                formData.append("photos", file.originFileObj as File);
            }
        });

         if (createdTour?.id !== undefined)
         {
            addPhotos(createdTour?.id,formData).then(
            (apiResponse) => {
                if(apiResponse.success)
                {
                    setTourDetails(apiResponse.data);
                    openNotificationWithIcon("success","success");
                    setCurrent(current+1);
                }
                else{
                    openNotificationWithIcon("error", apiResponse.message);
                }
                setLoading(false);
            })
         }
         else{
            openNotificationWithIcon("error", "tour id is undefined")
         }
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

    const propsUploadBannerImage: UploadProps = {
        fileList:fileList,
        maxCount: 1,
        listType: 'picture',
        customRequest({ file, onSuccess, onError }) {
            
            if (!(file instanceof File)) {
                onError?.(new Error('Invalid file type.'));
                return;
            }

            if (!file.type.startsWith('image/')) {
                onError?.(new Error('Only image files are allowed.'));
                return;
            }
            if (file.type.startsWith('image/svg+xml')) {
                onError?.(new Error('SVG files are NOT allowed.'));
                return;
            }
            
            const formData = new FormData();
            formData.append('image', file);

            if (createdTour?.id !== undefined) {
                addBannerImage(createdTour.id, formData).then(
                    (apiResponse) => {
                        if(apiResponse?.success)
                        {
                            onSuccess?.('ok');
                        }
                        else
                        {
                            onError?.(new Error(apiResponse?.message || 'Unknown error'));
                        }
                    }
                );
            } else {
                onError?.(new Error('Tour ID is undefined.'));
                return;
            }


        },
        onChange(info)
        {
            if (info.file.status === 'done') 
            {
                openNotificationWithIcon('success',"Barnner Successfully upload");
                setCurrent(current+1);
            } 
            else if (info.file.status === 'error') 
            {
                // messageApi.error(`${info.file.error} upload failed.`);
                openNotificationWithIcon('error',`${info.file.error} upload failed`)
                setFileList([]); 
            }
            else{
                setFileList(info.fileList);
            }
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


    const steps = [
        {
            title: 'Add new Tour',
            content: (
                <Form<AddTourDto>
                    title={"New Tour"}
                    size={"large"}
                    layout="vertical"
                    name="basic"
                    form={form}
                    initialValues={{ remember: true }}
                    onFinish={onSubmitForm}
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
                        name ="hasSpecificDates"
                        label="Do you have specific dates?"
                        initialValue={false}
                        rules={[{ required: true, message: 'Please enter isAvailableAllTheTime' }]}
                    >
                        <Select
                            
                            style={{ width: '100%' }}
                            onChange={(e) => handleChange(e)}
                            options={[
                            { value: true, label: 'yes' },
                            { value: false, label: 'no' },
                        
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name={'tourDates'}
                        hidden={hideRangePicker}
                        rules={[{ required: !hideRangePicker, message: 'Please select tour dates' }]}
                    >
        
                        <RangePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DDTHH:mm"
                            onChange={(value, dateString) => {
                                setRangePickerValue(dateString);
                            }}
                        />
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

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            title: 'Banner Image',
            content: (

                    <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                
                        <ImgCrop 
                            aspect={4 / 3}
                            rotationSlider
                        >
                            <Upload
                                {...propsUploadBannerImage}
                            >

                                <Button icon={<UploadOutlined />}>Upload Banner Image</Button>
                            </Upload>
                        </ImgCrop>
                        
                        

                    </div>
                    
                
            ),
        },
        {
            title: 'Tour Pricces',
            content: (
                <>
                
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
                                Add Tour Price
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button color="green" variant="solid" onClick={() => setCurrent(current+1)}>
                                Done
                            </Button>
                        </Form.Item>
                    </Flex>
                </Form>

                <Table<TourPriceDTO>
                    columns={columns}
                    dataSource={tourPrices}
                    bordered
                    title={() => 'Added Tour Prices'}
                    
                />

                </>
            ),
        },
        {
            title: 'Add Photos',
            content: (


                <div style={
                        {
                            display:"flex", 
                            flexDirection:"column", 
                            alignItems:"center",
                            gap:"20px"
                        }
                    }>
                    
                    <div>
                        <Upload
                        {...propsMoreImages}
                        >

                            {fileList.length >= 8 ? null : 
                                (<div>
                                    <p>+</p>
                                    <p>Upload</p>
                                </div>)}

                        </Upload>
                    </div>
                    
                    <div hidden={fileListMultiplePhotos.length==0}>
                        <Button loading={loading} size="large" variant="solid" color="green" onClick={handleSubmitMorePhotoes}>Submit</Button>
                    </div>
                    

                </div>
                    
                
            ),
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
                                            state: { tourDetails: tourDetails },
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
                            <Steps current={current} items={steps} />
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







