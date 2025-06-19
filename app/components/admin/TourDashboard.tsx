import { Breadcrumb, Col, Row, Typography } from "antd";
import { Outlet } from "react-router-dom";


export default function TourDashboard()
{
    return(
        <div>
            <Outlet/>
        </div>
    );
}