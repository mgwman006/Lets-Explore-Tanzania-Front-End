import ToursPage from "./components/ToursPage";
import Home from "./components/Home";
import HomePage from "./components/HomePage";
import TourDetails from "./components/TourDetails";
import ToursList from "./components/ToursList";
import Zanzibarpage from "./components/Zanzibarpage";
import { Children, Component } from "react";
import BookingPage from "./components/booking/BookingPage";
import PayPal from "./components/payment/PayPal";
import PaymentSuccess from "./components/payment/PaymentSuccess";
import PaymentPage from "./components/payment/PaymentPage";


const routes = [
  {
    path: "/",
    Component: Home,
    children: [
      {
        path:"",
        Component: HomePage
      },
      {
        path:"zanzibar",
        Component: Zanzibarpage
      },
      {
        path:"tours",
        Component: ToursPage,
        children:[
          {
            path:"",
            Component: ToursList,
          },
          {
            path:":tourId",
            Component:TourDetails
          },
          {
            path:"booking",
            Component:BookingPage
          }
        ]
      },
      {
        path:"pay",
        Component: PaymentPage,
        children:[
          {
            path:"",
            Component: PayPal
          },
          {
            path:"success",
            Component: PaymentSuccess
          }
        ]
      }
    ]
  }
 
];

export default routes;
