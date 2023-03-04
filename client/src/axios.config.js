import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ask-openai.onrender.com/",
});

export default axiosInstance;
