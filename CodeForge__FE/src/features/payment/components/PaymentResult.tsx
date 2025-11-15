// src/features/payment/PaymentResult.tsx
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Result, Button } from "antd";
import "./payment.scss";

/**
 * Trang này hiển thị kết quả CUỐI CÙNG của giao dịch
 * sau khi đã được xác minh.
 */
const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get("status"); // Lấy status từ URL

  const renderResult = () => {
    switch (status) {
      case "Success": // Được redirect từ PaymentProcessing
        return (
          <Result
            status="success"
            title="Thanh toán thành công 🎉"
            subTitle="Cảm ơn bạn! Khóa học đã được kích hoạt."
            extra={[
              <Button type="primary" onClick={() => navigate("/my-courses")}>
                Đến khóa học của tôi
              </Button>,
            ]}
          />
        );
      case "Cancelled": // Được redirect từ PaymentReturn
        return (
          <Result
            status="warning"
            title="Bạn đã hủy thanh toán"
            subTitle="Không sao! Bạn có thể thanh toán lại khi sẵn sàng."
            extra={
              <Button onClick={() => navigate("/courses")}>
                Quay lại khóa học
              </Button>
            }
          />
        );
      case "Expired": // Được redirect từ PaymentProcessing (do timeout)
        return (
          <Result
            status="info"
            title="Giao dịch đã hết hạn"
            subTitle="Phiên thanh toán đã quá hạn. Vui lòng thực hiện lại."
            extra={
              <Button type="primary" onClick={() => navigate(-2)}>
                Thanh toán lại
              </Button>
            }
          />
        );
      case "Failed": // Được redirect từ cả 2 file
        return (
          <Result
            status="error"
            title="Thanh toán thất bại"
            subTitle="VNPay không thể xử lý giao dịch của bạn. Hãy thử lại sau."
            extra={[
              <Button onClick={() => navigate(-2)}>Thử lại</Button>,
              <Button type="primary" onClick={() => navigate("/support")}>
                Liên hệ hỗ trợ
              </Button>,
            ]}
          />
        );
      default: // "Error" hoặc bất cứ gì lạ
        return (
          <Result
            status="500"
            title="Lỗi hệ thống"
            subTitle="Có lỗi xảy ra khi xác minh thanh toán. Vui lòng thử lại sau."
            extra={<Button onClick={() => navigate("/")}>Trang chủ</Button>}
          />
        );
    }
  };

  return <div className="payment-result">{renderResult()}</div>;
};

export default PaymentResult;
