// src/features/payment/PaymentProcessing.tsx
import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spin } from "antd";
import "./payment.scss";
import { paymentApi } from "@/features/payment/services/paymentService";

const POLLING_INTERVAL = 3000; // 3 giây
const MAX_ATTEMPTS = 10; // 10 lần x 3s = 30 giây timeout

/**
 * Trang này là "phòng chờ" xác minh.
 * Nó liên tục gọi API backend để kiểm tra xem webhook IPN đã
 * cập nhật trạng thái thanh toán trong DB hay chưa.
 */
const PaymentProcessing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentId = searchParams.get("paymentId");

  // Dùng useRef để lưu ID của interval
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  // Dùng useRef để đếm số lần thử (để tránh stale closure)
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!paymentId) {
      navigate("/courses"); // Nếu lạc vào đây mà không có ID, về trang khóa học
      return;
    }

    // Định nghĩa hàm kiểm tra trạng thái
    const checkStatus = async () => {
      attemptsRef.current += 1; // Tăng số lần thử

      // 1. KIỂM TRA TIMEOUT
      if (attemptsRef.current > MAX_ATTEMPTS) {
        if (intervalIdRef.current) clearInterval(intervalIdRef.current);
        navigate("/payment-result?status=Expired"); // Chờ lâu quá -> Hết hạn
        return;
      }

      // 2. GỌI API BACKEND
      try {
        // Giả sử API trả về { status: "Succeeded" | "Failed" | "Pending" }
        const res = await paymentApi.checkPaymentStatus(paymentId);
        const status = res.data.status; // (Hoặc res.data.status, tùy API của bạn)
        console.log(res);
        if (status && status !== "Pending") {
          // Đã có kết quả (Succeeded hoặc Failed)
          if (intervalIdRef.current) clearInterval(intervalIdRef.current);

          // Map trạng thái backend (Succeeded) sang trạng thái frontend (Success)
          const resultStatus = status === "Succeeded" ? "Success" : "Failed";
          navigate(`/payment-result?status=${resultStatus}`);
        }
        // Nếu status vẫn là "Pending", không làm gì, interval sẽ gọi lại
      } catch (error) {
        // Lỗi khi gọi API (500, 404...)
        console.error("Lỗi kiểm tra trạng thái thanh toán:", error);
        if (intervalIdRef.current) clearInterval(intervalIdRef.current);
        navigate("/payment-result?status=Error"); // Lỗi hệ thống
      }
    };

    // 3. GỌI NGAY LẬP TỨC (không chờ 3s đầu tiên)
    checkStatus();

    // 4. BẮT ĐẦU POLLING
    intervalIdRef.current = setInterval(checkStatus, POLLING_INTERVAL);

    // 5. HÀM DỌN DẸP (Cleanup)
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, [paymentId, navigate]); // Chỉ chạy lại nếu paymentId hoặc navigate thay đổi

  // ...
  return (
    // 1. Đổi tên class cha
    <div className="payment-processing">
      <div className="payment-processing__box">
        {/* 2. Đổi tên class logo */}
        <div className="payment-processing__logo" />
        <Spin size="large" />
        {/* 3. Thêm class cho text */}
        <p className="payment-processing__text">
          Đang xác minh giao dịch của bạn...
        </p>
        {/* 4. Đổi tên class note */}
        <p className="payment-processing__note">
          Vui lòng không đóng trang này...
        </p>
      </div>
    </div>
  );
  // ...
};

export default PaymentProcessing;
