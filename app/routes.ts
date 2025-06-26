import FilteredToursPage from "./components/FilteredToursPage";
import Home from "./components/Home";
import HomePage from "./components/HomePage";
import TourDetails from "./components/TourDetails";

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
        path:"filteredtours",
        Component: FilteredToursPage
      },
      {
        path:"tourdetails",
        Component: TourDetails
      }
    ]
  }
];

export default routes;
