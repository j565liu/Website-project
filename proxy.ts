import { NextResponse, type NextRequest } from "next/server";
import { hasInvitation, INVITATION_COOKIE, isProtectedPath } from "@/lib/invitation";

// Sends visitors without a valid invitation cookie to the code page. Server Actions on these
// pages check the cookie again themselves, so this is not the only line of defence.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isProtectedPath(pathname) || hasInvitation(request.cookies.get(INVITATION_COOKIE)?.value)) {
    return NextResponse.next();
  }
  const url = new URL("/invitation", request.url);
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/events", "/register"],
};
