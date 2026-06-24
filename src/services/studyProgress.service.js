import createApiClient from "./api.service";

/**
 * Quản lý tiến độ học tập (Study Progress) của người dùng với các từ vựng.
 * Model này ở backend sẽ xử lý Spaced Repetition, frontend sẽ tương tác với nó thông qua service này.
 */
class StudyProgressService {
  constructor(baseUrl = "/api/study-progress") {
    this.api = createApiClient(baseUrl);
  }

  /**
   * Lấy danh sách tiến trình, có thể lấy theo user_id, status (learning, mastered)
   * hoặc các từ vựng có next_review_date đến hạn.
   * @param {Object} params - Tham số bộ lọc
   */
  async getAll(params = {}) {
    return (await this.api.get("/", { params })).data;
  }

  /**
   * Lấy ra danh sách các từ vựng cần ôn tập ngay hôm nay.
   * Đây là một function mở rộng gọi endpoint API cụ thể.
   * @param {String} userId
   */
  async getDueReviews(userId) {
    return (await this.api.get(`/due/${userId}`)).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new StudyProgressService("/api/study-progress");
