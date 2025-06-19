import { Col, Flex, Progress, Row, Steps, Typography, Image, Button, Carousel, Select, DatePicker } from "antd";
import { EnvironmentOutlined, FileAddOutlined, HeatMapOutlined, LoadingOutlined, NodeExpandOutlined, RightOutlined } from "@ant-design/icons";
import { isMobile } from "react-device-detect";

export default function HomePage(){
    return(

          <Flex vertical>

             {
                isMobile ?
                    <Row>
                      <Col span={24} style={{backgroundColor:"white"}}>
                        <Flex vertical >

                          <Carousel autoplay>
                            <div>
                              <Image src="kilimajaro1.jpg"/>
                            </div>
                            <div>
                              <Image src="zanzibar2.jpg"/>
                            </div>
                            <div>
                              <Image src="serengeti1.jpg"/>
                            </div>
                            <div>
                              <Image src="zanzbar1.jpg"/>
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
                              options={[
                                { value: 'jack', label: 'Zanzaibar' },
                                { value: 'lucy', label: 'Kilimanjaro' },
                                { value: 'Yiminghe', label: 'Serengeti' },
                                { value: 'disabled', label: 'Mikumi', disabled: true },
                              ]}
                            />
                            <DatePicker  size="large" />

                            <Button size="large" variant="solid" color="green"> 0 Tours <RightOutlined /></Button>
                            </Flex>
                            
                          </Flex>
                        </Flex>
                      </Col>
                    </Row>
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
                            <Flex gap={"small"} vertical={false} style={{ textAlign:'center', backgroundColor:"#93e9be", padding:"20px"}}>
                                <Select
                              prefix={<EnvironmentOutlined />}
                              size="large"
                              placeholder="Where To"
                              style={{ width: 200 }}
                              options={[
                                { value: 'jack', label: 'Zanzaibar' },
                                { value: 'lucy', label: 'Kilimanjaro' },
                                { value: 'Yiminghe', label: 'Serengeti' },
                                { value: 'disabled', label: 'Mikumi', disabled: true },
                              ]}
                            />
                            <DatePicker size="large" />

                            <Button size="large" variant="solid" color="green"> 0 Tours <RightOutlined /></Button>
                            </Flex>
                            <Typography.Title style={{color:"yellow"}}>Karibu Tanzania</Typography.Title>
                          </Flex>
                            
                      </Col>
                      
                        
                      
                      
                  </Row>
                )
            }
                

          </Flex>


                
          

          
    )
    
      
    ;
}