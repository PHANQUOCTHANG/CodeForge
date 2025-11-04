import api from "@/api/axios";

const practiceService = {
  getAllProblem: async () => {
    try {
      const res = await api.get("/problems");
      return res.data.data; // chỉ trả về phần cần dùng
    } catch (error: any) {
      console.error("Lỗi khi gọi API /api/problems:", error.message);
      throw error;
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

  getTestCaseOfProblem: async (problemId: string) => {
    try {
      const res = await api.get(`/testcases/${problemId}`);
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  runTest: async (data: any) => {
    try {
      const res = await api.post(`/problems/run-problem`, data);
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  submitProblem: async (data: any) => {
    try {
      const res = await api.post(`/problems/submit`, data);
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getSubmissionsById: async (problemId: string, userId: string) => {
    try {
      const res = await api.get(`/submissions/${problemId}/${userId}`);
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default practiceService;
