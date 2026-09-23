# Email setup

The website sends three kinds of email, all automatically:

1. **Confirm your email**: a link the visitor presses to finish registering (expires in 48 hours).
2. **You're registered**: sent once they confirm.
3. **You're already registered**: sent if someone registers again with an email that is already confirmed.

Emails go out over **SMTP**, a standard that almost every email provider supports. Switching
provider means changing five settings; no code changes.

| Setting | What it is |
|---|---|
| `SMTP_HOST` | Your provider's mail server |
| `SMTP_PORT` | Usually `465` (or `587` where noted) |
| `SMTP_USER` | The login for that server |
| `SMTP_PASSWORD` | An app password or API key, **never** your normal password |
| `EMAIL_FROM` | The sender visitors see, e.g. `Ready to Mingle <hello@yourdomain.com>` |

If `SMTP_HOST` is empty, nothing is sent: each email is saved as a file in `.outbox/` instead.
That is how development and the automated tests work. **On the live site, `SMTP_HOST` must be set**,
or registrations will fail with a "something went wrong" message.

---

## Option A: an email account you already have (Google Workspace)

Best if you already have an address on your own domain, such as `hello@readytomingle.com`.
Google Workspace allows about 2,000 emails a day.

1. Turn on **2-Step Verification** for the account that will send the emails
   (Google Account → Security).
2. Create an **app password**: Google Account → Security → 2-Step Verification → App passwords.
   Name it "Website" and copy the 16-character password. (If you don't see this option, your
   Workspace admin needs to allow it.)
3. In Google Workspace Admin → Apps → Gmail → Authenticate email, make sure **DKIM** is turned on
   for your domain. This, along with SPF, keeps your emails out of spam folders.
4. Use these settings:

   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=hello@yourdomain.com
   SMTP_PASSWORD=<the 16-character app password, without spaces>
   EMAIL_FROM="Ready to Mingle <hello@yourdomain.com>"
   ```

`EMAIL_FROM` must be the same address as `SMTP_USER` (or an alias set up on that account),
otherwise Google rewrites the sender.

> **Microsoft 365 / Outlook:** use `SMTP_HOST=smtp.office365.com` and `SMTP_PORT=587`, with SMTP
> AUTH enabled for the mailbox by your admin. Microsoft is phasing out password-based SMTP, so
> check its current status first; if it is blocked, use Option B.

## Option B: Resend

Best if you don't have a business mailbox, or expect more volume. Free up to 3,000 emails a
month (100 a day).

1. Create an account at resend.com.
2. Go to **Domains → Add domain**, enter your domain, and add the DNS records it shows you
   (at your domain registrar, e.g. GoDaddy, Namecheap, Cloudflare). Wait until the domain shows
   as **Verified**; this usually takes minutes, occasionally a few hours.
3. Go to **API Keys → Create API key** with "Sending access". Copy it (it starts with `re_`).
4. Use these settings:

   ```
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=465
   SMTP_USER=resend
   SMTP_PASSWORD=<your re_ API key>
   EMAIL_FROM="Ready to Mingle <hello@yourdomain.com>"
   ```

   `EMAIL_FROM` can be any address on the domain you verified.

---

## Adding the settings to Vercel

1. Vercel dashboard → your project → **Settings → Environment Variables**.
2. Add each of the five settings above for the **Production** environment.
3. Redeploy (Deployments → ⋯ → Redeploy) so the new settings take effect.

To switch between Option A and Option B later, replace the five values and redeploy.

## Checking it works

1. Register on the live site with your own email address.
2. You should receive "Confirm your email for Ready to Mingle" within a minute.
3. If it lands in spam, finish the domain authentication step for your provider
   (DKIM for Google, the DNS records for Resend). A DMARC record helps too; your provider's
   dashboard explains how to add one.
4. If nothing arrives, check Vercel → your project → **Logs** for a line starting with
   `[register] Submission failed`; the message underneath says what the email server rejected.

Keep `SMTP_PASSWORD` private. If it is ever exposed, revoke it (delete the app password or API
key) and create a new one.
