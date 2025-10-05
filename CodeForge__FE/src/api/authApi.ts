import api from "./axios";
interface LoginResponse {
  access_token: string;
  refresh_token: string;
}
const authApi = {
  login: async (username: string, password: string) => {
    const res: LoginResponse = await api.post("/auth/login", {
      username,
      password,
    });
    localStorage.setItem("access_token", res.access_token);
    localStorage.setItem("refresh_token", res.refresh_token);
    return res;
  },
};

export default authApi;
