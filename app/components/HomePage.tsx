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


    const openNotificationWithIcon = (type: NotificationType, message:string) => {
        notification[type]({
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

    const goToFilteredTours = () => {
        if (filteredTours.length > 0) {
            naigate(
              '/filteredtours', 
              { 
                state: 
                { 
                  tours: tours,
                  filteredTours: filteredTours,
                  destinations: destinations, 
                } 
              });
        } else if (destinations.length > 0) {
            openNotificationWithIcon('warning', 'No tours found for the selected destination');
        } else {
            openNotificationWithIcon('warning', 'Please select a destination');
        }
    };
    
    const handleDestinationFilter = (value: string) => {
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

    return(
      <div style={{width:"100%"}}>
        {notificationContextHolder}

          <Flex vertical>

             {
                isMobile ?(
                    <Row>
                      <Col span={24} style={{backgroundColor:"white"}}>
                        <Flex vertical >

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
                          <Flex 
                            vertical 
                          >
                            <Typography.Title style={{textAlign:"center"}}>Karibu Tanzania</Typography.Title>
                            <Flex 
                              gap={"small"} 
                              vertical
                              style={{ 
                                textAlign:'center', 
                                backgroundColor:"#f5f3ed", 
                                padding:"20px"
                                }}>
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
                                    onClick={goToFilteredTours}
                                > 
                                  {filteredTours.length} Tours <RightOutlined />
                                </Button>
                            </Flex>
                            
                          </Flex>
                        </Flex>
                      </Col>
                    </Row>)
                    :
                (
                  <Row 
                    align={"middle"}
                    justify={"center"}
                    
                    style={
                      { 
                        height:"100vh", 
                        background:"url(try.jpeg)",
                        backgroundSize: "cover", 
                        backgroundPosition: "center",
                        // imageRendering: "auto",
                        backgroundRepeat: "no-repeat" ,
                        
                          objectFit: "cover",
                        

                      }
                    }>
                    
                    
                            <Col 
                                span={12}
                                style={{textAlign:'center'}} 
                            >
                          <Flex vertical align="center">
                            <Flex 
                              gap={"small"} 
                              vertical={false} 
                              style={{ textAlign:'center', backgroundColor:"#f5f3ed", padding:"20px"}}>
                                
                                <Select
                                  prefix={<EnvironmentOutlined />}
                                  size="large"
                                  placeholder="Where To"
                                  style={{ width: 200 }}
                                  onChange={(value) => handleDestinationFilter(value)}
                                  options={destinations.map(dest => ({ value: dest, label: dest }))}
                                />

                                <Button 
                                  size="large" 
                                  variant="solid" 
                                  color="green"
                                  onClick={goToFilteredTours}
                                > 
                                    {filteredTours.length} Tours <RightOutlined />
                                </Button>
                            </Flex>
                            <Typography.Title style={{color:"yellow"}}>Karibu Tanzania</Typography.Title>
                          </Flex>
                            
                      </Col>
                      
                        
                      
                      
                  </Row>
                )
            }
                

          </Flex>

      </div>
    )
    
      
    ;
}