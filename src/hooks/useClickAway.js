import { useEffect, useRef } from "react";

const useClickAway = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClickAway = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickAway);
    document.addEventListener("touchstart", handleClickAway);

    return () => {
      document.removeEventListener("mousedown", handleClickAway);
      document.removeEventListener("touchstart", handleClickAway);
    };
  }, [callback]);

  return ref;
};

export default useClickAway;
