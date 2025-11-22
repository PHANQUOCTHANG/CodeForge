// src/shared/lib/react-query/index.ts
import { QueryClient } from "@tanstack/react-query";
import { message } from "antd";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry 1 lần khi lỗi
      refetchOnWindowFocus: false, // Không tự refetch khi focus lại tab
      staleTime: 5 * 60 * 1000, // cache trong 5 phút
      gcTime: 10 * 60 * 1000, // giữ data trong bộ nhớ 10 phút
      onError: (error: any) => {
        message.error(error?.message || "Lỗi tải dữ liệu!");
      },
    },
    mutations: {
      onError: (error: any) => {
        message.error(error?.message || "Lỗi xử lý yêu cầu!");
      },
    },
  },
});
