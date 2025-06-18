import path from "path";
import Home from "./components/Home";
import HomePage from "./components/HomePage";
import Projects from "./components/Projects";
import AddTour from "./components/admin/AddTour";
import AdminHome from "./components/admin/AdminHome";
import AdminTours from "./components/admin/AdminTours";
import AdminWelcomePage from "./components/admin/AdminWelcomePage";
import TourDashboard from "./components/admin/TourDashboard";
import TourDetails from "./components/admin/TourDetails";

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
      }
    ]
  },
  {
    path: "admin",
    Component: AdminHome,
    children: [
      {
        path:"",
        Component:AdminWelcomePage
      },
      {
        path:"tours",
        Component: TourDashboard,
        children:[
          {
            path:"",
            Component:AdminTours,

          },
          {
            path:"addtour",
            Component:AddTour
          },
          {
             path:"tourdetails",
             Component:TourDetails
          }
        ]
      }
      
    ]
  }
];

export default routes;
