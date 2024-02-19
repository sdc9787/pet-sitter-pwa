import useClickAnimation from "../Component/useClickAnimation";
import "../Styles/useClickAnimation.css";
import { useEffect, useRef } from "react";
import "./routes-Styles/home.css";
import axios from "axios";

function Home() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    axios
      .post(
        "https://port-0-test2-17xco2nlst1tgoh.sel5.cloudtype.app/api/user",
        { user_name: "문", user_age: 25, user_email: "john@example.com", is_korean: true },
        {
          headers: { "Content-Type": `application/json`, "Content-Encoding": `charset=utf-8` },
        }
      )
      .then((response) => {
        console.log("200", response.data);

        if (response.status === 200) {
          console.log("true");
        }
      })
      .catch((error) => console.log(error.response));
  });
  useClickAnimation(buttonRef, {
    color: "gray",
    size: 50,
    duration: 500,
    effectName: "ripple",
  });

  return (
    <>
      <div></div>
    </>
  );
}

export default Home;
