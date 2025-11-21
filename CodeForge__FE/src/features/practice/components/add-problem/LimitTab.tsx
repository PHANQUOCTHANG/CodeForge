import { AlertCircle, Info, Settings } from "lucide-react";

const LimitTab = ({ activeTab, problem, handleProblemChange }) => {
  return (
    <>
      {/* Limits Tab */}
      {activeTab === "limits" && (
        <div className="tab-content">
          <div className="tab-content__header">
            <div className="tab-content__icon">
              <Settings size={20} />
            </div>
            <h2>Giới Hạn Thực Thi</h2>
          </div>

          <div className="limits-grid">
            <div className="limit-card limit-card--indigo">
              <label className="limit-card__label">
                Giới Hạn Thời Gian (milliseconds)
              </label>
              <input
                type="number"
                value={problem.timeLimit}
                onChange={(e) =>
                  handleProblemChange(
                    "timeLimit",
                    parseInt(e.target.value) || 0
                  )
                }
                className="limit-card__input"
                min="1"
              />
              <div className="limit-card__hint">
                <AlertCircle size={16} />
                <span>
                  Thời gian tối đa để thực thi code. Thông thường: 1000-3000ms
                </span>
              </div>
            </div>

            <div className="limit-card limit-card--purple">
              <label className="limit-card__label">Giới Hạn Bộ Nhớ (MB)</label>
              <input
                type="number"
                value={problem.memoryLimit}
                onChange={(e) =>
                  handleProblemChange(
                    "memoryLimit",
                    parseInt(e.target.value) || 0
                  )
                }
                className="limit-card__input"
                min="1"
              />
              <div className="limit-card__hint">
                <AlertCircle size={16} />
                <span>Bộ nhớ tối đa được sử dụng. Thông thường: 128-512MB</span>
              </div>
            </div>
          </div>

          <div className="info-box info-box--warning">
            <Info size={18} />
            <div>
              <p className="info-box__title">Gợi ý cài đặt:</p>
              <ul className="info-box__list">
                <li>Dễ: 1000ms, 128MB</li>
                <li>Trung Bình: 2000ms, 256MB</li>
                <li>Khó: 3000ms, 512MB</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LimitTab;
