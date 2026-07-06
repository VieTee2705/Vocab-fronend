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
    const data = (await this.api.get("/", { params })).data;
    
    // Sort array by lesson (e.g. Lesson 1, Lesson 2, Lesson 10...)
    if (Array.isArray(data)) {
      data.sort((a, b) => {
        if (a.title && b.title) {
          return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
        }
        return 0;
      });
    }
    
    return data;
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
