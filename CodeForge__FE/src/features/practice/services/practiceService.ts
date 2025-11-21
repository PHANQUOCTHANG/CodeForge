import api from "@/api/axios";

function parseValueByType(value, type) {
  if (value === undefined || value === null) return null;

  switch (type) {
    case "int":
    case "float":
    case "double":
      const num = Number(value);
      return isNaN(num) ? value : num;

    case "bool":
      if (value === "true" || value === true) return true;
      if (value === "false" || value === false) return false;
      return Boolean(value);

    case "string":
      return String(value);

    case "vector<int>":
      return value
        .replace(/[\[\]]/g, "")
        .split(",")
        .map((v) => Number(v.trim()));

    case "vector<string>":
      return value
        .replace(/[\[\]"]/g, "")
        .split(",")
        .map((v) => v.trim());

    case "vector<vector<int>>":
      // ví dụ "[[1,2],[3,4]]"
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }

    case "array":
    case "object":
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }

    default:
      return value;
  }
}

function convertInputArrayToObject(inputArray) {
  if (!Array.isArray(inputArray)) return {};

  return inputArray.reduce((acc, item) => {
    if (!item.name) return acc;
    acc[item.name] = parseValueByType(item.value, item.type);
    return acc;
  }, {});
}

const practiceService = {
  createProblem: async (data: any) => {
    try {
      const res = await api.post("api/problems/create", data);
      return res.data.data; // chỉ trả về phần cần dùng
    } catch (error: any) {
      console.error("❌ Chi tiết lỗi backend:", error.response?.data);
      throw error;
    }
  },

  updateProblem: async (problemId: string, data: any) => {
    try {
      const res = await api.patch(`api/problems/update/${problemId}`, data);
      return res.data.data; // chỉ trả về phần cần dùng
    } catch (error: any) {
      console.error("❌ Chi tiết lỗi backend:", error.response?.data);
      throw error;
    }
  },

  getAllProblem: async () => {
    try {
      const res = await api.get("api/problems");
      return res.data.data; // chỉ trả về phần cần dùng
    } catch (error: any) {
      console.error("Lỗi khi gọi API /api/problems:", error.message);
      throw error;
    }
  },

  deleteProblem: async (problemId: string) => {
    try {
      const res = await api.delete(`api/problems/${problemId}`);
      return res.data;
    } catch (error: any) {
      console.error(
        "Lỗi khi xóa problem:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getProblemBySlug: async (slug: string) => {
    try {
      const res = await api.get(`api/problems/${slug}`);
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  createTestCase: async (data: any) => {
    data = data.map((item) => {
      const converted = convertInputArrayToObject(item.input);
      return {
        ...item,
        // Backend expects Input as JSON string (CreateTestCaseDto.Input is string)
        input: JSON.stringify(converted),
      };
    });
    console.log("Data after edit:", data);
    try {
      const res = await api.post("api/testcases/createMany", data);
      return res.data.data; // chỉ trả về phần cần dùng
    } catch (error: any) {
      console.error("❌ Chi tiết lỗi backend:", error.response?.data);
      throw error;
    }
  },

  updateTestCase: async (testCaseId: string, data: any) => {
    try {
      const converted = convertInputArrayToObject(data.input);
      const payload = {
        testCaseId,
        input: JSON.stringify(converted),
        expectedOutput: data.expectedOutput,
        isHidden: data.isHidden,
        explain: data.explain || "",
      };
      const res = await api.patch(`api/testcases`, payload);
      return res.data.data;
    } catch (error: any) {
      console.error("❌ Lỗi khi update test case:", error.response?.data);
      throw error;
    }
  },

  deleteTestCase: async (testCaseId: string) => {
    try {
      const res = await api.delete(`api/testcases/${testCaseId}`);
      return res.data;
    } catch (error: any) {
      console.error("❌ Lỗi khi xóa test case:", error.response?.data);
      throw error;
    }
  },

  getTestCaseOfProblem: async (problemId: string, isHidden: boolean | null) => {
    try {
      let url = `api/testcases/${problemId}`;
      if (isHidden) url = `${url}?isHidden=${isHidden}`;
      const res = await api.get(url);
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  runTest: async (data: any) => {
    try {
      const res = await api.post(`api/problems/run-problem`, data);
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  submitProblem: async (data: any) => {
    try {
      const res = await api.post(`api/problems/submit`, data);
      console.log(res.data) ;
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getSubmissionsById: async (
    problemId: string | null,
    userId: string | null
  ) => {
    try {
      const res = await api.get(`api/submissions/${problemId}/${userId}`);
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getAllSubmission: async () => {
    try {
      const res = await api.get("api/submissions");
      return res.data.data; // chỉ trả về phần cần dùng
    } catch (error: any) {
      console.error("Lỗi khi gọi API /api/submissions:", error.message);
      throw error;
    }
  },

  getSubmissionById: async (submissionId: string) => {
    try {
      const res = await api.get(`api/submissions/${submissionId}`);
      return res.data.data;
    } catch (error: any) {
      console.error("Lỗi khi gọi API /api/submissions/:id:", error.message);
      throw error;
    }
  },

  getUserById: async (userId: string) => {
    try {
      const res = await api.get(`api/user/${userId}`);
      return res.data.data; // chỉ trả về phần cần dùng
    } catch (error: any) {
      console.error("Lỗi khi gọi API /api/user:", error.message);
      throw error;
    }
  },

  getProblemById: async (problemId: string) => {
    try {
      const res = await api.get(`api/problems/${problemId}`);
      return res.data.data;
    } catch (error: any) {
      console.error("Lỗi khi gọi API /api/problems/:id:", error.message);
      throw error;
    }
  },
};

export default practiceService;
