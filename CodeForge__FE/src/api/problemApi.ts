import api from "./axios";

const problemApi = {
  getAllProblem: async () => {
    try {
      const res = await api.get("/api/problem");
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getProblemBySlug: async (slug : string) => {
    try {
      const res = await api.get(`/api/problem/${slug}`);
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
};

export default problemApi ;
