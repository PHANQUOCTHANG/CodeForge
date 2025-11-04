import api from "./axios";

const problemApi = {
  getAllProblem: async () => {
    try {
      const res = await api.get("/problems");
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getProblemBySlug: async (slug: string) => {
    try {
      const res = await api.get(`/problems/${slug}`);
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default problemApi;
