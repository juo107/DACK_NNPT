# HỒ SƠ KIỂM THỬ API POSTMAN (FULL SYSTEM) - NN STORE

Tài liệu này cung cấp toàn bộ các kịch bản kiểm thử API (Testing Scenarios) cho hệ thống Thương mại điện tử NN STORE.

---

## 📌 THÔNG TIN CHUNG
- **Base URL**: `http://localhost:3000/api/v1`
- **Authentication**: Sử dụng **JWT (Json Web Token)**. Sau khi đăng nhập, mã token sẽ được lưu vào Header `Authorization: Bearer <token>` hoặc Cookie.

---

## 🔐 1. HỆ THỐNG XÁC THỰC & NGƯỜI DÙNG (AUTH & USERS)

### 1.1. Đăng ký tài khoản (Register)
- **Method**: `POST` | **URL**: `/auth/register`
- **Body (JSON)**:
```json
{
  "username": "user_test",
  "password": "123",
  "email": "test@gmail.com",
  "fullName": "Người Dùng Thử Nghiệm"
}
```

### 1.2. Đăng nhập hệ thống (Login)
- **Method**: `POST` | **URL**: `/auth/login`
- **Body (JSON)**:
```json
{
  "username": "admin",
  "password": "123"
}
```
> **Chụp ảnh**: Kết quả trả về gồm thông tin `user` và `token`. Dùng token này cho các API Admin sau này.

---

## 👟 2. DANH MỤC & SẢN PHẨM (CATALOG)

### 2.1. Lấy danh sách sản phẩm (Bao gồm Tồn kho)
- **Method**: `GET` | **URL**: `/products`
> **Phân tích**: Bạn sẽ thấy trường `stock` được lấy từ bảng Inventory.

### 2.2. Thêm sản phẩm mới (Admin Only)
- **Method**: `POST` | **URL**: `/products`
- **Body (JSON)**:
```json
{
  "title": "Nike Air Max 2024",
  "price": 3500000,
  "description": "Giày chạy bộ cao cấp nhất của Nike",
  "category": "ID_DANH_MỤC",
  "images": ["url_anh_1.jpg"]
}
```

---

## 📦 3. QUẢN LÝ KHO HÀNG (INVENTORY)
*Chứng minh logic quản lý dòng hàng nhất quán.*

### 3.1. Xem chi tiết kho hàng
- **Method**: `GET` | **URL**: `/inventories`
> **Chụp ảnh**: Cho thầy thấy 3 chỉ số then chốt: `stock` (tồn thực), `reserved` (đang giữ hàng), `soldCount` (đã bán).

### 3.2. Nhập thêm hàng (Restock)
- **Method**: `POST` | **URL**: `/inventories/add-stock`
- **Body (JSON)**:
```json
{
  "productId": "ID_SẢN_PHẨM",
  "quantity": 100
}
```

---

## 🛒 4. GIỎ HÀNG & ĐẶT HÀNG (CART & RESERVATION)
*Luồng logic phức tạp nhất của dự án.*

### 4.1. Thêm vào giỏ hàng (Cart Add)
- **Method**: `POST` | **URL**: `/carts/add`
- **Body (JSON)**:
```json
{
  "product": "ID_SẢN_PHẨM",
  "quantity": 2
}
```

### 4.2. Tạo đơn hàng & Giữ kho (Check Out)
- **Method**: `POST` | **URL**: `/reservations`
- **Body (JSON)**:
```json
{
  "items": [{ "product": "ID_SẢN_PHẨM", "quantity": 1 }],
  "shippingInfo": {
    "fullName": "Nguyễn Văn Test",
    "phone": "0912345678",
    "address": "99 Lê Lợi, TP.HCM"
  }
}
```
> **Logic**: `POST /reservations` tự cập nhật kho (giảm `stock`, tăng `reserved`) trong cùng luồng tạo đơn. Chụp ảnh bảng Inventory trước và sau để minh họa.

### 4.3. Admin Phê duyệt đơn (Update Order Status)
- **Method**: `PUT` | **URL**: `/reservations/admin/status/ID_ĐƠN_HÀNG`
- **Body (JSON)**:
```json
{ "status": "paid" }
```
> **Logic (State Machine)**: Khi đơn hàng chuyển sang `paid`, hệ thống tự động: [Giảm Reserved] -> [Tăng SoldCount]. Đây là điểm cộng rất lớn cho đồ án.

---

## 📋 5. QUẢN LÝ DANH MỤC (CATEGORIES)
- **Method**: `POST` | **URL**: `/categories`
- **Body (JSON)**:
```json
{
  "name": "Giày Chạy Bộ",
  "description": "Chuyên dụng cho marathon và trekking"
}
```
> **Phân tích**: Tự động sinh ra `slug: "giay-chay-bo"` để tối ưu SEO.

---

## 🎁 6. KHUYẾN MÃI (PROMOTIONS)
- **Method**: `POST` | **URL**: `/promotions`
- **Body (JSON)**:
```json
{
  "code": "GIAM50K",
  "discountValue": 50000,
  "discountType": "fixed",
  "usageLimit": 100,
  "minOrderValue": 200000,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

---

## 🖼 7. HÌNH ẢNH & FILE (UPLOAD)
- Upload ảnh hàng loạt qua `/upload/...` đã gỡ. Có thể dùng **tin nhắn có file**: `POST /messages` (CheckLogin), Form-Data: `file` + các field text theo API Messages.
> **HD chụp ảnh**: Chụp status và JSON trả về sau khi gửi.

---

### 🎨 Mẹo chụp ảnh cho báo cáo:
1.  Sử dụng giao diện **Dark Mode** của Postman để ảnh trông chuyên nghiệp hơn.
2.  Khoanh đỏ các phần quan trọng như: **Status 200 OK**, **Thời gian phản hồi (ms)**, và dữ liệu JSON trả về.
3.  Sắp xếp ảnh theo thứ tự: **BƯỚC 1: TRƯỚC KHI THỰC HIỆN** -> **BƯỚC 2: SEND TRÊN POSTMAN** -> **BƯỚC 3: KẾT QUẢ ĐÃ ĐƯỢC ĐỒNG BỘ TRONG DATABASE**.
