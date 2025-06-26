import FilteredToursPage from "./components/FilteredToursPage";
import Home from "./components/Home";
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
      },
      {
        path:"filteredtours",
        Component: FilteredToursPage
      }
    ]
  }
];

export default routes;
