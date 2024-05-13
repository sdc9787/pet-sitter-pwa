import axios from "axios";

// Axios 인스턴스 생성
const instanceMultipart = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}`,
  timeout: 1000,
  headers: {
    Authorization: `${localStorage.getItem("Authorization")}`,
    refresh_token: `${localStorage.getItem("refresh_token")}`,
    "Content-Type": "multipart/form-data",
    "Content-Encoding": "charset=UTF-8",
  },
});

// 응답 인터셉터 설정
instanceMultipart.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instanceMultipart;
