import { Col, Flex, Progress, Row, Steps, Typography, Image, Button, Carousel, Select, DatePicker, notification } from "antd";
import { EnvironmentOutlined, FileAddOutlined, HeatMapOutlined, LoadingOutlined, NodeExpandOutlined, RightOutlined } from "@ant-design/icons";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import { getDestinations, getPrivateTours } from "../services/admin/privateTourService";
import { useNavigate } from "react-router-dom";

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export default function HomePage(){
    const naigate = useNavigate();
    const [destinations, setDestinations] = useState<string[]>([]);
    const [tours, setTours] = useState<PrivateTourListItemDto[]>([]);
    const [notificationApi, notificationContextHolder] = notification.useNotification();
    const [filteredTours, setFilteredTours] = useState<PrivateTourListItemDto[]>([]);
    const [filterByDestinationKey, setFilterByDestinationKey] = useState<string>("");


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
                    setFilteredTours(apiResponse.data);
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

    const goToTours = () => {
        if (filteredTours.length > 0) {
            naigate(
              '/tours', 
              { 
                state: 
                { 
                  filterByDestinationKey:filterByDestinationKey,
                  filteredTours:filteredTours
                } 
              });
        } else if (destinations.length > 0) {
            openNotificationWithIcon('warning', 'No tours found for the selected destination');
        } else {
            openNotificationWithIcon('warning', 'Please select a destination');
        }
    };
    
    const handleDestinationFilter = (value: string) => {
      setFilterByDestinationKey(value);
      const filteredTours: PrivateTourListItemDto[] = tours.filter(tour => tour.destinations.includes(value));
      setFilteredTours(filteredTours);
    };

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

    function CarouselImage(url:string)
    {
        return(<Image 
                width={"100%"}
                height={"600px"}
                style={{
                  objectFit:"cover"
                }}
                preview={false} 
                src={url}
              />
        )
    }

    return(
      <div style={{width:"100%"}}>
        {notificationContextHolder}

          <Flex 
            vertical
          >

             {
                isMobile ?(
                    <Row>
                      <Col span={24} style={{backgroundColor:"white"}}>
                          <Carousel 
                            autoplay>
                            <div>
                              <Image preview={false} src="/carousel/tour3.JPG"/>
                            </div>
                            <div>
                              <Image preview={false} src="kilimajaro1.jpg"/>
                            </div>
                            <div>
                              <Image preview={false} src="zanzibar2.jpg"/>
                            </div>
                            <div>
                              <Image preview={false} src="serengeti1.jpg"/>
                            </div>
                            <div>
                              <Image preview={false} src="zanzbar1.jpg"/>
                            </div>
                            
                            <div>
                              <Image preview={false} src="/carousel/znz2.JPG"/>
                            </div>
                           
                            <div>
                              <Image preview={false} src="/carousel/znz4.JPG"/>
                            </div>
                            <div>
                              <Image preview={false} src="/carousel/znz5.JPG"/>
                            </div>
                            <div>
                              <Image preview={false} src="/carousel/znz6.JPG"/>
                            </div>
                            
                          </Carousel>
                      </Col>
                    </Row>
                    )
                    :
                (
                  <Row
                    style={
                      {
                        width: "100%",
                        minHeight: "400px" 

                      }
                    }
                  >
                      <Col 
                        span={24} 
                        
                      >

                          <Carousel 
                            autoplay
                            arrows
                          >
                            <div>
                              {CarouselImage("/carousel/tour3.JPG")}
                            </div>
                            <div>
                              
                             { CarouselImage("kilimajaro1.jpg")}
                            </div>
                            <div>
                              { CarouselImage("serengeti1.jpg")}
                            </div>
                            <div>
                                {CarouselImage("/carousel/beach-2.jpg")}
                            </div>
                            
                            <div>
                              {CarouselImage("/carousel/znz2.JPG")}
                            </div>
                           
                            <div>
                                {CarouselImage("/carousel/znz4.JPG")}
                            </div>
                            <div>
                              {CarouselImage("/carousel/znz5.JPG")}
                            </div>
                            <div>
                              {CarouselImage("/carousel/znz6.JPG")}
                            </div>
                            
                          </Carousel>
                        
                      </Col>
                    </Row>
                )
            }
           
              <Typography.Title 
                style={
                  {
                    textAlign:"center",
                    fontFamily:"monospace"
                  }
                } 
                level={3}
              >
                Karibu Tanzania
              </Typography.Title>
            
            <Row 
              justify={"center"}
              style={
                {
                  padding:"10px"
                }
              }
            >
              <Col xs={24} sm={6} lg={6} xl={6} xxl={6}>
                <Flex 
                  vertical
                  gap={"small"}
                >
                <Select
                    prefix={<EnvironmentOutlined />}
                    size="large"
                    placeholder="Where To"
                    onChange={(value) => handleDestinationFilter(value)}
                    options={destinations.map(dest => ({ value: dest, label: dest }))}
                    
                  />
                  <Button 
                      size="large" 
                      variant="solid" 
                      color="green"
                      onClick={goToTours}
                  > 
                    {filteredTours.length} Tours <RightOutlined />
                  </Button>
              </Flex>
              </Col>
              
             
            </Row>
                  
                  
             
              
           
                

          </Flex>

      </div>
    )
    
      
    ;
}