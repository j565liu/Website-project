# Emailing guests about a gathering

Guests can tick **"Email me about upcoming gatherings."** when they register. Only guests who
ticked it **and** confirmed their email may be sent invitations. The website never sends these
emails itself: you choose who to invite and send from Resend, which handles unsubscribes.

This uses the same Resend account as the confirmation emails (see `docs/email-setup.md`).

## 1. See who can be invited

**In Neon** (Vercel → Storage → your database → Data Editor or Query):

```sql
select preferred_name, email, event_emails_consent_at
from registrations
where confirmed_at is not null
  and event_emails_consent_at is not null
order by preferred_name;
```

**Or as a spreadsheet**, on a computer with the project set up:

```sh
npm run export:registrations -- --status=event-emails
```

The CSV's "Event emails" column says Yes or No for everyone, if you export with `--status=all`.

Never add anyone to a mailing who isn't on this list.

## 2. Choose who to invite this time

From that list, pick the guests you want for this gathering. You don't have to invite everyone.

## 3. Add them to Resend

1. Resend → **Audiences** → create an audience for this gathering, e.g. "Supper, 13 Nov".
2. Add only the guests you chose in step 2 (one by one, or import a CSV with `email` and
   `first_name` columns). Put the preferred name in **First name** so the email can greet them.

The list in step 1 is the source of truth: only ever add people from it, and keep it current as
described in step 5.

## 4. Write and send the broadcast

Resend → **Broadcasts** → **Create**, choose the audience, then write the email.

Every invitation must include (Canada's anti-spam law, CASL):

- **Who it's from:** `Ready to Mingle` as the sender name, sent from your `readytomingle.ca`
  address.
- **A mailing address** for Ready to Mingle in the footer (a PO box is fine).
- **An unsubscribe link.** Insert Resend's unsubscribe link in the footer, then check it appears
  in the preview before sending.

Keep the tone of the website: understated, no exclamation marks, and never publish the venue
address in an email that could be forwarded; share it only with confirmed attendees.

Send yourself a test first, then send.

## 5. When someone opts out

Do this after every broadcast, so the list in step 1 stays correct:

1. In Resend, open the broadcast's audience and look for contacts marked **Unsubscribed**.
2. For each of them, and for anyone who asks you directly (reply, phone, in person), clear their
   choice in Neon so they are never picked again:

   ```sql
   update registrations
   set event_emails_consent_at = null
   where lower(email) = lower('guest@example.com');
   ```

If someone asks to be deleted entirely, delete their row from `registrations` and their contacts
from Resend.
