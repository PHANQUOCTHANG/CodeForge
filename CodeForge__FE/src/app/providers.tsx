import React, { Suspense } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { Spin } from "antd";
import { router } from "./routes/router";
import { useInitAuth } from "@/features/auth/hooks/useInitAuth";
import { useAppSelector } from "@/app/store/store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

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
