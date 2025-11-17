import { AlertCircle, CheckCircle2 } from "lucide-react";

const QuickStats = ({problem  , validTestCasesCount}) => {
  return (
    <>
      <div className="quick-stats">
        <h3>Tổng Quan</h3>
        <div className="quick-stats__list">
          <div className="quick-stats__item">
            <span className="quick-stats__label">Tên Bài Tập:</span>
            <span className="quick-stats__value">
              {problem.title || (
                <span className="quick-stats__value--empty">Chưa có</span>
              )}
            </span>
          </div>
          <div className="quick-stats__item">
            <span className="quick-stats__label">Mô Tả:</span>
            <span className="quick-stats__value">
              {problem.description ? (
                "Có"
              ) : (
                <span className="quick-stats__value--empty">Chưa có</span>
              )}
            </span>
          </div>
          <div className="quick-stats__item">
            <span className="quick-stats__label">Tên Hàm:</span>
            <span className="quick-stats__value">
              {problem.functionName ? (
                problem.functionName
              ) : (
                <span className="quick-stats__value--empty">Chưa chọn</span>
              )}
            </span>
          </div>
          <div className="quick-stats__item">
            <span className="quick-stats__label">Thẻ:</span>
            <span className="quick-stats__value">
              {problem.tags ? problem.tags.split(",").length : 0}
            </span>
          </div>
          <div className="quick-stats__item">
            <span className="quick-stats__label">Các Test Case:</span>
            <span className="quick-stats__value">
              {validTestCasesCount} hợp lệ
            </span>
          </div>
          <div className="quick-stats__item quick-stats__item--status">
            <span className="quick-stats__label">Trạng thái:</span>
            {problem.title &&
            problem.functionName &&
            validTestCasesCount > 0 ? (
              <span className="quick-stats__status quick-stats__status--success">
                <CheckCircle2 size={16} />
                Sẵn sàng
              </span>
            ) : (
              <span className="quick-stats__status quick-stats__status--warning">
                <AlertCircle size={16} />
                Chưa đủ
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickStats;
