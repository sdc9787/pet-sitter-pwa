import useClickAnimation from "../Component/useClickAnimation";
import "../Styles/useClickAnimation.css";
import { useRef } from "react";
import "./routes-Styles/home.css";

function Home() {
  const buttonRef = useRef<HTMLButtonElement>(null);

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
