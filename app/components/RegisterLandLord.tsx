import { Button, Form, Input, Space } from "antd";
import { useNavigate } from "react-router";
import type { LandLord, LandLordResponseDto } from "../models/user";
import { registerLandLord } from "../services/userServices";



export default function RegisterLandLord()
{
    
    const navigate = useNavigate();
    const [form] = Form.useForm<LandLord>();

    const handleClick = async (values : LandLord) => {
        
        const landLord : LandLord = {
            firstName:values.firstName,
            lastName:values.lastName,   
            phoneNumber:values.phoneNumber,
            email:values.email,
            passWord: values.passWord,
        };

        try {
            console.log('Registering LandLord:', landLord);
                const response = await registerLandLord(landLord);
                console.log('Response:', response);
                if(response.status===201)
                {
                    const data = response.data as LandLordResponseDto;
                    const id: number = Number(data.id);
                    navigate(`/landlord/${id}`);
                }
                else {
                    alert(`Registration failed: ${response}`);
                }
        } catch (error) {
            console.log('Failed to Register:', error); 
            alert(`Registration failed: ${error}`);
            
        };
    }

    return (
        <Space align='center' direction='vertical' style={{ width: '100%',height: '100%', paddingTop: '15%' }}>

            <h3>Tante App</h3>
            <p>Please Register as a property owner.</p>
            <Form<LandLord>
                form={form}
                name="registerLandLord"
                initialValues={{ remember: true }}
                style={{ maxWidth: 360}}
                onFinish={handleClick}
           >
                
                <Form.Item
                    name="firstName"
                    rules={[{ required: true, message: 'Please input your first name!' }]}
                >
                    <Input placeholder="First Name" type="text" />
                </Form.Item>

                <Form.Item
                    name="lastName"
                    rules={[{ required: true, message: 'Please input your last name!' }]}
                >
                    <Input placeholder="Last Name" type='text'/>
                </Form.Item>
                <Form.Item
                    name="phoneNumber"
                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                >   
                    <Input placeholder="Phone Number" type='tel'/>
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input placeholder="Email" type='email'/>
                </Form.Item>
                <Form.Item
                    name="passWord"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input.Password placeholder="Password" type='password'/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Register</Button>
                </Form.Item>
            
            </Form>
        </Space>
    );
}