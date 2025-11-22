CREATE DATABASE CodeForge ;
USE CodeForge;
GO

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
