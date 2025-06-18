import { useLocation } from "react-router-dom";
import { Image, List } from 'antd';


export default function TourDetails()
{
    const location = useLocation();
    const state= location.state;
    const tourDetails :TourDetailsDto = state?state.tourDetails:null;

    return(
        <div
            style={{
                backgroundColor:"#dbdbdb",
                padding:"20px"
            }}
        >
            <h1> {tourDetails?tourDetails.title:""}</h1>
            <Image.PreviewGroup
                preview={{
                onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                }}
            >
                   <List
                        grid={{
                            gutter: 16,
                            xs: 1,
                            sm: 4,
                            md: 4,
                            lg: 4,
                            xl: 4,
                            xxl: 4,
                        }}

                        bordered
                        dataSource={tourDetails.photos}
                        renderItem={(item) => (
                            <List.Item>
                                <Image  src={item.toString()} />
                            </List.Item>
                        )}
                    />
 
            </Image.PreviewGroup>


        </div>
    );
}