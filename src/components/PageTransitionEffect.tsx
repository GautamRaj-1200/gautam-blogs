"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const PageTransitionEffect = () => {
  const pathname = usePathname();

  useEffect(() => {
    const body = document.querySelector("body");
    if (body?.classList.contains("page-transition")) {
      body.classList.remove("page-transition");
    }
  }, [pathname]);

  return null;
};

export default PageTransitionEffect;
