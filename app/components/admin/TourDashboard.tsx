import { Col, Row, Typography } from "antd";
import { Outlet } from "react-router-dom";


export default function TourDashboard()
{
    return(
        <div>
                <Typography.Title 
                    style={
                        {
                            backgroundColor:""
                        }
                    }>
                        Tours Management
                    </Typography.Title>
                <Outlet/>
        </div>
    );
}