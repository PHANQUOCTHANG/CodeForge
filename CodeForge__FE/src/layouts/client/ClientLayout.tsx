import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

const ClientLayout = () => {
  return (
    <>
      <div style={{ minHeight: "100vh" }}>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};
export default ClientLayout;
