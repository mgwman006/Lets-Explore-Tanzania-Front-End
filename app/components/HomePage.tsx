import { Col, Flex, Progress, Row, Steps, Typography, Image, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function HomePage(){
    return(

          <Flex vertical style={{background:'bg.webp'}}>

              <Row align={"middle"} >
                    <Col 
                    xs={24} sm={12} md={12} lg={12} xl={12} 
                    style={{textAlign:'center'}}
                    >
                      <Typography.Title level={3}>
                        Lets Explore Tanzania Like Never Before. Zanzibar, Kilimanjaro, Serengeti and Many More Destinations
                      </Typography.Title>
                      <Button size="large" variant="solid" color="green">Start Planning</Button>
                  </Col>
                  
                   <Col 
                    xs={24} sm={12} md={12} lg={12} xl={12}  
                    >
                      <Image  preview={false} src="explore.jpg" alt="Property" />
                  </Col> 
              </Row>

          </Flex>


                
          

          
    )
    
      
    ;
}