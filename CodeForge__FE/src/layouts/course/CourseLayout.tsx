import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import { Spin } from "antd";
import { Suspense } from "react";

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
      </div>
    </>
  );
};
export default ClientLayout;
