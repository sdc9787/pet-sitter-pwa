import axios from "axios";

// Axios 인스턴스 생성
const instanceJson = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}`,
  timeout: 7000,
  headers: {
    "Content-Type": "application/json",
    "Content-Encoding": "charset=UTF-8",
  },
});

instanceJson.interceptors.request.use(
  (config) => {
    // 요청을 보내기 전에 토큰을 설정합니다.
    config.headers["Authorization"] = `${localStorage.getItem("Authorization")}`;
    config.headers["X-Refresh-Token"] = `${localStorage.getItem("refresh_token")}`;
    return config;
  },
  (error) => {
    // 요청 에러 처리를 진행합니다.
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
instanceJson.interceptors.response.use(
  (response) => {
    // 응답을 받았을 때 수행할 작업을 정의합니다.
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      //401 에러 발생시 헤더에 있는 access_token과 refresh_token을 localStorage에 저장
      localStorage.setItem("Authorization", error.response.headers.authorization);
      // 401 에러 발생시 재요청
      return instanceJson.request(error.config);
    }
    return Promise.reject(error);
  }
);

export default instanceJson;
