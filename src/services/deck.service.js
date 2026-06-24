import createApiClient from "./api.service";

/**
 * Quản lý các bộ từ vựng (Decks).
 */
class DeckService {
  constructor(baseUrl = "/api/decks") {
    this.api = createApiClient(baseUrl);
  }

  /**
   * Lấy tất cả các Deck. 
   * Có thể tuỳ biến logic nếu backend cho phép tìm theo creator_id hoặc public status.
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

  async deleteAll() {
    return (await this.api.delete("/")).data;
  }
}

export default new DeckService("/api/decks");
