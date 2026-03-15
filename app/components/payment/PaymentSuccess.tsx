import { Button, Result } from "antd";
import { RightOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';



export default function PaymentSuccess()
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
            title="Your Payment Successfully Received!"
            // subTitle={`Your Booking reference number is : ${pasrsedBookingData?.referenceNumber}`}
            extra={[
            <Button type="primary" onClick={() => navigate("/")} > OK <RightOutlined /></Button>,
            ]}
        />
    );
}