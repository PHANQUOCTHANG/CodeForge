import { useRoutes } from "react-router-dom";
import HomePage from "../pages/client/Home/HomePage";

const AdminRouters = () => {
  const routers = useRoutes([
    {
      path: "/admin",
      element: <HomePage />,
    },
  ]);

  return routers;
};

export default AdminRouters;
