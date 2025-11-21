// src/features/payment/PaymentButton.tsx
import React, { useState } from "react";
import { Button, Spin, message } from "antd";
import "./payment.scss";
import { paymentApi } from "@/features/payment/services/paymentService";
import { openNotification } from "@/common/helper/notification";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/app/store/store";
interface PaymentButtonProps {
  courseId: string;
  title: string;
  method: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  courseId,
  title = "Mua",
  method = "payment",
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      openNotification("warning", "Cảnh báo", "Bạn chưa đăng nhập");
      return;
    }
    try {
      setLoading(true);
      const res = await paymentApi.getEnollment(courseId);
      if (method === "payment") {
        const { paymentUrl } = res.data;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          message.error("Không tạo được liên kết thanh toán.");
        }
      } else {
        const { course } = res.data;
        if (course) {
          openNotification(
            "success",
            "Thành công",
            "Đăng ký khóa học thành công"
          );
          // 🧩 Cập nhật cache ngay
          queryClient.setQueryData(["course", course.slug], (old: any) => ({
            ...old,
            isEnrolled: true,
          }));

          // 🧩 Refetch lại data từ server
          queryClient.invalidateQueries(["course", course.slug]);
        } else {
          openNotification(
            "error",
            "Thất bại",
            "Đăng ký khóa học không thành công"
          );
        }
      }
    } catch {
      message.error("Không thể Đăng ký khóa học. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="primary"
      block
      size="large"
      className="payment-btn"
      onClick={handlePayment}
      disabled={loading}
    >
      {loading ? <Spin /> : title}
    </Button>
  );
};

export default PaymentButton;
