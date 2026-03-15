import { Button, Result } from "antd";
import { RightOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PayPalOrderRequest from "../../models/payPal";



export default function BookingSuccess()
{
    const navigate = useNavigate();
    
    const bookingDataString = localStorage.getItem("bookingData");
    if(!bookingDataString)
    {
        return;
    }

    let pasrsedBookingData = JSON.parse(bookingDataString);


    const onPayNow = () =>
    {
        const payMentPayload : PayPalOrderRequest = {currency:"USD", amount:pasrsedBookingData.totalPrice, referenceNumber:pasrsedBookingData.referenceNumber}; 
        localStorage.setItem("payMentPayload",JSON.stringify(payMentPayload));
        navigate("/pay");
    }

    return(
        <Result
            status="success"
            title="Your Booking Successfully Received!"
            subTitle={`Your Booking reference number is : ${pasrsedBookingData?.referenceNumber}`}
            extra={[
            <Button type="primary" onClick={onPayNow} > Pay Now <RightOutlined /></Button>,
            <Button type="primary" onClick={() => navigate("/")} > Pay Later <RightOutlined /></Button>,
            ]}
        />
    );
}