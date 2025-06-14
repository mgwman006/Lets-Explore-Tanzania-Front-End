import { Avatar, Flex, List, Image, Row, Col, Typography } from "antd";

const projectsList = [
    {
        title: 'Smart Contracts',
        description:'We are automating the rental process by reducing paper work and improving efficiency',
        imagePath:'contracticonumage.jpg'
    },
    {
        title: 'Lets Explore Tanzania',
        description:'Its a partnership agreement with Lets Explore Tanzania, its a tour operator entity in tanzania. We responsibility is to apply modern technologies for improving tourism experience in Tanzania',
        imagePath:'letsexp.jpeg'
    }
];
export default function Projects()
{
    return (
        <Row justify={"center"}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12} style={{padding:'20px'}}>
                <List
                    bordered
                    header={<Typography.Title level={4}>List of Projects</Typography.Title>}
                    dataSource={projectsList}
                    renderItem={(item) => (
                        <List.Item
                            key={item.title}
                            extra={
                            <Image
                                width='25%'
                                alt="logo"
                                src={item.imagePath}
                            />
                            }
                        >
                            <List.Item.Meta
                            title={item.title}
                            description={item.description}
                            />
                            {/* {item.content} */}
                        </List.Item>
                    )}
                />
            </Col>
            

            
        </Row>

    );
}