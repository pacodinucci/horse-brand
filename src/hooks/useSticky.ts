"use client";
import { useEffect, useState } from "react";

export function useSticky() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const triggerPoint = 80;
      setIsSticky(window.scrollY > triggerPoint);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isSticky;
}
