import Link from "next/link";
import { site } from "@/content/site";

type Props = {
  size?: "sm" | "lg";
  className?: string;
};

export function ApplyLink({ size = "lg", className = "" }: Props) {
  const sizing = size === "sm" ? "px-4 py-2.5" : "px-8 py-4";
  return (
    <Link
      href="/apply"
      className={`label inline-block border border-gold text-ivory transition-colors duration-500 ease-luxe hover:bg-gold hover:text-background ${sizing} ${className}`}
    >
      {site.applyLabel}
    </Link>
  );
}
