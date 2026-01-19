# Hướng Dẫn Sử Dụng OTP Authentication - Quên Mật Khẩu (Cập Nhật)

## 📋 Tổng Quan

Hệ thống xác minh danh tính qua OTP (One-Time Password) với 3 bước:

1. **POST `/api/auth/send-otp`** - Gửi mã OTP đến email (hiệu lực **5 phút**)
2. **POST `/api/auth/verify-otp`** - Xác minh OTP → trả về **resetToken**
3. **POST `/api/auth/reset-password`** - Đặt lại mật khẩu (với resetToken hợp lệ)

---

## 🔧 Cấu Hình Email (Bắt Buộc)

### Cập nhật `appsettings.Development.json` hoặc `appsettings.json`:

```json
{
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": "587",
    "SenderEmail": "your-email@gmail.com",
    "SenderPassword": "your-app-password"
  }
}
```

#### Hướng Dẫn Lấy App Password cho Gmail:

1. Bật **2-Factor Authentication** trên tài khoản Google
2. Vào [Google Account Security](https://myaccount.google.com/security)
3. Tìm **App passwords** (chỉ hiển thị khi bật 2FA)
4. Chọn **Mail** và **Windows Computer**
5. Copy mật khẩu ứng dụng vào `SenderPassword`

---

## 📡 API Endpoints

### 1️⃣ Send OTP - Gửi Mã OTP

**Request:**

```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "OTP đã được gửi đến email của bạn",
  "data": "OTP đã được gửi đến email của bạn"
}
```

**Error Cases:**

- `400 Bad Request`: Email không được cung cấp
- `400 Bad Request`: Email không tồn tại trong hệ thống

**Đặc điểm:**

- ✅ OTP là 6 chữ số ngẫu nhiên
- ✅ Hết hạn sau **5 phút**
- ✅ Gửi qua email HTML đẹp

---

### 2️⃣ Verify OTP - Xác Minh OTP ⭐ (Thay Đổi)

**Request:**

```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "OTP xác minh thành công",
  "data": {
    "resetToken": "OTBhZjg2YmMyMDJlNGJiODg2YzUxY2ExYmZkZTA4MjE="
  }
}
```

**Error Cases:**

- `400 Bad Request`: Email hoặc OTP không được cung cấp
- `400 Bad Request`: OTP không tồn tại
- `400 Bad Request`: OTP đã được sử dụng
- `400 Bad Request`: OTP đã hết hạn
- `401 Unauthorized`: OTP không hợp lệ

**Đặc điểm (MỚI):**

- ✅ Trả về **resetToken** (không phải boolean)
- ✅ ResetToken hiệu lực **30 phút**
- ✅ ResetToken là string 32 ký tự base64
- ✅ Đánh dấu OTP đã sử dụng (không thể dùng lại)

---

### 3️⃣ Reset Password - Đặt Lại Mật Khẩu ⭐ (Thay Đổi)

**Request:**

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "OTBhZjg2YmMyMDJlNGJiODg2YzUxY2ExYmZkZTA4MjE=",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Mật khẩu đã được đặt lại thành công",
  "data": "Mật khẩu đã được đặt lại thành công"
}
```

**Error Cases:**

- `400 Bad Request`: Thiếu bất kỳ trường nào
- `400 Bad Request`: Mật khẩu xác nhận không khớp
- `400 Bad Request`: Mật khẩu phải có ít nhất 6 ký tự
- `401 Unauthorized`: Reset token không hợp lệ (MỚI)
- `401 Unauthorized`: Reset token đã hết hạn (MỚI)
- `401 Unauthorized`: Email không khớp với reset token (MỚI)

**Đặc điểm (THAY ĐỔI):**

- ✅ Tham số `otp` giờ là **resetToken** từ verify-otp
- ✅ Kiểm tra resetToken hợp lệ & còn hiệu lực
- ✅ Validate mật khẩu mới
- ✅ Đánh dấu resetToken đã sử dụng
- ✅ Hash mật khẩu trước khi lưu DB

---

## 💾 Database Changes

### Bảng Mới: `Otps`

| Cột       | Kiểu          | Mô Tả                          |
| --------- | ------------- | ------------------------------ |
| OtpId     | GUID          | Primary Key                    |
| Email     | nvarchar(100) | Email người dùng               |
| Code      | nvarchar(6)   | Mã OTP (6 chữ số)              |
| CreatedAt | datetime2     | Thời gian tạo                  |
| ExpiresAt | datetime2     | Thời gian hết hạn (**5 phút**) |
| IsUsed    | bit           | Đã sử dụng?                    |
| UsedAt    | datetime2     | Thời gian sử dụng              |

### Bảng Mới: `ResetTokens` ⭐ (MỚI)

| Cột          | Kiểu          | Mô Tả                           |
| ------------ | ------------- | ------------------------------- |
| ResetTokenId | GUID          | Primary Key                     |
| Email        | nvarchar(100) | Email người dùng                |
| Token        | nvarchar(255) | Token ngẫu nhiên (base64)       |
| CreatedAt    | datetime2     | Thời gian tạo                   |
| ExpiresAt    | datetime2     | Thời gian hết hạn (**30 phút**) |
| IsUsed       | bit           | Đã sử dụng?                     |
| UsedAt       | datetime2     | Thời gian sử dụng               |

### Apply Migration:

```bash
cd c:\CodeForge\MyContainer\CodeForge__BE
dotnet ef database update
```

---

## 🏗️ Cấu Trúc Code

### DTOs

- `SendOtpDto` - Chứa email
- `VerifyOtpDto` - Chứa email + OTP
- `ResetPasswordDto` - Chứa email, resetToken, password mới
- `VerifyOtpResponseDto` - Response chứa resetToken

### Entities

- `Otp` - Lưu OTP (hết hạn 5 phút)
- `ResetToken` ⭐ (MỚI) - Lưu reset token (hết hạn 30 phút)

### Services

- `IEmailService` / `EmailService` - Gửi email OTP
- `IAuthService` / `AuthService` - 3 method chính:
  - `SendOtpAsync(email)` - Tạo & gửi OTP
  - `VerifyOtpAsync(email, otp)` → `string` ⭐ (Thay đổi: trả `string` thay vì `bool`)
  - `ResetPasswordAsync(email, resetToken, newPassword)` ⭐ (Thay đổi: param `resetToken` thay vì `otp`)

### Repository

- `IAuthRepository` - Interface có 10 method (thêm 3 ResetToken methods)
- `AuthRepository` - Implement tất cả

---

## 🔐 Security Features

1. **OTP Expiry**: 5 phút (tự xóa sau 5 phút)
2. **OTP Format**: 6 chữ số ngẫu nhiên
3. **One-Time Use**: OTP chỉ dùng được 1 lần
4. **Reset Token**: 32 ký tự base64, hết hạn 30 phút ⭐ (MỚI)
5. **Reset Token One-Time Use**: Chỉ dùng được 1 lần ⭐ (MỚI)
6. **Email Validation**: Kiểm tra email tồn tại
7. **Password Strength**: Tối thiểu 6 ký tự
8. **Email Encryption**: SSL/TLS (cổng 587)

---

## 📝 Quy Trình Người Dùng

```
┌─────────────────────────────────────────────────────┐
│ 1. User vào trang "Quên Mật Khẩu"                  │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ 2. Nhập Email                                       │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
     ┌───────────────────────────────────┐
     │ POST /api/auth/send-otp           │
     │ { email: "user@example.com" }     │
     └───────────┬───────────────────────┘
                 │
     ✅ OTP sinh & gửi email (5 phút)
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ 3. User nhập OTP từ email                           │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
     ┌───────────────────────────────────┐
     │ POST /api/auth/verify-otp         │
     │ {email, otp}                      │
     └───────────┬───────────────────────┘
                 │
     ✅ OTP hợp lệ & chưa hết hạn
     ✅ OTP đánh dấu đã sử dụng
     ⬅️ Trả về { resetToken: "..." }
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ 4. User nhập mật khẩu mới                           │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
     ┌───────────────────────────────────┐
     │ POST /api/auth/reset-password     │
     │ {email, otp: resetToken,          │
     │  newPassword, confirmPassword}    │
     └───────────┬───────────────────────┘
                 │
     ✅ ResetToken hợp lệ & chưa hết hạn
     ✅ ResetToken đánh dấu đã sử dụng
     ✅ Mật khẩu hash & save DB
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ ✅ Mật khẩu đã được đặt lại thành công!             │
│ User quay về login với mật khẩu mới                │
└─────────────────────────────────────────────────────┘
```

---

## 🧪 Test Với Postman/Thunder Client

### Bước 1: Gửi OTP

```
POST: http://localhost:5000/api/auth/send-otp
Body: { "email": "user@example.com" }
Response: { "success": true, ... }
```

✅ Nhận email OTP (ví dụ: 123456)

### Bước 2: Xác Minh OTP

```
POST: http://localhost:5000/api/auth/verify-otp
Body: {
  "email": "user@example.com",
  "otp": "123456"
}
Response: {
  "success": true,
  "data": {
    "resetToken": "OTBhZjg2YmMyMDJlNGJiODg2YzUxY2ExYmZkZTA4MjE="
  }
}
```

✅ Lưu resetToken (30 phút)

### Bước 3: Reset Password

```
POST: http://localhost:5000/api/auth/reset-password
Body: {
  "email": "user@example.com",
  "otp": "OTBhZjg2YmMyMDJlNGJiODg2YzUxY2ExYmZkZTA4MjE=",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
Response: { "success": true, ... }
```

✅ Mật khẩu đã đặt lại

---

## ⚠️ Troubleshooting

### Lỗi: "Lỗi gửi email"

- ✅ Kiểm tra cấu hình EmailSettings
- ✅ Kiểm tra App Password Google
- ✅ Bật 2FA trên Gmail

### Lỗi: "OTP đã hết hạn"

- ✅ OTP chỉ có hiệu lực **5 phút**
- ✅ Gửi OTP mới qua /send-otp

### Lỗi: "Reset token không hợp lệ"

- ✅ Copy đúng resetToken từ verify-otp
- ✅ ResetToken chỉ hiệu lực **30 phút**
- ✅ ResetToken chỉ dùng được **1 lần**

### Lỗi: "Email không tồn tại"

- ✅ Email phải được đăng ký trước
- ✅ User phải tồn tại trong hệ thống

---

## 📚 Liên Quan Files

- [AuthController.cs](CodeForge__BE/src/CodeForge.Api/Controllers/AuthController.cs)
- [AuthService.cs](CodeForge__BE/src/CodeForge.Core/Services/AuthService.cs)
- [Otp.cs](CodeForge__BE/src/CodeForge.Core/Entities/Otp.cs)
- [ResetToken.cs](CodeForge__BE/src/CodeForge.Core/Entities/ResetToken.cs) ⭐
- [IEmailService.cs](CodeForge__BE/src/CodeForge.Core/Interfaces/Services/IEmailService.cs)
- [EmailService.cs](CodeForge__BE/src/CodeForge.Core/Services/EmailService.cs)
- [Migrations](CodeForge__BE/src/CodeForge.Infrastructure/Data/Migrations/)

---

## ✅ Thay Đổi Chính Từ Phiên Bản Trước

| Phiên Bản Cũ      | Phiên Bản Mới                    | Lý Do                                |
| ----------------- | -------------------------------- | ------------------------------------ |
| Verify trả `bool` | Verify trả `string` (resetToken) | An toàn hơn, không dùng OTP để reset |
| Reset dùng OTP    | Reset dùng resetToken            | OTP & resetToken tách biệt, độc lập  |
| OTP 10 phút       | OTP 5 phút                       | Nhanh hơn, tiện hơn                  |
| N/A               | ResetToken 30 phút               | Token tạm thời để reset password     |

---

**✅ Hệ thống hoàn thành & cập nhật!** 🎉
