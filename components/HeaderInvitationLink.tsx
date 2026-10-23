"use client";

import { usePathname } from "next/navigation";
import { showsInvitationButton } from "@/content/site";
import { RegisterLink } from "./RegisterLink";

export function HeaderInvitationLink() {
  return showsInvitationButton(usePathname()) ? <RegisterLink size="sm" /> : null;
}
