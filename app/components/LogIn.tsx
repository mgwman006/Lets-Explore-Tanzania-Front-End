
import { useNavigate } from 'react-router';
import { UserStatus, type LogInDetails } from '../models/user';
import { logInUser } from '../services/userServices';
import { saveToLocalStorage } from '../utilities/localStorage';
import { Button, Checkbox, Flex, Form, Input, Space, type FormInstance } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';


interface FormValues {
  email: string;
  passWord: string;
}
export default function LogIn() {

  const navigate = useNavigate();

  const [form]: [FormInstance<FormValues>] = Form.useForm<FormValues>();

   const handleLogIn = async (vallues:FormValues) => {
    
    const logInDetails: LogInDetails = {
      email: vallues.email,
      passWord: vallues.passWord
    }

    try {
      const response = await logInUser(logInDetails);
      const data = response.data as { userStatus: UserStatus, userDetails: { id: number } };
      if(response.status===200 && data.userStatus == UserStatus.LogInSuccess)
      {
          const id:number = data.userDetails.id;
          saveToLocalStorage("isUserLoggedIn","true");
          navigate(`/landlord/${id}`);
      }
          
      else 
        console.log(response);
    } catch (error)
    {
      console.error('Failed to load users:', error); 
    }

  }
  
      return (
        <Space align='center' direction='vertical' style={{ width: '100%',height: '100%', paddingTop: '15%' }}>
              <h1>Tante App</h1>
              <p>Please log in to your account as a property owner.</p>
              <Form<FormValues>
              layout="vertical"
              form={form}
              name="login"
              initialValues={{ remember: true }}
              style={{ maxWidth: 360 }}
              onFinish={handleLogIn}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="email" type='email'/>
              </Form.Item>
              <Form.Item
                name="passWord"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <Flex justify="space-between" align="center">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <a href="">Forgot password</a>
                </Flex>
              </Form.Item>

              <Form.Item>
                <Button block type="primary" htmlType="submit">
                  Log in
                </Button>
                or <a href="/registerlandlord">Register now!</a>
              </Form.Item>
            </Form>
        </Space>
            
  );
}
