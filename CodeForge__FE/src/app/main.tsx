import { createRoot } from "react-dom/client";
import "@/styles/main.scss";
import { store } from "./store/store.ts";
import { setGlobalDispatch } from "@/api/axios.ts";
import React from "react";
import { AppWithRouter } from "@/app/providers.tsx";
// Sau khi khởi tạo store
setGlobalDispatch(store.dispatch); // ✅ Lưu hàm dispatch vào biến toàn cục
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithRouter />
  </React.StrictMode>
);
