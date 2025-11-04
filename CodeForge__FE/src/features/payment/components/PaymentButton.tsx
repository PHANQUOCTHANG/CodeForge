// src/features/payment/PaymentButton.tsx
import React, { useState } from "react";
import { Button, Spin, message } from "antd";
import "./payment.scss";
import { paymentApi } from "@/features/payment/services/paymentService";

interface PaymentButtonProps {
  courseId: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ courseId }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const res = await paymentApi.createVnpayPayment(courseId);
      const { paymentUrl } = res.data;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        message.error("Không tạo được liên kết thanh toán.");
      }
    } catch {
      message.error("Không thể khởi tạo thanh toán. Vui lòng thử lại sau!");
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
      {loading ? <Spin /> : "Mua"}
    </Button>
  );
};

export default PaymentButton;
