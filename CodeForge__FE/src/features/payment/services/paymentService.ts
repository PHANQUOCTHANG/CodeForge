import api from "@/api/axios";

export const paymentApi = {
  createVnpayPayment: async (courseId: string) => {
    const res = await api.post("/enrollments/enroll", { courseId });
    return res.data; // { paymentUrl: string, paymentId: string }
  },
  checkPaymentStatus: async (paymentId: string) => {
    const res = await api.get(`/payments/status/${paymentId}`);
    return res.data; // { status: "Pending" | "Success" | "Failed" | "Cancelled" | "Expired" }
  },
};
