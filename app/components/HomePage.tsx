import { Col, Flex, Progress, Row, Steps, Typography, Image, Button, Carousel } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function HomePage(){
    return(

          <Flex vertical style={{background:'bg.webp'}}>

              <Row align={"middle"}  style={{ height:"100vh"}}>
                    <Col 
                    xs={24} sm={12} md={12} lg={12} xl={12} 
                    style={{textAlign:'center'}}
                    >
                      <Typography.Title level={3}>
                        Lets Explore Tanzania Like Never Before.<br /> Zanzibar, Kilimanjaro, Serengeti and Many More Destinations
                      </Typography.Title>
                      <Button size="large" variant="solid" color="green">Plan Your Trip</Button>
                   </Col>
                  
                   <Col 
                    xs={24} sm={12} md={12} lg={12} xl={12}  
                    >
                      
                      <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={5000} >
                          <div>
                            <Image style={{ objectFit: 'cover'}}  preview={false} src="kilimajaro1.jpg" />
                          </div>
                          <div>
                            <Image style={{ objectFit: 'cover'}}  preview={false}  src="zanzibar3.jpg" />
                          </div >
                          <div >
                            <Image style={{ objectFit: 'cover'}}  preview={false}  src="zanzibar2.jpg" />
                          </div>
                          <div>
                            <Image style={{ objectFit: 'cover', }} preview={false}  src="zanzbar1.jpg" />
                          </div>  
                      </Carousel>
                   </Col> 
              </Row>
              
                

          </Flex>


                
          

          
    )
    
      
    ;
}