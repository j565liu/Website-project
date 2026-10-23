import Link from "next/link";
import { site } from "@/content/site";

type Props = {
  size?: "sm" | "lg";
  className?: string;
  withNote?: boolean;
  label?: string;
};

export function RegisterLink({ size = "lg", className = "", withNote = false, label = site.ctaLabel }: Props) {
  const sizing = size === "sm" ? "px-5 py-3.5" : "px-8 py-4";
  const link = (
    <Link
      href="/register"
      className={`label inline-block border border-gold text-ivory transition-colors duration-500 ease-luxe hover:bg-gold hover:text-background ${sizing} ${withNote ? "" : className}`}
    >
      {label}
    </Link>
  );
  if (!withNote) return link;
  return (
    <div className={className}>
      {link}
      <p className="mt-5 text-muted">{site.noInvitationNote}</p>
    </div>
  );
}
