import createApiClient from "./api.service";

/**
 * Lớp UserService cung cấp các phương thức giao tiếp với API backend quản lý User.
 * Áp dụng ES Modules (import/export) và Class-based structure để đóng gói (Encapsulation).
 */
class UserService {
  constructor(baseUrl = "/api/users") {
    // Khởi tạo một đối tượng Axios (instance) với baseURL được truyền vào.
    // Điều này giúp tự động nối các path ở phía dưới (ví dụ "/", "/:id") vào baseURL.
    this.api = createApiClient(baseUrl);
  }

  /**
   * Lấy danh sách tất cả Users.
   * @returns {Promise<Array>}
   */
  async getAll() {
    // Cú pháp đặc biệt: await this.api.get("/") sẽ đợi phản hồi từ server.
    // Dữ liệu thực sự trả về từ Axios nằm trong thuộc tính `.data`, 
    // vì vậy ta truy xuất trực tiếp để trả về đúng cấu trúc mong muốn.
    return (await this.api.get("/")).data;
  }

  /**
   * Tạo mới một User.
   * @param {Object} data - Dữ liệu user.
   * @returns {Promise<Object>}
   */
  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  /**
   * Lấy chi tiết User theo ID.
   * @param {String} id
   */
  async get(id) {
    // Sử dụng Template Literals (dấu backtick ``) cho phép nhúng trực tiếp biến id (thông qua cú pháp ${id}) vào chuỗi mà không cần dùng phép cộng (+).
    return (await this.api.get(`/${id}`)).data;
  }

  /**
   * Cập nhật thông tin một User.
   * @param {String} id 
   * @param {Object} data 
   */
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  /**
   * Xóa một User.
   * @param {String} id 
   */
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  /**
   * Xóa tất cả Users (Cẩn thận khi dùng).
   */
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }
}

// Export trực tiếp một Instance (đối tượng cụ thể) - áp dụng Singleton Pattern.
// Cách này đảm bảo toàn bộ ứng dụng dùng chung một phiên bản UserService duy nhất.
export default new UserService("/api/users");
