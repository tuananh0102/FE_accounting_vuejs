import axios from "axios";

const URL = "https://localhost:44331/api/v1";

const instance = axios.create({
  baseURL: URL,
  // timeout: 2000,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response?.data.Data) {
      throw error.response.data.ErrorMsgs;
    } else {
      throw error.response.data;
    }
  }
);

export default instance;
