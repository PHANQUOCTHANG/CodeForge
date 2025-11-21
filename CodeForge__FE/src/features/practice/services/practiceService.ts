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

  getAllProblem: async () => {
    try {
<<<<<<< HEAD
      const res = await api.get("api/problems");
=======
      const res = await api.get("/problems");
>>>>>>> 4267c93ffa34cc360cdb6298ed97d499bdd02553
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
<<<<<<< HEAD
      const res = await api.get(`api/problems/${slug}`);
=======
      const res = await api.get(`/problems/${slug}`);
>>>>>>> 4267c93ffa34cc360cdb6298ed97d499bdd02553
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getTestCaseOfProblem: async (problemId: string) => {
    try {
<<<<<<< HEAD
      const res = await api.get(`api/testcases/${problemId}`);
=======
      const res = await api.get(`/testcases/${problemId}`);
>>>>>>> 4267c93ffa34cc360cdb6298ed97d499bdd02553
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  runTest: async (data: any) => {
    try {
<<<<<<< HEAD
      const res = await api.post(`api/problems/run-problem`, data);
=======
      const res = await api.post(`/problems/run-problem`, data);
>>>>>>> 4267c93ffa34cc360cdb6298ed97d499bdd02553
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  submitProblem: async (data: any) => {
    try {
<<<<<<< HEAD
      const res = await api.post(`api/problems/submit`, data);
=======
      const res = await api.post(`/problems/submit`, data);
>>>>>>> 4267c93ffa34cc360cdb6298ed97d499bdd02553
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

<<<<<<< HEAD
  getSubmissionsById: async (
    problemId: string | null,
    userId: string | null
  ) => {
    try {
      const res = await api.get(`api/submissions/${problemId}/${userId}`);
=======
  getSubmissionsById: async (problemId: string, userId: string) => {
    try {
      const res = await api.get(`/submissions/${problemId}/${userId}`);
>>>>>>> 4267c93ffa34cc360cdb6298ed97d499bdd02553
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
<<<<<<< HEAD

  // getAllLesson: async () => {
  //   try {
  //     const res = await api.get("/lessons");
  //     return res.data.data; // chỉ trả về phần cần dùng
  //   } catch (error: any) {
  //     console.error("Lỗi khi gọi API /api/problems:", error.message);
  //     throw error;
  //   }
  // }
=======
>>>>>>> 4267c93ffa34cc360cdb6298ed97d499bdd02553
};

export default practiceService;
