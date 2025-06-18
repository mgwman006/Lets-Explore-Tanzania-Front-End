import { List, Avatar, Image, Card, Row, Col, Button, Popconfirm, PopconfirmProps, notification, Modal } from "antd";
import { useEffect, useState } from "react";
import { StarOutlined, LikeOutlined, MessageOutlined, SettingOutlined, EditOutlined, EllipsisOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import { getTours, deteleTour } from "../../services/admin/tourServices";
import { useNavigate } from "react-router-dom";

type NotificationType = 'success' | 'info' | 'warning' | 'error';
export default function AdminTours()
{

    const navigate = useNavigate();
    const [tours, setTours] = useState<TourListItemDto[]>([]);
    const [notificationApi, notificationContextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type: NotificationType, message:string) => {
        notificationApi[type]({
        message: `${message}`
        });
    };

    const getLatestTourData = () =>
    {
        getTours().then(
            (apiResponse) =>
            {
                if (apiResponse && apiResponse.message)
                {
                    setTours(apiResponse.data);
                }
                else if (apiResponse) 
                {
                    openNotificationWithIcon("error",apiResponse.message)
                }
                else
                {
                    openNotificationWithIcon("error","Failed to fetch tours: apiResponse is undefined")
                }
            }
        );
    }

    useEffect(() => {
        
        getLatestTourData();
        
    }, []);

    // Ensure the handler matches Popconfirm's onConfirm signature
    const handleDeleteTour = (tourId: number) => 
        new Promise((resolve) => 
        {
            setTimeout(
                () =>
                {
                    deteleTour(tourId).then(
                        (apiResponse) =>
                        {
                            if(apiResponse.success)
                            {
                                getLatestTourData();
                                openNotificationWithIcon("success","Deleted Successfully")
                            }
                            else
                            {
                                alert(apiResponse.message);
                            }
                        }
                    );

                    resolve(null);
                    
                }
                    , 
                3000
            );
        }
    ); 
   

   
    return(
        <div>
            {notificationContextHolder}
                        
            <List
                header={<Button onClick={() => navigate("addtour")} variant="outlined" color="green">Add New Tour <PlusOutlined /></Button>}
                grid={{
                gutter: 5,
                xs: 1,
                sm: 4,
                md: 4,
                lg: 4,
                xl: 4,
                xxl: 4,
                }}
                style={{
                    backgroundColor:"darkgray",
                    padding:"10px"
                }}
                dataSource={tours}
        
                renderItem={(item) => (

                    <List.Item
                        key={item.title}
                    >
                        <Card
                            cover={
                                <Image
                                    alt="example"
                                    src={item.getBannerImageUrl}
                                    fallback="../listfallbackimage.png"
                                />
                            }
                            actions={[
                                <Popconfirm
                                    key={item.id}
                                    onConfirm={() => handleDeleteTour(item.id)}
                                    title={item.title}
                                    description="Are you sure to delete this Tour?"
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <DeleteOutlined key="setting" />
                                </Popconfirm>,
                                <EditOutlined key="edit" />,
                                <EllipsisOutlined key="ellipsis" />,
                            ]}
                        >
                            <Meta
                                title={item.title}
                            />
                        </Card>
                    </List.Item>
                    
                )}
            />
        </div>
    );
}