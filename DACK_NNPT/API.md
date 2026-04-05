# Danh sách API — Backend DACK_NNPT

**Base URL (mặc định dev):** `http://localhost:3000`  
**Tiền tố REST:** `/api/v1` (trừ route gốc `/` và trang EJS).

### Cột `BC` — đối chiếu báo cáo Word (Chương 2, phần Postman)

| Ký hiệu | Ý nghĩa |
|--------|---------|
| ✅ | API đã có mục / luồng tương ứng trong báo cáo |
| — | API có trong code nhưng **chưa** nêu trong báo cáo (nên bổ sung khi trình bày) |

---

## 1. Gốc & tĩnh (không có `/api/v1`)

| BC | Method | Đường dẫn | Mô tả (ngắn) |
|----|--------|-----------|----------------|
| — | GET | `/` | Trang EJS `index` |
| — | GET | `/chat` | File `resources/chat.html` |

---

## 2. Users — `/api/v1/users`

| BC | Method | Đường dẫn | Auth / quyền |
|----|--------|-----------|----------------|
| ✅ | GET | `/api/v1/users` | CheckLogin + role ADMIN/MODERATOR |
| ✅ | GET | `/api/v1/users/:id` | Công khai |
| ✅ | POST | `/api/v1/users` | Validator tạo user |
| ✅ | PUT | `/api/v1/users/:id` | Validator chỉnh user |
| ✅ | DELETE | `/api/v1/users/:id` | Xóa mềm (`isDeleted`) |
| — | GET | `/api/v1/users/support-admin` | Công khai — trả `_id`, `username`, `avatarUrl` admin/moderator (chat hỗ trợ) |

---

## 3. Products — `/api/v1/products` *

| BC | Method | Đường dẫn | Ghi chú |
|----|--------|-----------|---------|
| ✅ | GET | `/api/v1/products` | Query: `title`, `minprice`, `maxprice` |
| ✅ | GET | `/api/v1/products/:id` | Chi tiết + tóm tắt đánh giá (`averageRating`, `reviewCount`) |
| ✅ | POST | `/api/v1/products` | Tạo sản phẩm |
| ✅ | PUT | `/api/v1/products/:id` | Cập nhật |
| ✅ | DELETE | `/api/v1/products/:id` | Xóa mềm |

---

## 4. Categories — `/api/v1/categories`

| BC | Method | Đường dẫn |
|----|--------|-----------|
| ✅ | GET | `/api/v1/categories` |
| ✅ | GET | `/api/v1/categories/:id` |
| ✅ | POST | `/api/v1/categories` |
| ✅ | PUT | `/api/v1/categories/:id` |
| ✅ | DELETE | `/api/v1/categories/:id` |

---

## 5. Roles — `/api/v1/roles`

| BC | Method | Đường dẫn |
|----|--------|-----------|
| ✅ | GET | `/api/v1/roles` |
| ✅ | GET | `/api/v1/roles/:id` |
| ✅ | POST | `/api/v1/roles` |
| ✅ | PUT | `/api/v1/roles/:id` |
| ✅ | DELETE | `/api/v1/roles/:id` |

---

## 6. Auth — `/api/v1/auth` *

| BC | Method | Đường dẫn | Ghi chú |
|----|--------|-----------|---------|
| ✅ | POST | `/api/v1/auth/login` | Cookie `TOKEN_NNPTUD_C3` |
| ✅ | POST | `/api/v1/auth/register` | Validator |
| ✅ | GET | `/api/v1/auth/me` | CheckLogin |
| ✅ | POST | `/api/v1/auth/changepassword` | CheckLogin + validator |
| ✅ | POST | `/api/v1/auth/logout` | CheckLogin |
| ✅ | POST | `/api/v1/auth/forgotpassword` | Body: `email` — tạo mật khẩu ngẫu nhiên, lưu DB (hash), gửi mật khẩu mới qua email |

---

## 7. Carts — `/api/v1/carts` *

| BC | Method | Đường dẫn | Auth |
|----|--------|-----------|------|
| ✅ | GET | `/api/v1/carts` | CheckLogin |
| ✅ | POST | `/api/v1/carts/add` | CheckLogin — body: `product`, `quantity` |
| ✅ | POST | `/api/v1/carts/remove` | CheckLogin — body: `product`, `quantity` |
| ✅  | POST | `/api/v1/carts/clear` | CheckLogin — xóa toàn bộ item trong giỏ |

---

## 8. Wishlists — `/api/v1/wishlists` *

| BC | Method | Đường dẫn | Auth |
|----|--------|-----------|------|
| ✅ | GET | `/api/v1/wishlists` | CheckLogin |
| ✅ | POST | `/api/v1/wishlists/add` | CheckLogin — body: `product` |
| ✅ | POST | `/api/v1/wishlists/remove` | CheckLogin — body: `product` |
| ✅ | POST | `/api/v1/wishlists/clear` | CheckLogin — xóa toàn bộ item; trả `{ deletedCount }` |

---

## 9. Upload — `/api/v1/upload`

| BC | Method | Đường dẫn | Ghi chú |
|----|--------|-----------|---------|
| — | POST | `/api/v1/upload/excel_users` | Import user từ Excel |
| — | POST | `/api/v1/upload/excel` | Import sản phẩm + tồn kho từ Excel |
| — | GET | `/api/v1/upload/:filename` | Tải/xem file đã upload |

---

## 10. Messages — `/api/v1/messages`  --- 

| BC | Method | Đường dẫn | Auth |
|----|--------|-----------|------|
| — | POST | `/api/v1/messages` | CheckLogin + optional `file` (tin nhắn file/text) |
| — | GET | `/api/v1/messages/:userID` | CheckLogin — hội thoại với một user |
| — | GET | `/api/v1/messages` | CheckLogin — danh sách hội thoại gần nhất |

---

## 11. Promotions — `/api/v1/promotions`

Mount: `app.use('/api/v1/promotions', require('./routes/promotions'))`.

| BC | Method | Đường dẫn | Auth / quyền |
|----|--------|-----------|----------------|
| ✅ | GET | `/api/v1/promotions` | Công khai — query `title` (lọc) |
| ✅ | GET | `/api/v1/promotions/:id` | CheckLogin + role **admin** |
| ✅ | GET | `/api/v1/promotions/validate/:code` | CheckLogin — kiểm tra mã (checkout) |
| ✅ | POST | `/api/v1/promotions` | CheckLogin + role **admin** |
| ✅ | PUT | `/api/v1/promotions/:id` | CheckLogin + role **admin** |
| ✅ | DELETE | `/api/v1/promotions/:id` | CheckLogin + role **admin** — xóa mềm |

---

## 12. Inventories — `/api/v1/inventories`

| BC | Method | Đường dẫn |
|----|--------|-----------|
| ✅ | GET | `/api/v1/inventories` |
| ✅ | GET | `/api/v1/inventories/:id` |
| ✅ | POST | `/api/v1/inventories/add-stock` |
| ✅ | POST | `/api/v1/inventories/remove-stock` |

---

## 13. Reservations (đơn đặt hàng) — `/api/v1/reservations`

| BC | Method | Đường dẫn | Auth |
|----|--------|-----------|------|
| ✅ | POST | `/api/v1/reservations` | CheckLogin |
| ✅ | GET | `/api/v1/reservations` | CheckLogin |

---

## 14. Product reviews (theo đơn hàng) — `/api/v1/reviews`

Mount: `app.use('/api/v1/reviews', require('./routes/productReviews'))` — model **`productReviews`**, gắn với **reservation** (`orderId` = `_id` đơn, trạng thái `paid`).

| BC | Method | Đường dẫn | Auth | Body / params |
|----|--------|-----------|------|----------------|
| ✅ | POST | `/api/v1/reviews/add-review` | CheckLogin | JSON: `productId`, `orderId`, `rating`, `comment` |
| ✅ | GET | `/api/v1/reviews/product/:productId` | Công khai | Trả `reviews`, `averageRating`, `totalReviews` |
| — | GET | `/api/v1/products/:id/reviews` | Danh sách review + summary (collection `reviews`) |
| — | POST | `/api/v1/products/:id/reviews` | CheckLogin — gửi đánh giá (`rating`, `comment`) |

**Hai luồng đánh giá trong project:**

- **`/api/v1/products/:id/reviews`** — collection **`reviews`**, không bắt `orderId` (xem `routes/products.js`).
- **`/api/v1/reviews/...`** — collection **`productReviews`**, bắt buộc đơn hàng đã thanh toán và SP thuộc đơn (xem `routes/productReviews.js`).

Frontend: `reviewApi.js` trỏ tới `/reviews/...` (đúng với base `/api/v1`); `productApi` trỏ tới `/products/:id/reviews`.

---

*Tài liệu tổng hợp từ `app.js` và thư mục `routes/`.*
