import { Button, Col, Flex, Progress, Row,Image, Layout, Menu, Drawer, Typography, List } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { isMobile, isTablet, isBrowser } from 'react-device-detect';
import { Link, Outlet } from 'react-router-dom';
import { LikeOutlined, MenuOutlined, MessageOutlined, ShoppingCartOutlined, StarOutlined, MailOutlined, VideoCameraAddOutlined, VideoCameraOutlined, YoutubeOutlined, InstagramOutlined, InsertRowAboveOutlined, TikTokOutlined, WhatsAppOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { use, useEffect, useState } from 'react';
import { getDestinations } from '../services/admin/privateTourService';


const items = [
  {
    key: '1',
    label: <Link to="/" >Home</Link>,
  },
  {
    key: '4',
    label: <Link to="zanzibar" >Zanzibar</Link>,
  }

];

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [destinations, setDestinations] = useState<string[]>([]);

  useEffect(() => {
    // Fetch destinations from the API or any other source
    getDestinations().then(
                (apiResponse) => {
                   
                    if(apiResponse.success)
                    {
                        setDestinations(apiResponse.data);}
                    else
                    {
                        alert(`Error ${apiResponse.message}`);
                    }
                }
            );  
    
  }, []);
  return (
    <Layout >
      {
        isMobile ? 
        (
          <Header
            style={{
              position: 'fixed',
              top: 0,
              left:0,
              zIndex: 1,
              width: '100%',
              backgroundColor:'white'
            
            }}
          >
            <Flex justify='space-between' vertical={false} gap={"large"} >
                <div>
                    <MenuOutlined  onClick={() => setShowMenu(true)} style={{ fontSize:'25px'}}/>
                    <Drawer
                        title="Menu"
                        placement="left"
                        onClose={() => setShowMenu(false)}
                        open={showMenu}
                        size='large'
                        >

                        <Menu
                          theme="light"
                          mode="vertical"
                          defaultSelectedKeys={['1']}
                          items={items}
                          style={{ flex: 1, minWidth: 0 }}
                          onClick={() => setShowMenu(false)}
                        />
                    </Drawer>
                </div>

                <div style={{  alignContent:'center'}}>
                  <Image preview={false}  src="/logo1.jpg" width='100%'/> 
                </div>
            
            </Flex>            
          
          </Header>
        )
        :
        ( 
            <Header
              style={{
                 position: 'fixed',
                top: 0,
                left:0,
                zIndex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                backgroundColor:'white'
              }}
            >
              <div className="demo-logo">
                <Image preview={false}  src="/logo1.jpg"/>
              </div>
              <Menu
                theme='light'
                mode="horizontal"
                defaultSelectedKeys={['1']}
                items={items}
                style={{ flex: 1, minWidth: 0 }}
              />

              {/* <Button type='primary' size='large'>Plan A Trip</Button> */}
            
            </Header>
        )
      }
      
      <Content 
        style={{ paddingTop: "60px" }}
      >
        <Outlet />
      </Content>

      <Footer
        style={{
          backgroundColor: '#393b3a',
          padding: '20px',
          color: 'white',
          fontSize: '14px'
        }}
      >
        <Row>
          <Col xs={24} sm={8} lg={8} xl={8} xxl={8}>
                <h2>Contact Us</h2>
                <p style={{fontSize:"15px"}}>
                  Samora Ave,<br />Dar es Salaam 50069,<br />Tanzania <br />
                  letsexploretanzania@gmail.com <br />+255 692 650 730
                  
                </p>
                <Flex vertical={false} gap={"middle"}>
                  <a 
                    style={
                      {
                        color:"green",
                        fontSize:"25px"
                      }
                    } 
                    target='_blank' href='https://youtube.com/@letsexploretanzania8611?si=TY2QV9D7xjbgWv3-'
                  >
                    <YoutubeOutlined />
                  </a>
                  <a 
                    style={
                      {
                        color:"green",
                        fontSize:"25px"
                      }
                    } 
                    target='_blank' 
                    href='https://www.instagram.com/letsexploretanzania/'>
                    <InstagramOutlined />
                  </a>
                  <a 
                    style={
                      {
                        color:"green",
                        fontSize:"25px"
                      }
                    } 
                    target='_blank' 
                    href='https://www.facebook.com/letsexploretanzania'>
                    <LikeOutlined />
                  </a>
                  <a 
                    style={
                      {
                        color:"green",
                        fontSize:"25px"
                      }
                    } 
                    target='_blank' 
                    href='https://vm.tiktok.com/ZMrQXgCbL/'>
                      <TikTokOutlined />
                  </a>
                  <a 
                    style={
                      {
                        color:"green",
                        fontSize:"25px"
                      }
                    } 
                    target='_blank' 
                    href='https://whatsapp.com/channel/0029VaUrhBpKQuJRklQiFe1v'
                  >
                    <WhatsAppOutlined />
                  </a>
                </Flex>
          </Col>
          {/* <Col xs={24} sm={8} lg={8} xl={8} xxl={8}>
             <h2>Destinations</h2>
             <List
                grid={{ gutter: 16, column: isMobile ? 2 : 3 }}
                size="small"
                dataSource={destinations}
                renderItem={item => <List.Item><Link style={{color :"white"}} to={``}>{item}</Link></List.Item>}
              />
          </Col> */}

          
        </Row>
        <Row style={{ textAlign: 'center', marginTop: '20px' }}>
            <Col span={24}>
              {/* ©{new Date().getFullYear()} Built with love by <a href='https://www.tante.tz' target="_blank">tante.tz</a> */}
              ©{new Date().getFullYear()} Built with love by tante
            </Col>
        </Row>
            
      </Footer>
    </Layout>
      );
}
