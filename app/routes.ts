import Home from "./components/Home";
import LogIn from "./components/LogIn";
import RegisterLandLord from "./components/RegisterLandLord";
import LandLordPage from "./components/LandLordPage";
import HomePage from "./components/HomePage";
import Projects from "./components/Projects";

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
    path: "login",
    Component: LogIn,
  },
  {
    path: "registerlandlord",
    Component: RegisterLandLord
  },
  {
    path: "landlord/:landlordId",
    Component: LandLordPage
  }
];

export default routes;
