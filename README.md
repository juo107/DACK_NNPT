# NN STORE - Hệ thống Thương mại Điện tử Fullstack

Dự án đồ án xây dựng website bán hàng (giày dép/phụ kiện) với đầy đủ các chức năng từ phía người dùng đến quản trị viên chuyên nghiệp.

## 🚀 Công nghệ sử dụng
- **Frontend**: ReactJS (Vite), Ant Design, Tailwind CSS, Context API.
- **Backend**: NodeJS, ExpressJS, MongoDB (Mongoose).
- **Security**: JWT Authentication, Role-Based Access Control (RBAC).

---

## 🛠 Danh sách chức năng chính

### 1. Dành cho Người dùng (User)
- **Trang chủ**: Banner động, khu vực Flash Sale, danh sách sản phẩm mới và bán chạy nhất.
- **Cửa hàng (Shop)**:
    - Tìm kiếm sản phẩm theo tên.
    - Lọc sản phẩm theo danh mục và khoảng giá.
    - Hiển thị trạng thái **HẾT HÀNG** trực quan trên ảnh sản phẩm.
- **Chi tiết sản phẩm**:
    - Xem ảnh sản phẩm, mô tả và đánh giá từ người dùng khác.
    - Chọn Kích cỡ (Size), Màu sắc (Color) và số lượng.
    - Kiểm tra số lượng tồn kho thực tế.
    - Xem danh sách sản phẩm tương tự.
- **Giỏ hàng (Cart)**:
    - Thêm/Xóa sản phẩm, cập nhật số lượng.
    - Đồng bộ giỏ hàng giữa chế độ Khách (LocalStorage) và Thành viên sau khi đăng nhập.
- **Thanh toán (Checkout)**:
    - Nhập thông tin người nhận hàng.
    - Áp dụng **Mã giảm giá (Promotion)** với kiểm tra điều kiện (tổng đơn tối thiểu, thời hạn, giới hạn lượt dùng).
    - Tính toán phí vận chuyển (Free ship cho đơn trên 1 triệu).
- **Tài khoản**:
    - Đăng ký và Đăng nhập.
    - Quản lý các đơn hàng đã đặt (My Orders).
    - Lưu danh sách sản phẩm yêu thích (Wishlist).

### 2. Dành cho Quản trị viên (Admin)
- **Dashboard Security**: Bảo mật chuyên sâu, chỉ cho phép tài khoản có quyền `admin` truy cập.
- **Quản lý Sản phẩm**:
    - Xem danh sách, Thêm mới, Chỉnh sửa và Xóa (Soft delete) sản phẩm.
    - Tự động tạo **Slug** cho SEO khi nhập tên sản phẩm.
- **Quản lý Kho hàng (Inventory)**:
    - Theo dõi chi tiết 3 chỉ số: **Tồn kho (Stock)**, **Đang giữ (Reserved)**, **Đã bán (Sold)**.
    - Cơ chế **Đồng bộ hóa tồn kho tức thì** khi phát sinh giao dịch.
    - Chức năng **Nhập hàng nhanh** trong bảng.
    - Bộ lọc nhanh theo trạng thái: Còn hàng, Sắp hết, Hết hàng, Sản phẩm đã bán.
- **Quản lý Đơn hàng (Order Management)**:
    - Xem toàn bộ danh sách đơn đặt hàng từ khách.
    - Cập nhật trạng thái đơn (Đã thanh toán, Hủy đơn).
    - **Tự động cập nhật kho hàng**: Tự động điều chuyển số lượng giữa Stock/Reserved/Sold khi thay đổi trạng thái đơn.
- **Quản lý Danh mục (Category)**: CRUD danh mục sản phẩm, tự động tạo slug.
- **Quản lý Khuyến mãi (Promotion)**:
    - Tạo mã giảm giá theo % hoặc theo số tiền cố định.
    - Thiết lập giới hạn lượt dùng và thời gian hiệu lực.

---

## 🌟 Đặc điểm nổi bật
- **Đồng bộ hóa dữ liệu nhất quán**: Tự động cập nhật kho ngay khi đặt hàng và cộng số lượt bán ngay khi giao dịch hoàn tất.
- **Giao diện Responsive**: Tương thích tốt trên cả Mobile, Tablet và Desktop.
- **UX UI Hiện đại**: Sử dụng Ant Design mang lại trải nghiệm chuyên nghiệp, mượt mà.
- **Bảo mật**: Bảo vệ các Route nhạy cảm cả phía Frontend (Guard) và Backend (Middleware).

---
*Dự án được bảo trì và phát triển bởi Team.*
