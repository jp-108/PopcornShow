import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home/Home";
import App from "./App";
import DetailsPage from "./pages/detailsPage/DetailsPage";
import Skelton from "./components/skelton/Skelton";
import ExplorePage from "./pages/explore/ExplorePage";
import ResultPage from "./pages/searchResult/ResultPage";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children:[
        {
            path:"/",
            element:<Home />
        },
        {
            path:"/:mediaType/:id",
            element:<DetailsPage />
        },
        {
            path:"/skelton",
            element:<Skelton />
        },
        {
            path:"/discover/:mediaType",
            element:<ExplorePage />
        },
        {
            path:"/search/:query",
            element:<ResultPage />
        }
      ]
    },
  ]);

export default router;