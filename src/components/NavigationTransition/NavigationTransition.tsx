"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function NavigationTransition() {
  const pathname = usePathname();
  const isFirst = useRef(true);
  const [show, setShow] = useState(false);

  console.log("NavigationTransition mounted");
  console.log("pathname changed", pathname);
  console.log("show", show);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    console.log("pathname effect fired", pathname);
    setShow(true);

    const t = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(t);
  }, [pathname]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "red",
        opacity: 1,
      }}
      aria-hidden="true"
    />
  );
}
