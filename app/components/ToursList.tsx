

import { Button, Card, List, notification, Select, Typography } from "antd";
import { EnvironmentOutlined, MoneyCollectFilled, MoneyCollectOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import NormalizeTrailingSlash from "./NormalizeTrailingSlash";
import { getDestinations, getPrivateTours } from "../services/admin/privateTourService";

const { Title, Paragraph, Text, Link } = Typography;

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export default function ToursList() {

 // get data from the state passed from HomePage
  const location = useLocation();
  const [tours, setTours] = useState<PrivateTourListItemDto[]>([]);
  const [filteredTours, setFilteredTours] = useState<PrivateTourListItemDto[]>(location?.state?.filteredTours ?? []);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [filterByDestinationKey, setFilterByDestinationKey] = useState<string>(location?.state?.filterByDestinationKey ?? "");
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const navigate = useNavigate();

  
  const openNotificationWithIcon = (type: NotificationType, message:string) => {
      notificationApi[type]({
      message: `${message}`,
      });
  };

  const getLatestTourData = () =>
  {
    getPrivateTours().then(
        (apiResponse) =>
        {
            if (apiResponse && apiResponse.message)
            {
                setTours(apiResponse.data);
                setFilteredTours(apiResponse.data)

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

  const handleDestinationFilter = (value: string) => {
      const filteredTours: PrivateTourListItemDto[] = tours.filter(tour => tour.destinations.includes(value));
      setFilteredTours(filteredTours);
    };

  const handleViewSafari = (value : PrivateTourListItemDto) => {
    navigate(
      `/tours/${value.id}`,
       {
        state:{
          tourDetails:value
        }
      }
    )
  }

  
  useEffect(
    () =>
    {
      getLatestTourData();
      getDestinations().then(
          (apiResponse) => {
              if(!apiResponse || !apiResponse.success || !apiResponse.data) {
                  openNotificationWithIcon('error', 'Failed to fetch destinations');
                  return;
              }
              if(apiResponse.success)
              {
                  setDestinations(apiResponse.data);}
              else
              {
                  openNotificationWithIcon('error',`${apiResponse.message}`);
              }
          }
      );  
                
  },[]);
  
  return (
    <div>
      <NormalizeTrailingSlash />
      {notificationContextHolder}
      <h1>Filtered Tours</h1>
     
      
      <List
        header={
           <Select
              style={{width:"200px"}}
              defaultValue={filterByDestinationKey}
              showSearch
              prefix={<EnvironmentOutlined />}
              size="large"
              placeholder="Where To"
              onChange={(value) => handleDestinationFilter(value)}
              options={destinations.map(dest => ({ value: dest, label: dest }))}
            />
        }
        style={{ backgroundColor: '', padding: '10px' }}
        // bordered
        grid={{ gutter: 16, column: isMobile ? 1 : 4 }}
        itemLayout="horizontal"
        dataSource={filteredTours || []}
        renderItem={tour => (
          <List.Item>
            <Card 
            // style={{ width: '100%' }}
              cover={
                <img
                  alt="tour"
                  src={tour.bannerImageUrl || 'https://via.placeholder.com/150'}
                  style={{ height: '200px', objectFit: 'cover' }}
                />}
                actions={
                  [
                    <div
                      style={{
                        paddingLeft:"20px",
                        paddingRight:"20px"
                      }}
                    >
                         <Button 
                            block
                            size="large"
                            variant="solid"
                            color="blue"
                            onClick={() => handleViewSafari(tour)}
                          >
                            View Safari
                          </Button>
                    </div>
                   
                  ]
                }
            >
              
                  <Typography>
                      <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>{tour.title}</Text>
                      <br />   
                      {
                        tour.tourPrice && tour.tourPrice.length === 0 ? (
                          <Text type="warning"><MoneyCollectOutlined /> No Price Available</Text>
                        ) :
                        tour.tourPrice.length > 1 ? (
                          <Text 
                              type="warning"
                              style={{ fontSize: '16px', fontWeight: 'bold' }}
                            
                          >
                            <MoneyCollectOutlined /> {tour.tourPrice[0]?.pricePerPerson} to {tour.tourPrice[tour.tourPrice.length - 1]?.pricePerPerson} {tour.tourPrice[0]?.currency.code}
                          </Text>
                        ) : (
                          <Text style={{ fontSize: '16px', fontWeight: 'bold' }} type="warning"><MoneyCollectOutlined /> {tour.tourPrice[0]?.pricePerPerson} {tour.tourPrice[0]?.currency.code}</Text>
                        )
                       }
                          <br />
                      <Text 
                        type="success"
                      > 
                        <EnvironmentOutlined /> {tour.destinations.join(', ')}
                      </Text>
                  </Typography>
              
              
              
            </Card>
          </List.Item>
        )}
      />

    </div>
  );
}