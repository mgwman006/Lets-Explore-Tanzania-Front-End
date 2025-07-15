import React from 'react';
import { Carousel } from 'antd';
import { Col, Row } from 'antd';
import { Card,Flex, Splitter, Typography } from 'antd';
import ReactPlayer from 'react-player';
import { isMobile } from 'react-device-detect';
// import { data } from 'react-router-dom'; // Removed because it's not used and causes conflict

export default function ZanzibarPage() {

const contentStyle: React.CSSProperties = {
  height: '500px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};
  const videoStyle: React.CSSProperties = {
    width: '100%',
    height: '500px',
    objectFit: 'cover',
  };

  return (
    <React.Fragment>
      <div>
        <div className="player-Wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
          <video controls style={videoStyle} className="video-player" autoPlay loop muted>
            <source src="zanzibar11.mp4" type="video/mp4" />
          </video>
        </div>
        <h1
          className="text-4xl font-bold mb-4"
          style={{ textAlign: "center", fontSize: "180%", fontFamily: 'Droid Sans' }}
        >
          BEACHES| VIBRANT CULTURE | SKYDIVE | JETSKI | SNORKELING | DIVING | KITE SURFING
        </h1>

        <div style={{ textAlign: "center", fontFamily: 'Droid Sans' }}>
          <h1 className="text-2xl font-semibold mt-8 mb-4"
          >ZANZIBAR: THE ULTIMATE BEAUTY OF NATURE</h1>
          <p style={{ textAlign: "center", fontFamily: 'Matura MT Script Capitals', fontSize: '180%'}}>
            Dance with the waves, move with the sea.Let the rhythm of the water set your soul free..
          </p>
        </div>
        <div>
          <p>
            Zanzibar is a popular tourist destination known for its beautiful beaches, vibrant culture, and rich history.It offers a mix of relaxation, adventure, and cultural experiences, attracting a diverse range of travelers.
            Tourism is a significant part of Zanzibar's economy, contributing substantially to its GDP and foreign exchange earnings.The island is famous for its stunning beaches, crystal-clear waters,
            and coral reefs,making it a paradise for beach lovers and water sports enthusiasts.</p>
          <p>
            Zanzibar boasts stunning white-sand beaches and crystal-clear turquoise waters, perfect for swimming, sunbathing, and water sport
            activities like snorkeling, diving, and kite surfing. The beaches are lined with palm trees and offer a serene atmosphere for relaxation
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Row>

            <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
              <img src="culture.jpg" alt="Zanzibar" style={{ width: '70%', height: '280px' }} />
              <p className="text-lg text-gray-700" style={{ margin:0,textAlign: 'left' }}>
                Zanzibar has a rich and complex history shaped by trade,colonization, and revolution.
                Initially inhabited for over 20,000 years, it became a crucial trading hub for various groups,
                including Arabs, Persians, and Europeans. The island experienced periods of Portuguese and Omani rule,
                eventually becoming a British protectorate before gaining independence and uniting with Tanganyika to form Tanzania</p>
            </Col>

            <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
              <img src="jetski.jpg" alt="Zanzibar" style={{ width: '70%', height: '280px' }} />
              <p className="text-lg text-gray-700">
                The most popular outdoor adventure and fun of beach games is jetski,Kendwa beach is the best beach
                for jet ski experience due to its reputation of being most beautiful white sand beach with crystal clear turquoise water
                and less boat traffic. This provides the best space for jet riding.</p>
            </Col>

            <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
              <img src="zanz01.jpg" alt="Zanzibar" style={{ width: '70%', height: '280px' }} />
              <p className="text-lg text-gray-700">
                Zanzibar's cuisine is a vibrant mix of African, Arabic, Indian, and Portuguese influences,
                creating a unique culinary experience. Popular dishes include seafood, biryani, pilau, and Zanzibar pizza,
                often featuring spices like cloves, cardamom, and cinnamon, and fresh ingredients like coconut, cassava, and tropical fruits</p>
            </Col>

          </Row>
          
        </div>
       

          <h3 style={{ textAlign: "center", fontFamily: 'Matura MT Script Capitals', fontSize: '230%' }}>Explore More on Zanzibar</h3>
          {
            isMobile ? (
              <div>
          {/* <Row>
            <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', 
                marginBottom: 24, background: '#f9fafb', borderRadius: 12, boxShadow: '0 2px 8px #0001' }}>
                <img src="culture1.jpg"
                  alt="Zanzibar Culture"
                  style={{ display: 'block', width: '40%', height: '15%', alignItems: 'left' }} />
              </div>
            </Col>

            <Col  xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
              <div style={{ padding: 16, textAlign: 'left' }}>
                <strong>“A place for people of different culture”</strong>
                <p>
                  The most popular beaches include Nungwi, Kendwa, Paje, and Jambiani, each offering unique experiences and stunning natural beauty.
                  Zanzibar's beaches are not just about relaxation; they also offer a range of activities such as snorkeling, diving, and kite surfing.
                  The coral reefs surrounding the island are home to diverse marine life, making it a popular spot for underwater exploration.
                </p>
              </div>
            </Col>
          </Row>

        <Row>
          <Col span={18} push={5} xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', 
              marginBottom: 24, background: '#f9fafb', borderRadius: 12, boxShadow: '0 2px 8px #0001' }}>
              <img
                alt="avatar"
                src="jetski.jpg"
                style={{ display: 'block', width: '50%', height:'50%' }}
              />
            </div>
          </Col>
          <Col span={7} pull={10} xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
            <div style={{ padding: 16, textAlign: 'right' }}>
              <strong>“Zanzibar: A Paradise for Water Sports Enthusiasts”</strong>
              <p>
                The most popular beaches include Nungwi, Kendwa, Paje, and Jambiani, each offering unique experiences and stunning natural beauty.
                Zanzibar's beaches are not just about relaxation; they also offer a range of activities such as snorkeling, diving, and kite surfing.
                The coral reefs surrounding the island are home to diverse marine life, making it a popular spot for underwater exploration.
              </p>
            </div>
          </Col>
        </Row> */}
        </div>
            ) : (
            <div>
          <Row>
            <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', 
                marginBottom: 24, background: '#f9fafb', borderRadius: 12, boxShadow: '0 2px 8px #0001' }}>
                <img src="culture1.jpg"
                  alt="Zanzibar Culture"
                  style={{ display: 'block', width: '40%', height: '15%', alignItems: 'left' }} />
              </div>
            </Col>

            <Col  xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
              <div style={{ padding: 16, textAlign: 'left' }}>
                <strong>“A place for people of different culture”</strong>
                <p>
                  The most popular beaches include Nungwi, Kendwa, Paje, and Jambiani, each offering unique experiences and stunning natural beauty.
                  Zanzibar's beaches are not just about relaxation; they also offer a range of activities such as snorkeling, diving, and kite surfing.
                  The coral reefs surrounding the island are home to diverse marine life, making it a popular spot for underwater exploration.
                </p>
              </div>
            </Col>
          </Row>

        <Row>
          <Col span={18} push={5} xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', 
              marginBottom: 24, background: '#f9fafb', borderRadius: 12, boxShadow: '0 2px 8px #0001' }}>
              <img
                alt="avatar"
                src="jetski.jpg"
                style={{ display: 'block', width: '50%', height:'50%' }}
              />
            </div>
          </Col>
          <Col span={6} pull={7} xs={24} sm={8} md={8} lg={8} xl={8} xxl={8}>
            <div style={{ padding: 16, textAlign: 'right' }}>
              <strong>“Zanzibar: A Paradise for Water Sports Enthusiasts”</strong>
              <p>
                The most popular beaches include Nungwi, Kendwa, Paje, and Jambiani, each offering unique experiences and stunning natural beauty.
                Zanzibar's beaches are not just about relaxation; they also offer a range of activities such as snorkeling, diving, and kite surfing.
                The coral reefs surrounding the island are home to diverse marine life, making it a popular spot for underwater exploration.
              </p>
            </div>
          </Col>
        </Row>
        </div>
            )
                    }
        

<div>
  <Carousel autoplay autoplaySpeed={5000}>
    <div>
      <h3 style={contentStyle}>
         <img src="beach.jpg" alt="Nungwi Beach" style={{ width: '100%', height: 500, objectFit: 'cover' }} />
          <div style={{ padding: 16 }}>
          <strong>Nungwi Beach</strong>
          <p style={{ margin: 0, fontSize: 16 }}>
            Known for its lively atmosphere, white sand, and beautiful sunsets. Great for swimming and nightlife.
          </p>
        </div>
      </h3>
    </div>
    <div>
      <h3 style={contentStyle}>
         <img src="beach3.jpg" alt="Nungwi Beach" style={{ width: '100%', height: 500, objectFit: 'cover' }} />
      </h3>
    </div>
    <div>
      <h3 style={contentStyle}>
         <img src="sunset.jpg" alt="Nungwi Beach" style={{ width: '100%', height: 500, objectFit: 'cover' }} />
      </h3>
    </div>
  </Carousel>
</div>




  <div>
    <h1 className="text-2xl font-semibold mt-8 mb-4" style={{ textAlign: "center", fontSize:'200%' }}>ZANZIBAR SAFARIS</h1>
     <p style={{ textAlign: "center", fontFamily: 'Matura MT Script Capitals', fontSize: '180%'}}>
            Only best for you..
          </p>


    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px', marginBottom: '32px' }}>
      <div style={{ width: 320, background: '#f9fafb', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px #0001' }}>
        <img src="Nungwi.jpg" alt="Nungwi Beach" style={{ width: '100%', height: 180, objectFit: 'cover' }} />
        <div style={{ padding: 16 }}>
          <strong>Nungwi Beach</strong>
          <p style={{ margin: 0, fontSize: 16 }}>
            Known for its lively atmosphere, white sand, and beautiful sunsets. Great for swimming and nightlife.
          </p>
        </div>
      </div>
      <div style={{ width: 320, background: '#f9fafb', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px #0001' }}>
        <img src="kendwa.jpg" alt="Kendwa Beach" style={{ width: '100%', height: 180, objectFit: 'cover' }} />
        <div style={{ padding: 16 }}>
          <strong>Kendwa Beach</strong>
          <p style={{ margin: 0, fontSize: 16 }}>
            Famous for its calm, clear waters and full moon parties. Ideal for relaxation and water sports.
          </p>
        </div>
      </div>
      <div style={{ width: 320, background: '#f9fafb', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px #0001' }}>
        <img src="paje.jpg" alt="Paje Beach" style={{ width: '100%', height: 180, objectFit: 'cover' }} />
        <div style={{ padding: 16 }}>
          <strong>Paje Beach</strong>
          <p style={{ margin: 0, fontSize: 16 }}>
            Popular with kite surfers and backpackers, offering a laid-back vibe and stunning turquoise waters.
          </p>
        </div>
      </div>
      <div style={{ width: 320, background: '#f9fafb', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px #0001' }}>
        <img src="Jambiani.jpg" alt="Jambiani Beach" style={{ width: '100%', height: 180, objectFit: 'cover' }} />
        <div style={{ padding: 16 }}>
          <strong>Jambiani Beach</strong>
          <p style={{ margin: 0, fontSize: 16 }}>
            A quieter, authentic fishing village beach with long stretches of sand and local culture.
          </p>
        </div>
      </div>
      <div style={{ width: 570, background: '#f9fafb', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px #0001' }}>
        <img src="Matemwe.jpg" alt="Matemwe Beach" style={{ width: 570, height: 220, objectFit: 'cover' }} />
        <div style={{ padding: 16 }}>
          <strong>Matemwe Beach</strong>
          <p style={{ margin: 0, fontSize: 16, alignContent:'right' }}>
            Known for its tranquility, palm trees, and proximity to Mnemba Atoll for snorkeling and diving.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
    </React.Fragment>
  );
}

