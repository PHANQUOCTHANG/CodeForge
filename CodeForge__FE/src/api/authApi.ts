import api from "./axios";
const authApi = {
  login: async (email: string, passwordHash: string) => {
    try {
      const res = await api.post("/login", {
        email,
        passwordHash,
      });

      const { access_token, refresh_token } = res.data;
      if (access_token) localStorage.setItem("access_token", access_token);
      if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
      return res;
    } catch (error: any) {
      throw new Error(error.response?.data || error.message);
    }
  },
};

export default authApi;
