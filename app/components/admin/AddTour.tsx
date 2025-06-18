import { Alert, Button, Col, DatePicker, Flex, Form, GetProp, Input, InputNumber, message, notification, Result, Row, Select, Space, Steps, Upload, UploadFile, UploadProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import ImgCrop from 'antd-img-crop';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { addBannerImage, addPhotos, createTour } from "../../services/admin/tourServices";
import { useBeforeUnload, useNavigate } from "react-router-dom";
import { time } from "node:console";
import { title } from "node:process";

const { RangePicker } = DatePicker;

type NotificationType = 'success' | 'info' | 'warning' | 'error';


export default function AddTour()
{
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [hideRangePicker,setHideRangePicker] = useState(true);
    const [createdTour,setCreatedTour] = useState<CreatedTourDto>();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [fileListMultiplePhotos, setFileListMultiplePhotos] = useState<UploadFile[]>([]);
    const [tourDetails, setTourDetails] = useState<TourDetailsDto>();





   
 
    const openNotificationWithIcon = (type: NotificationType, message:string) => {
        api[type]({
        message: `${message}`,
        });
    };

    function handleChange(value: boolean): void {
       setHideRangePicker(value);
    }

    const onSubmitForm = (values: AddTourDto) =>
    {
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
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter description' }]}
                    >
                        <TextArea rows={4}  maxLength={2000} showCount/>
                    </Form.Item>

                    <Form.Item
                        label="PricePerPerson"
                        name="pricePerPerson"
                        rules={[{ required: true, message: 'Please enter pricePerPerson' }]}
                    >
                        <InputNumber min={1}  style={{ width: '100%' }}/>
                    </Form.Item>

                    <Form.Item
                        label="Duration (Days)"
                        name="duration"
                        rules={[{ required: true, message: 'Please enter duration' }]}
                    >
                        <InputNumber min={1}  style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Do you have specific dates?"
                        name="isAvailableAllTheTime"
                        initialValue={true}
                        rules={[{ required: true, message: 'Please enter isAvailableAllTheTime' }]}
                    >
                        <Select
                            
                            style={{ width: '100%' }}
                            // defaultValue={true}
                            onChange={(e) => handleChange(e)}
                            options={[
                            { value: false, label: 'yes' },
                            { value: true, label: 'no' },
                        
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        hidden={hideRangePicker}
                    >
        
                        <RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        onChange={(value, dateString) => {
                            console.log('Selected Time: ', value);
                            console.log('Formatted Selected Time: ', dateString);
                        }}
                        //   onOk={onOk}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Destination"
                        name="destination"
                        rules={[{ required: true, message: 'Please enter destination' }]}
                    >
                        <Input />
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
            title: 'Add Banner Image',
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
                        subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
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
                    backgroundColor:"darkgray",
                    padding:"10px"
                }
            }
        >
                {contextHolder}
    
                <Row justify={"center"}>
                    <Col 
                        span={24} 
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
                                backgroundColor:"#faf8f2",
                                padding:"20px",
                                margin:"20px"
                            }
                        }>

                            {steps[current].content}

                    </Col>
                </Row>

            
        </div>
    )
}





