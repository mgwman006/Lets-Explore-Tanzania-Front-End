import { Button, Result } from "antd";
import { RightOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';



export default function BookingSuccess()
{
    const navigate = useNavigate();
    
    const bookingDataString = localStorage.getItem("bookingData");
    let pasrsedBookingData;
    if(bookingDataString)
    {
        pasrsedBookingData = JSON.parse(bookingDataString);
    }
    return(
        <Result
            status="success"
            title="Your Booking Successfully Received!"
            subTitle={`Your Booking reference number is : ${pasrsedBookingData?.referenceNumber}`}
            extra={[
            <Button type="primary" onClick={() => navigate("/")} disabled> Pay Now <RightOutlined /></Button>,
            <Button type="primary" onClick={() => navigate("/")} disabled> Pay Later <RightOutlined /></Button>,
            ]}
        />
    );
}