import axios from "axios";

function Test() {
  const handleLogin = () => {
    console.log(123);
    const formData = new FormData();
    formData.append("username", "tester10@naver.com");
    formData.append("pasword", "123456a");

    axios
      .post(`${import.meta.env.VITE_APP_API_URL}/login`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Content-Encoding": "charset=utf-8",
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div>
      <button onClick={handleLogin}>전송</button>
    </div>
  );
}

export default Test;
