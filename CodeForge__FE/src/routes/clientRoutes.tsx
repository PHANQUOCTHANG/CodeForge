import { useRoutes } from "react-router-dom";
import HomePage from "../pages/client/Home/HomePage";
import DefaultLayout from "../layouts/client/defaultLayout";
import PracticePage from "../pages/client/Practice/PracticePage";
import NotFoundPage from "../pages/NotFound/NotFound";

const ClientRouters = () => {
  const routers = useRoutes([
    {
      path: "/",
      element: <DefaultLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "courses", element: <HomePage /> },
        { path: "practice", element: <PracticePage /> },
        { path: "contact", element: <HomePage /> },
      ],
    },

    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return routers;
};

export default ClientRouters;
