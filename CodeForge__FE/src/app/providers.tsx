import React, { Suspense } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { Spin } from "antd";
import { router } from "./routes/router";
import { queryClient } from "@/shared/lib/react-query";

// ✅ Gom các provider
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ReduxProvider>
);

// ✅ App gốc (App.tsx không còn cần thiết)
export const AppWithRouter = () => (
  <AppProviders>
    <Suspense
      fallback={<Spin spinning fullscreen tip="Đang tải ứng dụng..." />}
    >
      <RouterProvider router={router} />
    </Suspense>
  </AppProviders>
);
