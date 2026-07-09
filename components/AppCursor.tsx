"use client";

import { usePathname } from "next/navigation";
import TargetCursor from "./TargetCursor";

const CURSOR_EXCLUDED_PREFIXES = ["/login", "/dashboard"];

export default function AppCursor() {
  const pathname = usePathname();

  if (CURSOR_EXCLUDED_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) {
    return null;
  }

  return (
    <TargetCursor
      spinDuration={2}
      hideDefaultCursor={true}
      parallaxOn={true}
      cursorColor="#ffffff"
      cursorColorOnTarget="#8A63F8"
    />
  );
}
