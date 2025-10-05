import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Gắn access token vào request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý response (refresh token nếu 401)
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Nếu token hết hạn và chưa retry → gọi refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const res = await axios.post("https://api.example.com/auth/refresh", {
            refresh_token: refreshToken,
          });
          const newAccessToken = res.data.access_token;

          // Lưu lại token mới
          localStorage.setItem("access_token", newAccessToken);

          // Update header và gọi lại request cũ
          api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        console.error("Refresh token thất bại, logout..." + err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // chuyển về trang login
      }
    }

    return Promise.reject(error);
  }
);

export default api;
