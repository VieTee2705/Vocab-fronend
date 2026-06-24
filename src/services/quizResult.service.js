import createApiClient from "./api.service";

/**
 * Quản lý kết quả sau khi thực hiện Quiz (Quiz Results).
 */
class QuizResultService {
  constructor(baseUrl = "/api/quiz-results") {
    this.api = createApiClient(baseUrl);
  }

  /**
   * Lấy lịch sử làm bài, có thể truyền tham số user_id để filter cho 1 user.
   */
  async getAll(params = {}) {
    return (await this.api.get("/", { params })).data;
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

export default new QuizResultService("/api/quiz-results");
