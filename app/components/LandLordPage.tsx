import * as React from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import type { Tenant } from '../models/user';
import { getTenants, registerTenant } from '../services/userServices';
import { Avatar, Button, Col, Flex, FloatButton, Input, List, Modal, Result, Row, Space, Tag, Tooltip, Typography } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
  MoreOutlined, 
  PlusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';



interface TenantResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

interface LandLordResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
};

interface LandLordWithTenantsResponseDto {
  landLordDetails: LandLordResponseDto;
  tenants: TenantResponseDto[];
};

   

export default function LandLordPage() {

    const params = useParams();
    const navigate = useNavigate();
    const [openForm, setOpenForm] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [tenantFirstName, setTenantFirstName] = useState('');
    const [tenantLatName, setTenantLastName] = useState('');
    const [tenantEmail, setTenantEmail] = useState('');
    const [tenantPhoneNumber, setTenantPhoneNumber] = useState('');
    const [landLord,setLandLord] = useState<LandLordWithTenantsResponseDto>();
    const [landlordId, setLandLordId] = useState(Number(params.landlordId));

    useEffect(() => {

        try {
            getTenants(landlordId).then(
              response => {
                const data = response.data as LandLordWithTenantsResponseDto;
                console.log(data);
                setLandLord(data);
              }
            );
        } catch (error) {
          console.log(error);
        }
    },[]);

    const showModal = () => {
      setOpenForm(true);
    };
   

    const closeModal = () => {
        setOpenForm(false);
    };

    const handleSubmit = async () => {
        
        setConfirmLoading(true);
        const tenant : Tenant = {
            firstName:tenantFirstName,
            lastName:tenantLatName,
            phoneNumber:tenantPhoneNumber,
            email:tenantEmail
        };

        try {
            const response = await registerTenant(landlordId,tenant);
            
            if(response.status === 201) {
                console.log(response.data);
                setConfirmLoading(false);
                setOpenForm(false);
                window.location.reload(); // Reload the page to fetch updated tenant list
            } else {
                alert("Failed to register tenant. Please try again.");
            }
        } catch (error) {
            alert(error);
            setConfirmLoading(false);
        }
    }

  return (
            
    <Space direction="vertical" style={{ width: '100%', height: '100%' }}>

      {landLord?.tenants !== null && landLord?.tenants!== undefined && landLord.tenants.length>0 ? 
      
        <Space align="center" direction="vertical" style={{ width: '100%', height: '100%', padding: '20px' }}>
          
            <List      
              itemLayout="vertical"
              header ={
                <Flex justify='space-between' >
                  <Typography >Tenants/Contracts</Typography>
                  <Button size='small' type="primary" shape="circle" icon={<PlusOutlined />} onClick={showModal} />
                </Flex>
            }
              bordered
              dataSource={landLord.tenants}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  actions={[
                      <Tag icon={<CheckCircleOutlined />} color="success">Signed</Tag>,
                      <Tag icon={<CloseCircleOutlined />} color="error">Not Paid</Tag>
                  ]}
                  extra={
                    <Tooltip title="More Info">
                      <Button size='small' shape="circle" icon={<MoreOutlined />} onClick={() => alert("not implemented")} />
                    </Tooltip>
                  }
                >
                      <List.Item.Meta
                        avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item.id}`} />}
                        title={<a href="https://ant.design">{item.firstName}</a>}
                        description={`${item.firstName} ${item.lastName} - ${item.email} - ${item.phoneNumber}`}
                      />
                </List.Item>
                  
              )}
            />
         </Space>
      :
        <Result
            
            title={`${landLord?.landLordDetails !== undefined  && landLord?.landLordDetails !== null && landLord?.landLordDetails.firstName !== null
              ? 
              landLord.landLordDetails.lastName 
              : 
              'You have'} , no registered tenants yet.`}
            status="warning"
            icon={<ExclamationCircleOutlined />}
            subTitle="Manage your properties and tenants with ease."
            extra={
              <Button color='blue' onClick={showModal} icon={<PlusCircleOutlined />} variant='outlined'>
                Register Tenant
              </Button>
            }
          />
      }
           


         
            
      <Modal
            title="Register Tenant"
            open={openForm}
            onOk={handleSubmit}
            confirmLoading={confirmLoading}
            onCancel={closeModal}
            footer={[
              <Button key="back" onClick={closeModal}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" loading={confirmLoading} onClick={handleSubmit}>
                Submit
              </Button>
            ]}
          >
            <Flex vertical align='center' gap={10} >
              <Row >
                <Col span={24}>
                  <Input placeholder="First Name" value={tenantFirstName} onChange={(e) => setTenantFirstName(e.target.value)} />
                </Col>
              </Row>
              <Row >
                <Col span={24}>
                  <Input placeholder="Last Name" value={tenantLatName} onChange={(e) => setTenantLastName(e.target.value)} />
                </Col>
              </Row>
              <Row >
                <Col span={24}>
                  <Input placeholder="Email" value={tenantEmail} onChange={(e) => setTenantEmail(e.target.value)} />
                </Col>
              </Row>
              <Row >
                <Col span={24}>
                  <Input placeholder="Phone Number" value={tenantPhoneNumber} onChange={(e) => setTenantPhoneNumber(e.target.value)}  />
                </Col>  
              </Row>
            </Flex>
            
            
      </Modal>
    </Space>

  );
}