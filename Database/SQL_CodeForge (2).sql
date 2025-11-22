CREATE DATABASE CodeForge ;
USE CodeForge;
GO

Select * from Users; 
Select * from Submissions ;

/* ============================================================
   1️⃣ USERS - Tài khoản người dùng
============================================================ */
CREATE TABLE Users (
    UserID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL DEFAULT 'student', -- student | teacher | admin
    JoinDate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    Status NVARCHAR(20) NOT NULL DEFAULT 'active',
    IsDeleted BIT NOT NULL DEFAULT 0
);

CREATE TABLE RefreshTokens (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    TokenHash NVARCHAR(450) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CreatedByIp NVARCHAR(50),
    RevokedAt DATETIME2,
    RevokedByIp NVARCHAR(50),
    ReplacedByTokenHash NVARCHAR(450),
    CONSTRAINT FK_RefreshTokens_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

/* ============================================================
   2️⃣ PROFILES - Hồ sơ người dùng
============================================================ */
CREATE TABLE Profiles (
    ProfileID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserID UNIQUEIDENTIFIER NOT NULL,
    FullName NVARCHAR(100),
    Avatar NVARCHAR(255),
    Bio NVARCHAR(500),
    Country NVARCHAR(100),
    Points INT DEFAULT 0,
    Level INT DEFAULT 1,
    IsDeleted BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Profiles_Users FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

/* ============================================================
   3️⃣ COURSE CATEGORIES - Danh mục khóa học
============================================================ */
CREATE TABLE CourseCategories (
    CategoryID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(255),
    Icon NVARCHAR(255),
    IsDeleted BIT NOT NULL DEFAULT 0
);
INSERT INTO CourseCategories (Name, Description, Icon) VALUES
('Lập trình Web Frontend', N'Các khóa học về HTML, CSS, JavaScript, và các Framework như React, Vue, Angular.', 'fa-code'),
('Lập trình Backend', N'Các khóa học về ngôn ngữ máy chủ (Node.js, Python, Java, .NET) và Cơ sở dữ liệu.', 'fa-server'),
('Khoa học Dữ liệu', N'Các khóa học về Phân tích Dữ liệu, Machine Learning, và Trí tuệ Nhân tạo.', 'fa-chart-line'),
('Thiết kế UX/UI', N'Các khóa học tập trung vào trải nghiệm người dùng (UX) và giao diện người dùng (UI) bằng Figma, Sketch.', 'fa-pen-ruler'),
('DevOps & Cloud', N'Các khóa học về triển khai, tự động hóa và quản lý hệ thống trên Cloud (AWS, Azure, GCP).', 'fa-cloud');

-- Ví dụ về một danh mục đã bị xóa (IsDeleted = 1)
INSERT INTO CourseCategories (Name, Description, Icon, IsDeleted) VALUES
('Quản lý Dự án', N'Các khóa học về phương pháp luận Agile và Scrum.', 'fa-project-diagram', 1);
/* ============================================================
   4️⃣ COURSES - Khóa học
============================================================ */
CREATE TABLE Courses (
    CourseID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Level NVARCHAR(20) NOT NULL, -- beginner, intermediate, advanced
    Language NVARCHAR(50) NOT NULL,
    CreatedBy UNIQUEIDENTIFIER NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    Status NVARCHAR(20) NOT NULL DEFAULT 'active',
    Thumbnail NVARCHAR(255),
    Price DECIMAL(18,2) NOT NULL DEFAULT 0,
    Discount DECIMAL(5,2) DEFAULT 0,
    Duration INT DEFAULT 0,
    CategoryID UNIQUEIDENTIFIER NOT NULL,
    Rating FLOAT DEFAULT 0,
    TotalRatings INT DEFAULT 0,
    TotalStudents INT DEFAULT 0,
    Slug NVARCHAR(200) NOT NULL UNIQUE,
    LessonCount INT DEFAULT 0,
    Overview NVARCHAR(MAX),
    IsDeleted BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Courses_Users FOREIGN KEY (CreatedBy) REFERENCES Users(UserID),
    CONSTRAINT FK_Courses_Categories FOREIGN KEY (CategoryID) REFERENCES CourseCategories(CategoryID)
);
/* ============================================================
   5️⃣ MODULES - Chương học
============================================================ */
CREATE TABLE Modules (
    ModuleID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CourseID UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    OrderIndex INT NOT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Modules_Courses FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);

/* ============================================================
   6️⃣ LESSONS - Bài học (gốc)
============================================================ */
CREATE TABLE Lessons (
    LessonID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ModuleID UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    LessonType NVARCHAR(20) NOT NULL, -- video | text | quiz | coding
    OrderIndex INT NOT NULL,
    Duration INT DEFAULT 0,
    IsDeleted BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Lessons_Modules FOREIGN KEY (ModuleID) REFERENCES Modules(ModuleID)
);

/* ============================================================
   7️⃣ LESSON VIDEOS - Nội dung video
============================================================ */
CREATE TABLE LessonVideos (
    LessonID UNIQUEIDENTIFIER PRIMARY KEY,
    VideoUrl NVARCHAR(500) NOT NULL,
    Caption NVARCHAR(MAX),
    Duration INT DEFAULT 0,
    CONSTRAINT FK_LessonVideos_Lessons FOREIGN KEY (LessonID) REFERENCES Lessons(LessonID)
);

/* ============================================================
   8️⃣ LESSON TEXTS - Nội dung văn bản / markdown
============================================================ */
CREATE TABLE LessonTexts (
    LessonID UNIQUEIDENTIFIER PRIMARY KEY,
    Content NVARCHAR(MAX) NOT NULL,
    CONSTRAINT FK_LessonTexts_Lessons FOREIGN KEY (LessonID) REFERENCES Lessons(LessonID)
);

/* ============================================================
   9️⃣ QUIZZES - Bài trắc nghiệm
============================================================ */
CREATE TABLE LessonQuizzes (
    LessonID UNIQUEIDENTIFIER PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    CONSTRAINT FK_LessonQuizzes_Lessons FOREIGN KEY (LessonID) REFERENCES Lessons(LessonID)
);

CREATE TABLE QuizQuestions (
    QuestionID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    LessonID UNIQUEIDENTIFIER NOT NULL,
    Question NVARCHAR(MAX) NOT NULL,
    Answers NVARCHAR(MAX) NOT NULL, -- JSON: ["A","B","C","D"]
    CorrectIndex INT NOT NULL,
    CONSTRAINT FK_QuizQuestions_Lessons FOREIGN KEY (LessonID) REFERENCES Lessons(LessonID)
);
-- Lệnh thêm cột LessonQuizId (Khóa ngoại mới)
ALTER TABLE QuizQuestions
-- BƯỚC 1: Xóa ràng buộc Khóa Ngoại cũ
-- (Tên ràng buộc có thể khác, bạn cần kiểm tra lại tên chính xác của ràng buộc cũ)
ALTER TABLE QuizQuestions
DROP CONSTRAINT FK_QuizQuestions_Lessons;


-- BƯỚC 2: Xóa cột Khóa Ngoại cũ
ALTER TABLE QuizQuestions
DROP COLUMN LessonQuizId ;


-- BƯỚC 3: Thêm cột Khóa Ngoại mới (LessonQuizId)
-- Cột này sẽ thay thế LessonID
ALTER TABLE QuizQuestions
ADD LessonQuizId UNIQUEIDENTIFIER NOT NULL;


-- BƯỚC 4: Thêm cột Explanation mới
-- Cột này bị thiếu trong cấu trúc cũ của bạn
ALTER TABLE QuizQuestions
ADD Explanation NVARCHAR(MAX) NULL;


-- BƯỚC 5: Thiết lập ràng buộc Khóa Ngoại mới
-- Liên kết LessonQuizId (bảng QuizQuestions) với LessonID (bảng LessonQuizzes)
ALTER TABLE QuizQuestions
ADD CONSTRAINT FK_QuizQuestions_LessonQuiz
FOREIGN KEY (LessonQuizId) REFERENCES LessonQuizzes(LessonID);

-- LƯU Ý QUAN TRỌNG:
-- Khóa chính của bảng LessonQuizzes phải thực sự là cột LessonID. 
-- Nếu Khóa chính của LessonQuizzes là LessonQuizId, bạn phải thay REFERENCES LessonQuizzes(LessonID) 
-- thành REFERENCES LessonQuizzes(LessonQuizId) 
-- Dùng NULL cho phép các hàng cũ không bị lỗi nếu chúng không có dữ liệu này
select * from Courses

drop table QuizQuestions
/* ============================================================
   🔟 CODING PROBLEMS - Bài tập code
============================================================ */

	CREATE TABLE CodingProblems (
		-- Khóa chính
		ProblemID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

		-- Khóa ngoại
		LessonID UNIQUEIDENTIFIER NULL, -- LessonId được khai báo là Guid? trong C#, nên cho phép NULL
    
		-- Các thuộc tính bắt buộc (Required/MaxLength)
		Title NVARCHAR(200) NOT NULL,
		Slug NVARCHAR(200) NOT NULL, -- Cột mới
		Difficulty NVARCHAR(20) NOT NULL DEFAULT 'Dễ',
		Status NVARCHAR(20) DEFAULT N'NOT_STARTED' ,
		-- Các thuộc tính không bắt buộc
		Description NVARCHAR(MAX) NULL,
		Tags NVARCHAR(255) NULL,
		FunctionName NVARCHAR(100) NULL, -- Cột mới
		Parameters NVARCHAR(500) NULL, -- Cột mới
		ReturnType NVARCHAR(100) NULL, -- Cột mới
		Notes NVARCHAR(MAX) NULL, -- Cột mới (Sử dụng NVARCHAR(MAX) vì C# là string?)
		Constraints NVARCHAR(MAX) NULL, -- Cột mới (Sử dụng NVARCHAR(MAX) vì C# là string?)

		-- Giới hạn thời gian/bộ nhớ
		TimeLimit INT NOT NULL DEFAULT 1000,
		MemoryLimit INT NOT NULL DEFAULT 256,

		-- Thuộc tính Audit
		CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(), -- Cột mới (DATETIME2 khớp với DateTime trong C#)
		UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(), -- Cột mới
		IsDeleted BIT NOT NULL DEFAULT 0,

		-- Ràng buộc khóa ngoại
		CONSTRAINT FK_CodingProblems_Lessons FOREIGN KEY (LessonID) REFERENCES Lessons(LessonID),
		CONSTRAINT CK_CodingProblems_Status CHECK (Status IN (N'SOLVED', N'ATTEMPTED', N'NOT_STARTED'))
	);
GO


CREATE TABLE TestCases (
    TestCaseID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ProblemID UNIQUEIDENTIFIER NOT NULL,
    Input NVARCHAR(MAX),
    ExpectedOutput NVARCHAR(MAX),
	Explain NVARCHAR(MAX) ,
    IsHidden BIT NOT NULL DEFAULT 0, -- test ẩn hay công khai
    IsDeleted BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_TestCases_Problems FOREIGN KEY (ProblemID) REFERENCES CodingProblems(ProblemID)
);

Use CodeForge ;
Select * from  Submissions ;

CREATE TABLE Submissions (
    SubmissionID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserID UNIQUEIDENTIFIER NOT NULL,
    ProblemID UNIQUEIDENTIFIER NOT NULL,
    Code NVARCHAR(MAX) NOT NULL,
    Language NVARCHAR(50) NOT NULL,
    Status NVARCHAR(30) NOT NULL, -- Accepted, Wrong Answer, etc.
    SubmitTime DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
	ExecutionTime INT, -- ms 
    MemoryUsed INT, -- MB
	QuantityTestPassed INT , 
	QuantityTest INT ,
	TestCaseIdFail UNIQUEIDENTIFIER NULL ,
    CONSTRAINT FK_Submissions_Users FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT FK_Submissions_Problems FOREIGN KEY (ProblemID) REFERENCES CodingProblems(ProblemID)
);

CREATE TABLE SubmissionResults (
    ResultID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SubmissionID UNIQUEIDENTIFIER NOT NULL,
    TestCaseID UNIQUEIDENTIFIER NOT NULL,
    Status NVARCHAR(30) NOT NULL,
    ExecutionTime INT,
    MemoryUsed INT,
    CONSTRAINT FK_SubmissionResults_Submissions FOREIGN KEY (SubmissionID) REFERENCES Submissions(SubmissionID),
    CONSTRAINT FK_SubmissionResults_TestCases FOREIGN KEY (TestCaseID) REFERENCES TestCases(TestCaseID)
);

/* ============================================================
   1️⃣1️⃣ PROGRESS - Tiến trình học
============================================================ */
CREATE TABLE Progress (
    ProgressID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserID UNIQUEIDENTIFIER NOT NULL,
    LessonID UNIQUEIDENTIFIER NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'in_progress',
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Progress_Users FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT FK_Progress_Lessons FOREIGN KEY (LessonID) REFERENCES Lessons(LessonID)
);

/* ============================================================
   1️⃣2️⃣ ENROLLMENTS - Ghi danh khóa học
============================================================ */
CREATE TABLE Enrollments (
    EnrollmentID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserID UNIQUEIDENTIFIER NOT NULL,
    CourseID UNIQUEIDENTIFIER NOT NULL,
    EnrolledAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    Status NVARCHAR(20) NOT NULL DEFAULT 'enrolled',
    CONSTRAINT FK_Enrollments_Users FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT FK_Enrollments_Courses FOREIGN KEY (CourseID) REFERENCES Courses(CourseID),
    CONSTRAINT UQ_Enrollments UNIQUE(UserID, CourseID)
);

/* ============================================================
   1️⃣3️⃣ REVIEWS, NOTIFICATIONS, PAYMENTS, BADGES...
============================================================ */
CREATE TABLE CourseReviews (
    ReviewID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CourseID UNIQUEIDENTIFIER NOT NULL,
    UserID UNIQUEIDENTIFIER NOT NULL,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Reviews_Courses FOREIGN KEY (CourseID) REFERENCES Courses(CourseID),
    CONSTRAINT FK_Reviews_Users FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Notifications (
    NotificationID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserID UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Message NVARCHAR(MAX),
    IsRead BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Payments (
    PaymentID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserID UNIQUEIDENTIFIER NOT NULL,
    CourseID UNIQUEIDENTIFIER NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Currency NVARCHAR(10) DEFAULT 'VND',
    PaymentMethod NVARCHAR(50),
    Status NVARCHAR(20) NOT NULL DEFAULT 'pending',
    PaidAt DATETIME2 NULL,
    CONSTRAINT FK_Payments_Users FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT FK_Payments_Courses FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);

CREATE TABLE Badges (
    BadgeID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255),
    Icon NVARCHAR(255)
);

CREATE TABLE UserBadges (
    UserID UNIQUEIDENTIFIER NOT NULL,
    BadgeID UNIQUEIDENTIFIER NOT NULL,
    EarnedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    PRIMARY KEY (UserID, BadgeID),
    CONSTRAINT FK_UserBadges_Users FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT FK_UserBadges_Badges FOREIGN KEY (BadgeID) REFERENCES Badges(BadgeID)
);

 /* ========================
    17. Languages - Ngôn ngữ lập trình hỗ trợ
 ======================== */
CREATE TABLE Languages (
    LanguageID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Version NVARCHAR(20),
    IsDeleted BIT NOT NULL DEFAULT 0
);

 /* ========================
    18. Notifications - Thông báo hệ thống
 ======================== */
CREATE TABLE Notifications (
    NotificationID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserID UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Message NVARCHAR(MAX),
    IsRead BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

 /* ========================
    19. Payments - Giao dịch thanh toán
 ======================== */
CREATE TABLE Payments (
    PaymentID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserID UNIQUEIDENTIFIER NOT NULL,
    CourseID UNIQUEIDENTIFIER NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Currency NVARCHAR(10) NOT NULL DEFAULT 'USD',
    PaymentMethod NVARCHAR(50),
    Status NVARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, success, failed
    PaidAt DATETIME2 NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Payments_Users FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT FK_Payments_Courses FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);

 /* ========================
    20. ActivityLogs - Nhật ký hoạt động
 ======================== */
CREATE TABLE ActivityLogs (
    LogID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserID UNIQUEIDENTIFIER NOT NULL,
    Action NVARCHAR(200) NOT NULL,
    Details NVARCHAR(MAX),
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_ActivityLogs_Users FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

 /* ========================
    21. Favorites - Lưu bài học / bài tập ưa thích
 ======================== */
CREATE TABLE Favorites (
    FavoriteID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserID UNIQUEIDENTIFIER NOT NULL,
    LessonID UNIQUEIDENTIFIER NULL,
    ProblemID UNIQUEIDENTIFIER NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Favorites_Users FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT FK_Favorites_Lessons FOREIGN KEY (LessonID) REFERENCES Lessons(LessonID),
    CONSTRAINT FK_Favorites_Problems FOREIGN KEY (ProblemID) REFERENCES CodingProblems(ProblemID)
);

 /* ========================
    22. Reports - Báo cáo vi phạm
 ======================== */
CREATE TABLE Reports (
    ReportID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ReporterID UNIQUEIDENTIFIER NOT NULL,
    TargetType NVARCHAR(20) NOT NULL, -- user, comment, thread, lesson, problem
    TargetID UNIQUEIDENTIFIER NOT NULL,
    Reason NVARCHAR(255),
    Status NVARCHAR(20) NOT NULL DEFAULT 'pending',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    IsDeleted BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Reports_Users FOREIGN KEY (ReporterID) REFERENCES Users(UserID)
);


Select * from CodingProblems ;
Delete from CodingProblems ;
Select * from Submissions ;
Select * from Users ;
Delete from Users ;

INSERT INTO CodingProblems 
(Title, Slug, Difficulty, Description, Tags, FunctionName, Parameters, ReturnType, Notes, Constraints)
VALUES
(N'Tính tổng hai số', N'tinh-tong-hai-so', N'Dễ',
 N'Viết hàm nhận vào hai số nguyên và trả về tổng của chúng.',
 N'toán học,cơ bản',
 N'calculateSum', N'int a, int b', N'int',
 N'Lưu ý kiểm tra tràn số.', 
 N'0 ≤ a,b ≤ 10^9'),

(N'Kiểm tra số nguyên tố', N'kiem-tra-so-nguyen-to', N'Dễ',
 N'Viết hàm kiểm tra một số nguyên dương có phải là số nguyên tố hay không.',
 N'toán học,số học',
 N'isPrime', N'int n', N'bool',
 N'Nhớ điều kiện n >= 2.', 
 N'1 ≤ n ≤ 10^7'),

(N'Đảo ngược chuỗi', N'dao-nguoc-chuoi', N'Dễ',
 N'Cho một chuỗi, hãy trả về chuỗi đã được đảo ngược.',
 N'chuỗi,string',
 N'reverseString', N'string s', N'string',
 N'Không dùng hàm Reverse() có sẵn.', 
 N'1 ≤ length(s) ≤ 10^5'),

(N'Tìm giá trị lớn nhất trong mảng', N'tim-max-trong-mang', N'Trung bình',
 N'Cho một mảng số nguyên, hãy tìm phần tử lớn nhất.',
 N'mảng,array',
 N'findMax', N'int[] arr', N'int',
 N'Mảng có ít nhất 1 phần tử.', 
 N'1 ≤ length(arr) ≤ 10^5'),

(N'Tính giai thừa', N'tinh-giai-thua', N'Trung bình',
 N'Viết hàm tính n! với n là số nguyên không âm.',
 N'toán học,giai thừa',
 N'factorial', N'int n', N'long',
 N'Không tính bằng đệ quy để tránh tràn stack.', 
 N'0 ≤ n ≤ 20'),

(N'Kiểm tra chuỗi Palindrome', N'kiem-tra-palindrome', N'Trung bình',
 N'Xác định xem một chuỗi có phải là Palindrome hay không.',
 N'chuỗi,kiểm tra',
 N'isPalindrome', N'string s', N'bool',
 N'Bỏ qua khoảng trắng và ký tự đặc biệt.', 
 N'1 ≤ length(s) ≤ 10^5'),

(N'Sắp xếp mảng tăng dần', N'sap-xep-mang-tang-dan', N'Trung bình',
 N'Viết hàm sắp xếp mảng số nguyên theo thứ tự tăng dần.',
 N'mảng,thuật toán',
 N'sortArray', N'int[] arr', N'int[]',
 N'Không dùng Sort() có sẵn.', 
 N'1 ≤ length(arr) ≤ 10^5'),

(N'Tính tổng chữ số', N'tinh-tong-chu-so', N'Dễ',
 N'Cho một số nguyên dương, hãy tính tổng các chữ số của nó.',
 N'số học',
 N'sumDigits', N'int n', N'int',
 N'Dùng phép mod và chia 10.', 
 N'1 ≤ n ≤ 10^18'),

(N'Tìm số Fibonacci thứ n', N'tim-fibonacci-thu-n', N'Trung bình',
 N'Trả về số Fibonacci thứ n (F0 = 0, F1 = 1).',
 N'fibonacci,đệ quy',
 N'fib', N'int n', N'long',
 N'Dùng vòng lặp để tránh TLE.', 
 N'0 ≤ n ≤ 92'),

(N'Đếm số lần xuất hiện ký tự', N'dem-so-lan-xuat-hien-ky-tu', N'Dễ',
 N'Viết hàm đếm số lần xuất hiện của một ký tự trong chuỗi.',
 N'chuỗi,string',
 N'countChar', N'string s, char c', N'int',
 N'Phân biệt chữ hoa/thường.', 
 N'1 ≤ length(s) ≤ 10^5');

Delete from TestCases ;
Select * from TestCases ;

-----------------------------------------------------
-- 1️⃣ Tìm số Fibonacci thứ n
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('D887FD66-5906-4AED-9E3A-01E20D55232C', N'{"n":5}', '5', N'F5 = 5', 0),
('D887FD66-5906-4AED-9E3A-01E20D55232C', N'{"n":10}', '55', N'F10 = 55', 0),
('D887FD66-5906-4AED-9E3A-01E20D55232C', N'{"n":1}', '1', N'F1 = 1', 1),
('D887FD66-5906-4AED-9E3A-01E20D55232C', N'{"n":20}', '6765', N'F20 = 6765', 1);


-----------------------------------------------------
-- 2️⃣ Kiểm tra Palindrome
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('F157302E-FF5D-4568-B3ED-265A2BAE5136', N'{"s":"level"}', 'true', N'Là palindrome', 0),
('F157302E-FF5D-4568-B3ED-265A2BAE5136', N'{"s":"abc"}', 'false', N'Không đối xứng', 0),
('F157302E-FF5D-4568-B3ED-265A2BAE5136', N'{"s":"Aba"}', 'false', N'Phân biệt hoa thường', 1),
('F157302E-FF5D-4568-B3ED-265A2BAE5136', N'{"s":"racecar"}', 'true', N'Palindrome chuẩn', 1);


-----------------------------------------------------
-- 3️⃣ Sắp xếp mảng tăng dần
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('291D28A8-DF8C-4D0E-A255-28146E224290', N'{"arr":[3,1,2]}', '[1,2,3]', N'Cơ bản', 0),
('291D28A8-DF8C-4D0E-A255-28146E224290', N'{"arr":[5,5,1]}', '[1,5,5]', N'Có trùng', 0),
('291D28A8-DF8C-4D0E-A255-28146E224290', N'{"arr":[-1,0,2]}', '[-1,0,2]', N'Có số âm', 1),
('291D28A8-DF8C-4D0E-A255-28146E224290', N'{"arr":[9]}', '[9]', N'Mảng 1 phần tử', 1);


-----------------------------------------------------
-- 4️⃣ Tìm giá trị lớn nhất trong mảng
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('006E8E29-5246-4E06-BC3A-4D5B2CD00B8E', N'{"arr":[1,5,3]}', '5', N'Max = 5', 0),
('006E8E29-5246-4E06-BC3A-4D5B2CD00B8E', N'{"arr":[-1,-3,-2]}', '-1', N'Max âm', 0),
('006E8E29-5246-4E06-BC3A-4D5B2CD00B8E', N'{"arr":[100]}', '100', N'Một phần tử', 1),
('006E8E29-5246-4E06-BC3A-4D5B2CD00B8E', N'{"arr":[0,50,20]}', '50', N'Max = 50', 1);


-----------------------------------------------------
-- 5️⃣ Tính giai thừa
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('E66BB937-60D1-45B2-9653-519190F9C956', N'{"n":5}', '120', N'5! = 120', 0),
('E66BB937-60D1-45B2-9653-519190F9C956', N'{"n":0}', '1', N'0! = 1', 0),
('E66BB937-60D1-45B2-9653-519190F9C956', N'{"n":7}', '5040', N'7! = 5040', 1),
('E66BB937-60D1-45B2-9653-519190F9C956', N'{"n":1}', '1', N'1! = 1', 1);


-----------------------------------------------------
-- 6️⃣ Đếm ký tự xuất hiện
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('7B071EA5-EE61-4339-9290-555CA1322815', N'{"s":"hello","c":"l"}', '2', N'Có 2 chữ l', 0),
('7B071EA5-EE61-4339-9290-555CA1322815', N'{"s":"aaab","c":"a"}', '3', N'3 chữ a', 0),
('7B071EA5-EE61-4339-9290-555CA1322815', N'{"s":"abc","c":"x"}', '0', N'Không xuất hiện', 1),
('7B071EA5-EE61-4339-9290-555CA1322815', N'{"s":"AAAA","c":"A"}', '4', N'Phân biệt hoa thường', 1);


-----------------------------------------------------
-- 7️⃣ Kiểm tra số nguyên tố
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('8C5D9FC9-A8A5-4C6A-8A62-5FAA0122AF1A', N'{"n":7}', 'true', N'7 là số nguyên tố', 0),
('8C5D9FC9-A8A5-4C6A-8A62-5FAA0122AF1A', N'{"n":8}', 'false', N'8 không phải số nguyên tố', 0),
('8C5D9FC9-A8A5-4C6A-8A62-5FAA0122AF1A', N'{"n":1}', 'false', N'1 không phải số nguyên tố', 1),
('8C5D9FC9-A8A5-4C6A-8A62-5FAA0122AF1A', N'{"n":97}', 'true', N'97 là số nguyên tố lớn', 1);


-----------------------------------------------------
-- 8️⃣ Tính tổng hai số
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('61CF5EA8-E940-4660-8894-8D705AC2475E', N'{"a":3,"b":4}', '7', N'3+4=7', 0),
('61CF5EA8-E940-4660-8894-8D705AC2475E', N'{"a":10,"b":20}', '30', N'10+20=30', 0),
('61CF5EA8-E940-4660-8894-8D705AC2475E', N'{"a":-1,"b":5}', '4', N'Có số âm', 1),
('61CF5EA8-E940-4660-8894-8D705AC2475E', N'{"a":0,"b":0}', '0', N'0+0=0', 1);


-----------------------------------------------------
-- 9️⃣ Tính tổng chữ số
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('EDAA32F7-49BB-48B5-AF8E-B5C5FDF850C2', N'{"n":123}', '6', N'1+2+3', 0),
('EDAA32F7-49BB-48B5-AF8E-B5C5FDF850C2', N'{"n":987}', '24', N'9+8+7', 0),
('EDAA32F7-49BB-48B5-AF8E-B5C5FDF850C2', N'{"n":5}', '5', N'Một chữ số', 1),
('EDAA32F7-49BB-48B5-AF8E-B5C5FDF850C2', N'{"n":1001}', '2', N'1+0+0+1', 1);


-----------------------------------------------------
-- 🔟 Đảo ngược chuỗi
-----------------------------------------------------
INSERT INTO TestCases (ProblemID, Input, ExpectedOutput, Explain, IsHidden)
VALUES
('4DB00ADE-00A0-4AA4-930D-D3DE9574847D', N'{"s":"abc"}', 'cba', N'Cơ bản', 0),
('4DB00ADE-00A0-4AA4-930D-D3DE9574847D', N'{"s":"hello"}', 'olleh', N'Phổ biến', 0),
('4DB00ADE-00A0-4AA4-930D-D3DE9574847D', N'{"s":"A"}', 'A', N'Một ký tự', 1),
('4DB00ADE-00A0-4AA4-930D-D3DE9574847D', N'{"s":"12345"}', '54321', N'Dãy số', 1);

INSERT INTO Users (Username, Email, PasswordHash, Role, Status, IsDeleted)
VALUES (
    'john_doe',
    'john.doe@example.com',
    'hashed_password_example',
    'student',
    'active',
    0
);

Select * from Users; 
Select * from Submissions ;

