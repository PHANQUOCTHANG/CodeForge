import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";

const ClientLayout = () => {
  return (
    <>
      <div style={{ minHeight: "100vh" }}>
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
};
export default ClientLayout;
