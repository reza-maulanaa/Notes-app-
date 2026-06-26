"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function PageEnter({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(ref.current, {
      opacity: 0,
      y: 14,
      duration: 0.45,
      ease: "power2.out",
    });
  }, []);

  return <div ref={ref}>{children}</div>;
}
