import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Suspense } from "react";
import { Spin } from "antd";

const ClientLayout = () => {
  return (
    <>
      <div style={{ minHeight: "100vh" }}>
        <Header />
        <main>
          <Suspense
            fallback={<Spin spinning fullscreen tip="Đang tải ứng dụng..." />}
          >
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
};
export default ClientLayout;
