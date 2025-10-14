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
🔹 Các bước chạy Docker lần đầu sau khi clone code

Clone repo

git clone https://github.com/ten-ban/code-frontend.git
cd code-frontend

Tạo file môi trường (nếu có)
Nhiều dự án có .env.example. Bạn copy ra .env:

cp .env.example .env

→ Sau đó chỉnh sửa biến môi trường phù hợp.

Build Docker image (tạo container image lần đầu)

docker-compose build

Lệnh này đọc docker-compose.yml + Dockerfile, build image mới.

Nếu code có nhiều service (frontend, backend, db), tất cả sẽ build.

Chạy container

docker-compose up -d

-d = chạy background.

Lần đầu có thể hơi lâu vì phải cài node_modules hoặc build project.

Check logs (đảm bảo không lỗi)

docker-compose logs -f

→ Nếu thấy lỗi liên quan đến missing module, có thể phải xóa cache rồi build lại:

docker-compose build --no-cache
docker-compose up -d

Mở ứng dụng trên browser

Thường frontend React/Vite chạy ở: http://localhost:5173
(hoặc port bạn map trong docker-compose.yml).

Backend: http://localhost:3000
hay http://localhost:8080
tùy config.

🔹 Tips khi mới clone về

Nếu volume mount code (./src:/app/src), container sẽ dùng code local → hot reload.

Nếu chỉ copy code vào image (COPY . .), thì mỗi lần đổi code hoặc đổi branch phải rebuild.

Nếu repo có nhiều branch với Docker khác nhau → nên chạy:

docker system prune -af

để xoá cache, tránh conflict.

👉 Bạn có muốn mình viết luôn một checklist 5 bước auto (kiểu makefile hoặc script sh) để chỉ cần ./run.sh là tự động build + run sau khi clone repo không?
//cách cài package docker
🔹 2. Nếu bạn đang chạy bằng Docker

Khi chạy bằng Docker, bạn không cài package trực tiếp trên máy, mà phải cập nhật trong container. Có 2 cách:

Cách A: Cài từ trong container

Vào container frontend:

docker exec -it <ten-container-frontend> sh

(hoặc bash nếu có)

Trong container, chạy:

npm install ten-package

→ Nó sẽ cài vào node_modules trong container.

Quan trọng: Nếu container không mount node_modules ra ngoài, khi bạn rebuild container thì sẽ mất package. Vì vậy thường phải chạy lại:

docker-compose build frontend
docker-compose up -d frontend

Cách B: Chỉnh package.json rồi rebuild

Mở file frontend/package.json, thêm package bằng lệnh:

npm install ten-package --save

hoặc chỉnh thủ công trong dependencies.

Sau đó rebuild image:
docker-compose build --no-cache frontend
docker-compose up frontend

docker-compose build frontend
docker-compose up -d frontend
