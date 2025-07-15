import ToursPage from "./components/ToursPage";
import Home from "./components/Home";
import HomePage from "./components/HomePage";
import TourDetails from "./components/TourDetails";
import ToursList from "./components/ToursList";
import Zanzibarpage from "./components/Zanzibarpage";

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
        path:"projects",
        Component: Projects
      },
      {
        path:"zanzibar",
        Component: Zanzibarpage
      }
    ]
  },
  {
    path: "/admin",
    Component: AdminHome,
    children: [
      {
        path:"",
        Component:AdminWelcomePage
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
