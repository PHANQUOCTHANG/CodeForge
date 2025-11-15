// src/features/payment/PaymentReturn.tsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spin } from "antd";
import "./payment.scss";

/**
 * Trang này KHÔNG hiển thị lâu.
 * Đây là `ReturnUrl` mà VNPay chuyển hướng người dùng về.
 * Nhiệm vụ của nó là đọc URL, xem người dùng "thành công" hay "hủy",
 * và chuyển hướng đến trang xử lý tương ứng.
 */
const PaymentReturn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy các tham số quan trọng từ VNPay
    const responseCode = searchParams.get("vnp_ResponseCode");
    // vnp_TxnRef chính là `paymentId` (hoặc `orderId`) của bạn
    const paymentId = searchParams.get("vnp_TxnRef");

    if (!paymentId) {
      // Nếu VNPay trả về mà không có mã giao dịch, coi như lỗi
      navigate("/payment-result?status=Failed");
      return;
    } // Phân loại dựa trên mã phản hồi của VNPay

    switch (responseCode) {
      case "00": // THÀNH CÔNG (từ phía VNPay) // => Chuyển sang trang "Processing" để chờ backend xác minh IPN
        navigate(`/payment-processing?paymentId=${paymentId}`);
        break;

      case "24": // KHÁCH HÀNG HỦY (nhấn nút Hủy)
        navigate("/payment-result?status=Cancelled");
        break;

      default: // Tất cả các lỗi khác (hết hạn, sai thẻ, v.v.)
        navigate("/payment-result?status=Failed");
        break;
    }
  }, [searchParams, navigate]); // Chỉ chạy 1 lần khi trang tải

  return (
    // Giao diện loading đẹp mắt trong 1-2s chờ chuyển hướng
    <div className="payment-container">
      <div className="payment-box">
        <div className="vnpay-logo-spin" />
        <Spin size="large" />
        <p>Đang phân tích kết quả từ VNPay...</p>
      </div>{" "}
    </div>
  );
};

export default PaymentReturn;
