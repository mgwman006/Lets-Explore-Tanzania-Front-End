import { Button, Col, Flex, Progress, Row,Image, Layout, Menu, Drawer, Typography } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { isMobile, isTablet, isBrowser } from 'react-device-detect';
import { Link, Outlet } from 'react-router-dom';
import { LikeOutlined, MenuOutlined, MessageOutlined, ShoppingCartOutlined, StarOutlined, MailOutlined } from '@ant-design/icons';
import { useState } from 'react';


const items = [
  {
    key: '1',
    label: <Link to="/admin" ><b>Home</b></Link>,
  },
  {
    key: '2',
    label: <Link to="tours" ><b>Tours</b></Link>,
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
              display: 'flex',
              alignItems: 'center',
              backgroundColor:'#1EB53A'
            
            }}
          >
            
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
                      style={{ flex: 1, minWidth: 0, backgroundColor:"#1EB53A" }}
                      onClick={() => setShowMenu(false)}
                    />
                </Drawer>
            </div>

            {/* <div className="demo-logo" > */}
            <div style={{  width:'100%', alignContent:'center', color:'#FCD116', textAlign:'center', fontSize:'50'}}>
              {/* <Image preview={false}  src="logo-white-black.png" width='60%'/> */}
              <h2>LetsExploreTanzania</h2>
            </div>
            
          
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
                backgroundColor:'#1EB53A'
              }}
            >
              <div className="demo-logo" style={{fontSize:'20px', color:'#FCD116'}}>
                {/* <Image preview={false}  src="mini.png"/> */}
                <h2>LetsExploreTanzania</h2>
              </div>
              <Menu
                theme='light'
                mode="horizontal"
                defaultSelectedKeys={['1']}
                items={items}
                style={{ flex: 1, minWidth: 0 , backgroundColor:"#1EB53A"}}
              />

              
            
            </Header>
        )
      }
        
      <Content >
      
        <Outlet />
        
      </Content>
      <Footer style={{textAlign:'center'}}>

        ©{new Date().getFullYear()} Created by <a href='https://www.tante.tz' target="_blank">tante.tz</a>
            
      </Footer>
    </Layout>
      );
}
