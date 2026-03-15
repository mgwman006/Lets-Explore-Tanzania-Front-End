import { SmileOutlined, SolutionOutlined,UserOutlined } from '@ant-design/icons';
import { Steps, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import BookingDetails from './BookingDetails';
import BookingContactPerson from './BookingContactPerson';
import BookingSuccess from './BookingSuccess';


export default function BookingPage()
{
    const [stepCurrent,setStepCurrent] = useState<number>(0);

    const next = () => setStepCurrent((s) => s + 1);
    const back = () => setStepCurrent((s) => s - 1);
      

    const stepsItems = [
        {
            title: 'Contact Person',
            icon: <SolutionOutlined />,
            content:<BookingContactPerson  next={next}/>
        },
        {        
            title: 'Booking Details',
            icon: <UserOutlined />,
            content: <BookingDetails next={next} />
        },
        {
            title: 'Done',
            icon: <SmileOutlined />,
            content: <BookingSuccess />
        },
    ];

    return (
        <Row justify={'center'} align={'middle'} style={{padding:10}}>
            <Col xs={22} sm={22} md={18} lg={18} xl={18} xxl={18} >
                <Steps
                size="small"
                current={stepCurrent}
                items={stepsItems}
                />
            </Col>
            <Col xs={22} sm={22} md={18} lg={18} xl={18} xxl={18}>
                <div>{stepsItems[stepCurrent].content}</div>
            </Col>
            
            
        </Row>
        
    );
}