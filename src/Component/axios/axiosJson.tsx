import axios from "axios";

// Axios 인스턴스 생성
const instanceJson = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}`,
  timeout: 1000,
  headers: {
    Authorization: `${localStorage.getItem("Authorization")}`,
    refresh_token: `${localStorage.getItem("refresh_token")}`,
    "Content-Type": "application/json",
    "Content-Encoding": "charset=UTF-8",
  },
});

// 응답 인터셉터 설정
instanceJson.interceptors.response.use(
  (response) => {
    // 응답을 받았을 때 수행할 작업을 정의합니다.
    return response;
  },
  (error) => {
    // 응답이 실패했을 때 수행할 작업을 정의합니다.
    return Promise.reject(error);
  }
);

export default instanceJson;
