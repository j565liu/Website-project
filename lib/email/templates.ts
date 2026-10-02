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
  return message(to, `Confirm your email for the ${site.name} starter guide`, [
    { kind: "p", text: `Hello ${name},` },
    { kind: "p", text: `Thank you for requesting the ${site.name} starter guide. Please confirm this is your email address and we will send you the link.` },
    { kind: "button", label: "Confirm my email", href: confirmUrl },
    { kind: "p", text: "This link expires in 48 hours. If you did not request the guide, you can ignore this email and nothing further will happen." },
  ]);
}

export function guideEmail(to: string, name: string, guideUrl: string): EmailMessage {
  return message(to, `Your ${site.name} starter guide`, [
    { kind: "p", text: `Hello ${name},` },
    { kind: "p", text: "Your email is confirmed. Here is the starter guide to hosting a small gathering. Keep this email if you would like to come back to it." },
    { kind: "button", label: "Read the guide", href: guideUrl },
    { kind: "p", text: `This is the only email we will send you. To remove your details at any time, reply to this email or write to ${site.contactEmail}.` },
  ]);
}

export function guideAgainEmail(to: string, name: string, guideUrl: string): EmailMessage {
  return message(to, `Your ${site.name} starter guide link`, [
    { kind: "p", text: `Hello ${name},` },
    { kind: "p", text: `Someone, most likely you, just requested the ${site.name} starter guide with this email address. You have already confirmed it, so here is the link again.` },
    { kind: "button", label: "Read the guide", href: guideUrl },
    { kind: "p", text: `To remove your details, write to ${site.contactEmail}.` },
  ]);
}
