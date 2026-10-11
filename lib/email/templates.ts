import { site } from "@/content/site";
import type { EmailMessage } from "./send";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Block = { kind: "p"; text: string } | { kind: "button"; label: string; href: string };

function layout(blocks: Block[]): string {
  const body = blocks
    .map((block) =>
      block.kind === "p"
        ? `<p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#2a2a2a;">${escapeHtml(block.text)}</p>`
        : `<p style="margin:32px 0;"><a href="${escapeHtml(block.href)}" style="display:inline-block;padding:14px 28px;border:1px solid #b89b5e;background:#0a0a0a;color:#f5f3ef;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;">${escapeHtml(block.label)}</a></p>`,
    )
    .join("");
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f5f3ef;">
<div style="max-width:560px;margin:0 auto;padding:48px 32px;font-family:Georgia,'Times New Roman',serif;">
<p style="margin:0 0 40px;font-size:22px;color:#0a0a0a;">${escapeHtml(site.name)}</p>
${body}
<p style="margin:40px 0 0;padding-top:20px;border-top:1px solid #d8d3ca;font-size:12px;line-height:1.6;color:#6b665d;">${escapeHtml(site.name)} · ${escapeHtml(site.city)}</p>
</div></body></html>`;
}

function text(blocks: Block[]): string {
  return [
    ...blocks.map((block) => (block.kind === "p" ? block.text : `${block.label}: ${block.href}`)),
    `${site.name} · ${site.city}`,
  ].join("\n\n");
}

function message(to: string, subject: string, blocks: Block[]): EmailMessage {
  return { to, subject, text: text(blocks), html: layout(blocks) };
}

export function confirmationEmail(to: string, name: string, confirmUrl: string): EmailMessage {
  return message(to, `Confirm your email for ${site.name}`, [
    { kind: "p", text: `Hello ${name},` },
    { kind: "p", text: `Thank you for registering your interest in ${site.name}. Please confirm this is your email address.` },
    { kind: "button", label: "Confirm my email", href: confirmUrl },
    { kind: "p", text: "This link expires in 48 hours. If you did not register, you can ignore this email and nothing further will happen." },
  ]);
}

export function registeredEmail(to: string, name: string): EmailMessage {
  return message(to, `You're registered with ${site.name}`, [
    { kind: "p", text: `Hello ${name},` },
    { kind: "p", text: `Your email is confirmed and you are now registered with ${site.name}. Locations for our gatherings are shared with registered guests only.` },
    { kind: "p", text: `To update or remove your details at any time, reply to this email or write to ${site.contactEmail}.` },
  ]);
}

export function alreadyRegisteredEmail(to: string, name: string): EmailMessage {
  return message(to, `You're already registered with ${site.name}`, [
    { kind: "p", text: `Hello ${name},` },
    { kind: "p", text: `Someone, most likely you, just tried to register this email address with ${site.name}. You are already registered, so there is nothing more to do.` },
    { kind: "p", text: `If you would like to update your details, write to ${site.contactEmail}.` },
  ]);
}
