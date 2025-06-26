import { Link, useLocation } from "react-router-dom";
import { Breadcrumb, Button, Card, Col, Image, List, Row, Statistic, Tabs, TabsProps, Typography, Table, Flex, Modal, Form, notification, Input, InputNumber, Select, Upload, UploadProps, Alert, Popconfirm, DatePicker, Tag, UploadFile, Space, Timeline } from 'antd';
import Meta from "antd/es/card/Meta";
import { CalendarFilled, CalendarOutlined, CalendarTwoTone, ClockCircleFilled, ClockCircleTwoTone, DeleteColumnOutlined, DeleteOutlined, DeleteRowOutlined, EnvironmentOutlined, EnvironmentTwoTone, ExclamationCircleOutlined, FieldTimeOutlined, LikeOutlined, MoneyCollectTwoTone, PlusOutlined, UploadOutlined, UserAddOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { addEndOfTourInformation, addPickUpInformation, addTourActivity, addTourPrices, deleteTourPrice, getCurrencies, getDestinations, getPrivateTourDetails, getTourGuideDetails, updatePrivateTour } from "../services/admin/privateTourService";
import TextArea from "antd/es/input/TextArea";
import ImgCrop from "antd-img-crop";
import { Update } from "vite/types/hmrPayload.js";
import { isMobile } from "react-device-detect";

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export default function TourDetails()
{
    const location = useLocation();
    const tourDetails : PrivateTourDetailsDto = location.state.tourDetails;
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
    const [openMeetingPointModal, setOpenMeetingPointModal] = useState(false);
    const [pickUpInformationForm] = Form.useForm<MeetingPoint>();
    const [openEndPointModal, setOpenEndPointModal] = useState(false);
    const [tourActivityForm] = Form.useForm<AddTourActivityDTO>();
    const [openTourActivityModal, setOpenTourActivityModal] = useState(false);
    const [fileListMultiplePhotos, setFileListMultiplePhotos] = useState<UploadFile[]>([]);
    const [travellers, setTravellers] = useState<number>(0);
    const [pricePerPerson, setPricePerPerson] = useState<number>(0);
    const [miniMumPricePerPerson, setMinimumPricePerPerson] = useState<number>(0);
    


    const handleOpenActivityModel = () => {
        setOpenTourActivityModal(true);
        tourActivityForm.resetFields(); // Reset the form fields
        tourActivityForm.setFieldsValue({
            dayNumber: (tourGuide?.tourActivities?.length ?? 0) + 1, // Set the next day number
            title: "",
            description: "",
            startTime: "00:00", // Default start time
            endTime: "00:00", // Default end time
            location: ""
        });
    };

    function submitTourActivity(values: AddTourActivityDTO) {
   
           setConfirmLoading(true);
           setTimeout(() => {
   
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
                               setTourGuide(apiResponse.data);
                               tourActivityForm.resetFields(); // Reset the form after submission
                               tourActivityForm.setFieldsValue({
                                   dayNumber: apiResponse.data.tourActivities.length+1,
                                   title: "",
                                   description: "",
                                   startTime: "",
                                   endTime: "",
                                   location: ""
                               });
                               setOpenTourActivityModal(false); // Close the modal after submission
                               setConfirmLoading(false);
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
   
               
   
           }, 1000);
           
   
    }

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
    
    
    
   

    const openNotificationWithIcon = (type: NotificationType, message:string) => {
        apiNotification[type]({
        message: `${message}`,
        });
    };


  

 
    // Fetch tour details using the tourId from the location state
    // This is a placeholder, you should replace it with your actual data fetching logic
    // For example, you might use useEffect to fetch the data when the component mounts
    useEffect(() => {
        
        // Fetch tour guide details if needed
        getTourGuideDetails(tourDetails.id)
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

        const sortedPrice = tourDetails.tourPrice.sort();
        const lastPrice = sortedPrice[sortedPrice.length-1];
        setPricePerPerson(lastPrice.pricePerPerson);
        setTravellers(lastPrice.quantity);
        setMinimumPricePerPerson(lastPrice.pricePerPerson)
                
    }, []);




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
                       
                        

                         <Timeline
                            items={[
                            {
                                color:"orange",
                                dot: <EnvironmentOutlined/>,
                                // label:"On Arrival",
                                children: (
                                    <Meta 
                                        title = {<h3>On Arival</h3>}
                                        description={tourGuide?.pickUpInformation.details}
                                    />
                                )
                            },
                           
                            ...(tourGuide?.tourActivities || []).map((activity, index) => ({
                            children: (
                                <div>
                                    <h3>Day {activity.dayNumber}</h3>
                                    <p > <span style={{fontSize:"18px"}}>{activity.title}</span> <br />
                                    &nbsp;&nbsp;&nbsp;&nbsp; {activity.description}</p>
                                    
                                    <div>
                                        <h5>Location/Destination</h5>
                                        <ul>
                                            <li><p>{activity.location}</p></li>
                                        </ul>
                                    </div>

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
                            })),

                            {
                                color:"green",
                                dot:<EnvironmentOutlined />,
                                children: (
                                    <Meta 
                                        title = {<h3>End of Tour</h3>}
                                        description={tourGuide?.endOfTourInformation.details}
                                    />
                                ),
                            },
                            ]}
                        />
                        
                
                    
            ),
        }
    ];





    return(
        <div
        >
            {notificationContextHolder}
            
            <div
                style={
                      { 
                        height:isMobile ? "200px":"300px", 
                        background:`url(${tourDetails.bannerImageUrl})`,
                        backgroundSize: "cover", 
                        backgroundPosition: "center",
                        // imageRendering: "auto",
                        backgroundRepeat: "no-repeat" ,
                        
                        objectFit: "cover",
                        display:"flex",
                        justifyContent:"end",
                        flexDirection:"column",
                        textAlign:"center"                        
                        

                      }}
            >
                <h1 style={{color:"white"}}>sample</h1>
                
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
                                <p><span style={{fontSize:"25px"}}><b>{pricePerPerson}</b></span> pp ({tourDetails.tourPrice[0].currency.code})</p>
                                

                                <DatePicker 
                                    size="large"
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
                                        const pp = tourDetails.tourPrice.find(x => x.quantity==value)?.pricePerPerson??miniMumPricePerPerson;
                                        setPricePerPerson(pp as number);

                                    }}
                                />
                                <Button size="large" type="primary">Book Now</Button>
                            </Flex>
                            <br />
                        </Col>
                    </Row>
                        
                    
                </Col>

            </Row>
           

        </div>
    );
}