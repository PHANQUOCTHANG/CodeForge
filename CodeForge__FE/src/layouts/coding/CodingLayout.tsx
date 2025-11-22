import { Outlet } from "react-router-dom";

const CodingLayout = () => {
  return (
    <>
      <div style={{ minHeight: "100vh" }}>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
};
export default CodingLayout;
