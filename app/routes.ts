import ToursPage from "./components/ToursPage";
import Home from "./components/Home";
import HomePage from "./components/HomePage";
import TourDetails from "./components/TourDetails";
import ToursList from "./components/ToursList";
import Zanzibarpage from "./components/Zanzibarpage";
import { Component } from "react";
import BookingPage from "./components/BookingPage";

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
      }
    ]
  }
 
];

export default routes;
