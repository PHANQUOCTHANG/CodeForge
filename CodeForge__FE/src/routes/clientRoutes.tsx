import { useRoutes } from "react-router-dom";
import HomePage from "../pages/client/Home/HomePage";

const ClentRouters = () => {
  const routers = useRoutes([
    {
      path: "/",
      element: <HomePage />,
    },
  ]);

  return routers;
};

export default ClentRouters;
