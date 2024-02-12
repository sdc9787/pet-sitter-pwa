import { useEffect } from "react";

interface ClickAnimationConfig {
  size?: number;
  color?: string;
  duration?: number;
  effectName?: string;
}

export const UseClickAnimation = (element: any, config: ClickAnimationConfig) => {
  const { size = 100, color = "#fff", duration = 800, effectName = "ripple" } = config;

  useEffect(() => {
    const applyContainerProperties = () => {
      if (element.current) {
        element.current.classList.add("effect-container", effectName);
      }
    };

    const applyStyles = (e: MouseEvent) => {
      if (element.current) {
        const { offsetX, offsetY } = e;
        const sizeOffset = size / 2;
        const { style } = element.current;

        style.setProperty("--effect-duration", `${duration}ms`);
        style.setProperty("--effect-top", `${offsetY - sizeOffset}px`);
        style.setProperty("--effect-left", `${offsetX - sizeOffset}px`);
        style.setProperty("--effect-height", `${size}px`);
        style.setProperty("--effect-width", `${size}px`);
        style.setProperty("--effect-color", color);
      }
    };

    const onClick = (e: MouseEvent) => {
      if (element.current) {
        element.current.classList.remove("active");
        applyStyles(e);
        element.current.classList.add("active");
      }
    };

    // Apply the styles and classname to the element
    applyContainerProperties();

    // Add the event listener on mount
    if (element.current) {
      element.current.addEventListener("mouseup", onClick);
    }

    // Needed for referencing the ref in the return function
    const cleanupRef = element.current;

    return () => {
      if (cleanupRef) {
        cleanupRef.removeEventListener("mouseup", onClick);
      }
    };
  }, [color, duration, effectName, element, size]);
};

export default UseClickAnimation;
