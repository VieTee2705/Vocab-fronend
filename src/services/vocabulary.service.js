import createApiClient from "./api.service";

/**
 * Quản lý các lệnh gọi API liên quan đến Từ Vựng (Vocabulary).
 */
class VocabularyService {
  constructor(baseUrl = "/api/vocabularies") {
    this.api = createApiClient(baseUrl);
  }

  /**
   * Lấy danh sách tất cả từ vựng, có hỗ trợ tham số truy vấn (query parameters).
   * VD: Có thể truyền vào tag hoặc loại từ.
   * @param {Object} params - Các truy vấn (VD: { tags: "TOEIC" })
   */
  async getAll(params = {}) {
    // Cú pháp đặc biệt: truyền tham số params qua object cấu hình axios { params }
    // Axios sẽ tự động serialize thành URL query: /api/vocabularies?tags=TOEIC
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

  async deleteAll() {
    return (await this.api.delete("/")).data;
  }
}

export default new VocabularyService("/api/vocabularies");
