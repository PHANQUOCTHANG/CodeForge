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

🚀 2️⃣ Chạy ở môi trường DEV (khi bạn đang code)
🔹 Câu lệnh
docker-compose -f docker-compose.dev.yml up --build

🔹 Giải thích:

-f docker-compose.dev.yml → chỉ định file compose dev.

--build → build lại image nếu code hoặc Dockerfile thay đổi.

Không thêm -d để bạn xem log realtime (nếu cần chạy nền thì thêm -d).

🔹 Môi trường dev hoạt động thế nào:

Frontend (frontend)

Mount code local (./CodeForge\_\_FE:/app) → mọi thay đổi lưu trực tiếp vào container.

Có hot reload nhờ Vite (port 5173).

Chạy npm run dev.

Backend (backend)

Mount code local (./CodeForge\_\_BE:/app).

Chạy bằng dotnet watch run → hot reload khi bạn chỉnh code.

Mọi package thêm (npm install, dotnet add package) sẽ ghi vào code local.

Database (db)

Container chạy SQL Server.

Dữ liệu lưu vào volume (sql_data_dev), không bị mất khi container restart.

| Tác vụ                       | Lệnh                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------- |
| Chạy container (dev mode)    | `docker-compose -f docker-compose.dev.yml up --build`                                             |
| Dừng toàn bộ                 | `docker-compose -f docker-compose.dev.yml down`                                                   |
| Dừng & xóa volume (reset DB) | `docker-compose -f docker-compose.dev.yml down -v`                                                |
| Xem log của 1 service        | `docker-compose -f docker-compose.dev.yml logs -f backend`                                        |
| Mở shell trong container     | `docker-compose -f docker-compose.dev.yml exec frontend sh`                                       |
| Thêm package Node.js         | `docker-compose -f docker-compose.dev.yml exec frontend npm install axios`                        |
| Thêm package .NET            | `docker-compose -f docker-compose.dev.yml exec backend dotnet add package Swashbuckle.AspNetCore` |

🌐 4️⃣ Chạy ở môi trường PROD (khi deploy)
🔹 Câu lệnh
docker-compose -f docker-compose.prod.yml up --build -d

🔹 Giải thích:

-f docker-compose.prod.yml → file cấu hình production.

--build → build image production.

-d → chạy ở chế độ detached (background).

🔹 Môi trường prod hoạt động thế nào:

Frontend build xong thành static HTML/JS/CSS → serve bằng nginx.

Backend build .dll và chạy ASP.NET trên base image aspnet:8.0.

DB dùng volume riêng sql_data (không trùng với dev volume).

Không mount code local → code trong container là build version (an toàn, nhanh, gọn).

🧹 5️⃣ Reset môi trường (nếu cần dọn sạch)

Khi bạn thấy Docker hơi lộn xộn, có thể dọn toàn bộ bằng:

docker-compose -f docker-compose.dev.yml down -v --remove-orphans
docker-compose -f docker-compose.prod.yml down -v --remove-orphans
docker system prune -af
docker volume prune -f

Quy trình làm việc chuẩn cho team
| Bước | Người dev cần làm | Ghi chú |
| ---- | --------------------------------------------- | ----------------------------------------- |
| 1️⃣ | Pull code mới từ Git | đảm bảo sync với team |
| 2️⃣ | Chạy `docker-compose.dev.yml` | backend + frontend auto hot reload |
| 3️⃣ | Dev bình thường | chỉnh code, save → reload tự động |
| 4️⃣ | Thêm package (npm/dotnet) trong container | để đảm bảo dependency đồng nhất |
| 5️⃣ | Commit & push | code + package.json + csproj luôn đồng bộ |
| 6️⃣ | Build & deploy bằng `docker-compose.prod.yml` | tạo image production để đưa lên server |

⚙️ I. Khi bạn đang ở môi trường DEV (hot reload đang bật)

Giả sử bạn đang chạy bằng lệnh:

docker-compose -f docker-compose.dev.yml up --build

🧠 1️⃣ Trường hợp bạn chỉ sửa code (JS/TS hoặc C#):

➡ Không cần làm gì cả

Frontend (Vite) → tự động reload trình duyệt.

Backend (.NET Watch) → tự build lại và restart server.

✅ Chỉ cần save file là thấy thay đổi ngay.

🔁 2️⃣ Trường hợp bạn thay đổi dependency:

Ví dụ:

Thêm package npm (axios, react-router-dom, v.v.)

Thêm NuGet package (Swashbuckle, EntityFramework, v.v.)

🔹 Frontend:
docker-compose -f docker-compose.dev.yml exec frontend npm install axios

→ Tự động ghi vào package.json trong local.
→ Không cần rebuild container.

🔹 Backend:
docker-compose -f docker-compose.dev.yml exec backend dotnet add package Swashbuckle.AspNetCore

→ Ghi vào .csproj
→ Sau đó container tự rebuild code nhờ dotnet watch.

♻️ 3️⃣ Trường hợp bạn sửa Dockerfile hoặc docker-compose.dev.yml

Ví dụ: đổi port, thêm volume, thêm ENV mới,...

👉 Lúc này cần rebuild lại container:

docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build

⚠️ Nếu có thay đổi database, muốn xóa data test:

docker-compose -f docker-compose.dev.yml down -v

🌐 II. Khi bạn ở môi trường PRODUCTION

Chạy lệnh build & deploy như sau:

docker-compose -f docker-compose.prod.yml up --build -d

🔁 Khi bạn sửa code xong (FE hoặc BE):

Vì production không mount code local, nên bạn phải rebuild image:

docker-compose -f docker-compose.prod.yml up --build -d

Docker sẽ:

Build lại image backend (chạy dotnet publish)

Build lại image frontend (chạy npm run build)

Restart container mới (BE, FE, DB vẫn giữ nguyên data volume)

🧹 Nếu muốn dọn sạch trước khi build lại
docker-compose -f docker-compose.prod.yml down -v --remove-orphans
docker-compose -f docker-compose.prod.yml up --build -d

| Mục đích                    | Lệnh                                                         |
| --------------------------- | ------------------------------------------------------------ |
| 🟢 Chạy dev mode            | `docker-compose -f docker-compose.dev.yml up --build`        |
| 🔵 Dừng dev mode            | `docker-compose -f docker-compose.dev.yml down`              |
| 🟠 Xóa toàn bộ (bao gồm DB) | `docker-compose -f docker-compose.dev.yml down -v`           |
| 🔵 Mở shell FE              | `docker-compose -f docker-compose.dev.yml exec frontend sh`  |
| 🔵 Mở shell BE              | `docker-compose -f docker-compose.dev.yml exec backend bash` |
| 🟣 Chạy production          | `docker-compose -f docker-compose.prod.yml up --build -d`    |
| 🔴 Dừng production          | `docker-compose -f docker-compose.prod.yml down`             |

💡 IV. Mẹo thực tế cho teamwork

Mỗi dev chỉ cần:

Pull code về

Chạy docker-compose -f docker-compose.dev.yml up --build

Code & Save → Tự reload.

Khi commit:

Bao gồm package.json, .csproj, .env

Không commit file build (dist/, bin/, obj/)

✅ Bước 2 — Yêu cầu dev khác đồng bộ lại node_modules

Khi họ pull code mới, họ phải xóa node_modules cũ để tránh còn lib cũ.

Trong dự án Docker (hoặc local), các dev khác chạy:

docker-compose -f docker-compose.dev.yml down -v

và trong thư mục CodeForge\_\_FE:

Remove-Item -Recurse -Force node_modules, package-lock.json

(hoặc Linux: rm -rf node_modules package-lock.json)

Sau đó:

docker-compose -f docker-compose.dev.yml up --build

👉 Docker sẽ rebuild image frontend, cài lại dependency mới không còn Tailwind nữa.

💬 Ghi nhớ cho team:

Khi bạn hoặc ai đó cài mới package trên Windows:

Chạy npm install --include=optional --ignore-scripts

Commit cả package-lock.json

Các dev khác chỉ cần npm ci hoặc docker-compose up --build → sẽ ổn định cho mọi hệ điều hành.

# Tóm gọn quy tắc vàng

📁 folder: lowercase-with-dash => Tránh lỗi import trên Linux/Mac
📄 component/page/layout: PascalCase =>Vì React component là class/JSX element
⚙️ service/hook/store: camelCase =>Thể hiện vai trò “logic function”
🧠 type/constant: PascalCase or descriptive =>Rõ ràng, dễ tìm
🔁 index.ts: chỉ để export
