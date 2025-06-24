import { Card, List, Select, Typography } from "antd";
import { EnvironmentOutlined, MoneyCollectFilled, MoneyCollectOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect";

const { Title, Paragraph, Text, Link } = Typography;

export default function FilteredToursPage() {

 // get data from the state passed from HomePage
  const location = useLocation();
  const [tours, setTours] = useState<PrivateTourListItemDto[]>(location.state?.tours || []);
  const [filteredTours, setFilteredTours] = useState<PrivateTourListItemDto[]>(location.state?.filteredTours || []);
  const [destinations, setDestinations] = useState<string[]>(location.state?.destinations || []);

  const handleDestinationFilter = (value: string) => {
    if (value) {
      const filtered : PrivateTourListItemDto[] = tours.filter(tour => tour.destinations.includes(value));
      setFilteredTours(filtered);
    }
    else {
      setFilteredTours(tours); // Reset to all tours if no filter is applied
    }
  }

  
  return (
    <div>
      <h1>Filtered Tours</h1>
     
      
      <List
        header={
           <Select
              showSearch
              prefix={<EnvironmentOutlined />}
              size="large"
              placeholder="Where To"
              onChange={(value) => handleDestinationFilter(value)}
              options={destinations.map(dest => ({ value: dest, label: dest }))}
            />
        }
        style={{ backgroundColor: '', padding: '10px' }}
        // bordered
        grid={{ gutter: 16, column: isMobile ? 1 : 4 }}
        itemLayout="horizontal"
        dataSource={filteredTours}
        renderItem={tour => (
          <List.Item>
            <Card style={{ width: '100%' }}
              cover={
                <img
                  alt="tour"
                  src={tour.bannerImageUrl || 'https://via.placeholder.com/150'}
                  style={{ height: '200px', objectFit: 'cover' }}
                />}
            >
              
                  <Typography>
                      <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>{tour.title}</Text>
                      <br />   
                      {
                        tour.tourPrice && tour.tourPrice.length === 0 ? (
                          <Text type="warning"><MoneyCollectOutlined /> No Price Available</Text>
                        ) :
                        tour.tourPrice.length > 1 ? (
                          <Text 
                              type="warning"
                              style={{ fontSize: '16px', fontWeight: 'bold' }}
                            
                          >
                            <MoneyCollectOutlined /> {tour.tourPrice[0]?.pricePerPerson} to {tour.tourPrice[tour.tourPrice.length - 1]?.pricePerPerson} {tour.tourPrice[0]?.currency.code}
                          </Text>
                        ) : (
                          <Text style={{ fontSize: '16px', fontWeight: 'bold' }} type="warning"><MoneyCollectOutlined /> {tour.tourPrice[0]?.pricePerPerson} {tour.tourPrice[0]?.currency.code}</Text>
                        )
                       }
                          <br />
                      <Text 
                        type="success"
                      > 
                        <EnvironmentOutlined /> {tour.destinations.join(', ')}
                      </Text>
                  </Typography>
              
              
              
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}