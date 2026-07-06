import axios from "axios";

const commonConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Ưu tiên dùng VITE_API_URL (trên Vercel). 
// Nếu không có, apiBaseUrl sẽ là chuỗi rỗng để tự động kết hợp với '/api/...' mồi cho Proxy ở local.
const apiBaseUrl = import.meta.env.VITE_API_URL || "";

export default (baseURL) => {
  return axios.create({
    baseURL: `${apiBaseUrl}${baseURL}`,
    ...commonConfig,
  });
};
