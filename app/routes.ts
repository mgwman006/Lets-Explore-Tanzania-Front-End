import ToursPage from "./components/ToursPage";
import Home from "./components/Home";
import HomePage from "./components/HomePage";
import TourDetails from "./components/TourDetails";
import ToursList from "./components/ToursList";

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
          }
        ]
      }
    ]
  }
];

export default routes;
