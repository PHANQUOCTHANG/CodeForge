--clone project
git clone https://github.com/PHANQUOCTHANG/CodeForge

--cài đặt docker
🐳 Cài đặt Docker Desktop trên Windows
1️⃣ Yêu cầu hệ thống

Windows 10 Pro/Enterprise/Education (bản 1903 trở lên) hoặc Windows 11.

Bật WSL 2 (Windows Subsystem for Linux 2).

CPU hỗ trợ ảo hóa (Intel VT-x hoặc AMD-V).

2️⃣ Tải Docker Desktop

Vào trang chính thức: 👉 Docker Desktop Download

Chọn bản Windows và tải về file .exe.

3️⃣ Cài đặt

Chạy file .exe vừa tải.

Khi được hỏi chọn backend, để mặc định WSL 2.

Chờ cài đặt hoàn tất → Restart máy.

4️⃣ Kiểm tra cài đặt

Mở PowerShell / CMD / Git Bash và gõ:

docker --version

👉 Nếu ra version thì OK.

Thử chạy container mẫu:

docker run hello-world

👉 Nếu hiện thông báo "Hello from Docker!" thì đã cài thành công.

5️⃣ Cấu hình (tùy chọn)

Mở Docker Desktop → Settings.

Vào Resources chỉnh CPU/RAM nếu cần.

Vào General bật Start Docker Desktop when you log in để tự chạy khi mở máy.

---Khi đã cài docker thành công mở terminal trỏ vào folder lớn vd PS C:\Users\tranv\OneDrive\Documents\BTL\WebProgramming\CodeForge> có đuôi CodeForge

->> gõ: docker compose up --build -d (chờ nó tải các gói)
👉 Truy cập ứng dụng

Frontend (React/Vite): http://localhost:3000

Backend (ASP.NET Core API): http://localhost:5000

Database (SQL Server): localhost,1433

User: sa

Password: giá trị trong .env -> SA_PASSWORD

Chạy SSMS của SQL sever rồi đăng nhập vào

-> Các câu lệnh hay dùng
docker compose up # Chạy containers
docker compose up -d # Chạy background
docker compose down # Dừng containers
docker compose build # Build lại images
docker compose logs -f # Xem log realtime
