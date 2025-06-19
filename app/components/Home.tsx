import { Button, Col, Flex, Progress, Row,Image, Layout, Menu, Drawer, Typography } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { isMobile, isTablet, isBrowser } from 'react-device-detect';
import { Link, Outlet } from 'react-router-dom';
import { LikeOutlined, MenuOutlined, MessageOutlined, ShoppingCartOutlined, StarOutlined, MailOutlined } from '@ant-design/icons';
import { useState } from 'react';


const items = [
  {
    key: '1',
    label: <Link to="/" >Home</Link>,
  },
  {
    key: '2',
    label: <Link to="" >Tours</Link>,
  },
  {
    key: '3',
    label: <Link to="/" >Products</Link>,
  },
  {
    key: '4',
    label: <Link to="/" >Zanzibar</Link>,
  }
  ,
  {
    key: '5',
    label: <Link to="/" >Kilimanjaro</Link>,
  },
  {
    key: '6',
    label: <Link to="/" >Serengeti</Link>,
  }

];

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Layout >
      {
        isMobile ? 
        (
          <Header
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              width: '100%',
              
              backgroundColor:'white'
            
            }}
          >
            <Flex vertical={false} gap={"large"} >
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
                  <Image preview={false}  src="logo2.jpeg" width='100%'/> 
                </div>
                <div>
                  <Button type='primary' size='large'>Book A Trip</Button>
                </div>
                
            
              </Flex>            
            
            
            
          
          </Header>
        )
        :
        ( 
            <Header
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                backgroundColor:'white'
              }}
            >
              <div className="demo-logo">
                <Image preview={false}  src="logo1.jpg"/>
              </div>
              <Menu
                theme='light'
                mode="horizontal"
                defaultSelectedKeys={['1']}
                items={items}
                style={{ flex: 1, minWidth: 0 }}
              />

              <Button type='primary' size='large'>Book A Trip</Button>
            
            </Header>
        )
      }
        
      <Content style={{backgroundColor:"white"}}>
      
          <Outlet />
        
      </Content>
      <Footer style={{textAlign:'center'}}>

        ©{new Date().getFullYear()} Created by <a href='https://www.tante.tz' target="_blank">tante.tz</a>
            
      </Footer>
    </Layout>
      );
}
