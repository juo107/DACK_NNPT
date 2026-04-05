# Danh sách API — Backend DACK_NNPT

**Base URL (mặc định dev):** `http://localhost:3000`  
**Tiền tố REST:** `/api/v1` (trừ route gốc `/` và trang EJS).

---

## Gốc & tĩnh (không có `/api/v1`)

| Method | Đường dẫn | Mô tả (ngắn) |
|--------|-----------|----------------|
| GET | `/` | Trang EJS `index` |
| GET | `/chat` | File `resources/chat.html` |

---

## Users — `/api/v1/users`

| Method | Đường dẫn | Auth / quyền |
|--------|-----------|----------------|
| GET | `/api/v1/users` | CheckLogin + role ADMIN/MODERATOR |
| GET | `/api/v1/users/:id` | Công khai |
| POST | `/api/v1/users` | Validator tạo user |
| PUT | `/api/v1/users/:id` | Validator chỉnh user |
| DELETE | `/api/v1/users/:id` | Xóa mềm (`isDeleted`) |

---

## Products — `/api/v1/products`

| Method | Đường dẫn | Ghi chú |
|--------|-----------|---------|
| GET | `/api/v1/products` | Query: `title`, `minprice`, `maxprice` |
| GET | `/api/v1/products/:id` | Chi tiết + tóm tắt đánh giá (`averageRating`, `reviewCount`) |
| GET | `/api/v1/products/:id/reviews` | Danh sách review + summary |
| POST | `/api/v1/products/:id/reviews` | CheckLogin — gửi đánh giá (rating, comment) |
| POST | `/api/v1/products` | Tạo sản phẩm |
| PUT | `/api/v1/products/:id` | Cập nhật |
| DELETE | `/api/v1/products/:id` | Xóa mềm |

---

## Categories — `/api/v1/categories`

| Method | Đường dẫn |
|--------|-----------|
| GET | `/api/v1/categories` |
| GET | `/api/v1/categories/:id` |
| POST | `/api/v1/categories` |
| PUT | `/api/v1/categories/:id` |
| DELETE | `/api/v1/categories/:id` |

---

## Roles — `/api/v1/roles`

| Method | Đường dẫn |
|--------|-----------|
| GET | `/api/v1/roles` |
| GET | `/api/v1/roles/:id` |
| POST | `/api/v1/roles` |
| PUT | `/api/v1/roles/:id` |
| DELETE | `/api/v1/roles/:id` |

---

## Auth — `/api/v1/auth`

| Method | Đường dẫn | Ghi chú |
|--------|-----------|---------|
| POST | `/api/v1/auth/login` | Cookie `TOKEN_NNPTUD_C3` |
| POST | `/api/v1/auth/register` | Validator |
| GET | `/api/v1/auth/me` | CheckLogin |
| POST | `/api/v1/auth/changepassword` | CheckLogin + validator |
| POST | `/api/v1/auth/logout` | CheckLogin |
| POST | `/api/v1/auth/forgotpassword` | |
| POST | `/api/v1/auth/resetpassword/:token` | |

---

## Carts — `/api/v1/carts`

| Method | Đường dẫn | Auth |
|--------|-----------|------|
| GET | `/api/v1/carts` | CheckLogin |
| POST | `/api/v1/carts/add` | CheckLogin — body: `product`, `quantity` |
| POST | `/api/v1/carts/remove` | CheckLogin — body: `product`, `quantity` |

---

## Wishlists — `/api/v1/wishlists`

| Method | Đường dẫn | Auth |
|--------|-----------|------|
| GET | `/api/v1/wishlists` | CheckLogin |
| POST | `/api/v1/wishlists/add` | CheckLogin — body: `product` |
| POST | `/api/v1/wishlists/remove` | CheckLogin — body: `product` |

---

## Upload — `/api/v1/upload`

| Method | Đường dẫn | Ghi chú |
|--------|-----------|---------|
| POST | `/api/v1/upload/one_image` | `multipart` field `file` |
| POST | `/api/v1/upload/multiple_images` | field `files`, tối đa 5 |
| POST | `/api/v1/upload/excel_users` | Import user từ Excel |
| POST | `/api/v1/upload/excel` | Import sản phẩm + tồn kho từ Excel |
| GET | `/api/v1/upload/:filename` | Tải/xem file đã upload |

---

## Messages — `/api/v1/messages`

| Method | Đường dẫn | Auth |
|--------|-----------|------|
| POST | `/api/v1/messages` | CheckLogin + optional `file` (tin nhắn file/text) |
| GET | `/api/v1/messages/:userID` | CheckLogin — hội thoại với một user |
| GET | `/api/v1/messages` | CheckLogin — danh sách hội thoại gần nhất |

---

## Inventories — `/api/v1/inventories`

| Method | Đường dẫn |
|--------|-----------|
| GET | `/api/v1/inventories` |
| GET | `/api/v1/inventories/:id` |
| POST | `/api/v1/inventories/add-stock` |
| POST | `/api/v1/inventories/remove-stock` |
| POST | `/api/v1/inventories/reservation` |
| POST | `/api/v1/inventories/sold` |

---

## Reservations (đơn đặt hàng) — `/api/v1/reservations`

| Method | Đường dẫn | Auth |
|--------|-----------|------|
| POST | `/api/v1/reservations` | CheckLogin |
| GET | `/api/v1/reservations` | CheckLogin |

---

## File `routes/productReviews.js` (chưa mount trong `app.js`)

Các route sau **được định nghĩa** trong `routes/productReviews.js` nhưng **chưa** có `app.use` trong `app.js` tại thời điểm tạo tài liệu này. Để dùng, cần thêm ví dụ:

`app.use('/api/v1/reviews', require('./routes/productReviews'));`

| Method | Đường dẫn (sau khi mount như trên) |
|--------|-------------------------------------|
| POST | `/api/v1/reviews/add-review` — CheckLogin |
| GET | `/api/v1/reviews/product/:productId` |

Đánh giá sản phẩm hiện có thể dùng qua **`/api/v1/products/:id/reviews`** trong `routes/products.js`.

---

*Tài liệu tổng hợp từ `app.js` và thư mục `routes/`.*
