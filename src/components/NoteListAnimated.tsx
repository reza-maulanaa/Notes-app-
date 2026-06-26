"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function NoteListAnimated({ children }: { children: React.ReactNode }) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const items = listRef.current?.querySelectorAll("li");
    if (!items || items.length === 0) return;

    gsap.from(items, {
      opacity: 0,
      y: 18,
      duration: 0.45,
      stagger: 0.055,
      ease: "power2.out",
      delay: 0.15,
    });
  }, []);

  return (
    <ul ref={listRef} style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {children}
    </ul>
  );
}
