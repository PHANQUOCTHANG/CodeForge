// 📶 9. useOnlineStatus

// Chức năng:

// Theo dõi user đang online hay offline.

// Tác dụng:

// Hiện thông báo “Mất kết nối mạng”.

// Ẩn nút gửi form khi offline.
import { useState, useEffect } from "react";

export default function useOnlineStatus(): boolean {
  const [online, setOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return online;
}
