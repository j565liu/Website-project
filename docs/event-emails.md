# Emailing guests about a gathering

Guests can tick **"Email me about upcoming gatherings."** when they register. Only guests who
ticked it **and** confirmed their email may be sent invitations. The website never sends these
emails itself: you choose who to invite and send from Resend, which handles unsubscribes.

This uses the same Resend account as the confirmation emails (see `docs/email-setup.md`).

## 1. See who can be invited

**In Neon** (Vercel → Storage → your database → Data Editor or Query):

```sql
select preferred_name, email, age_group, gender, gender_description, event_emails_consent_at
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
Use `age_group` (`millennials`, `gen_x`, `baby_boomers`) and `gender` to keep the room balanced;
guests who registered before these were asked have them empty.

## 3. Add them to Resend

Resend keeps one list of contacts under **Audience**, and you group them with **Segments**.

1. Resend → **Audience** → **Contacts** → **Add contacts**. Add the guests you chose in step 2,
   one by one or by importing a CSV with `email` and `first_name` columns. Put the preferred name
   in **First name** so the email can greet them. To get that CSV from Neon, run:

   ```sql
   select email, preferred_name as first_name
   from registrations
   where confirmed_at is not null
     and event_emails_consent_at is not null
   order by preferred_name;
   ```

2. Resend → **Audience** → **Segments** → create a segment for this gathering, e.g.
   "Evening Downtown, 26 Nov", and put the guests you chose in it.

The list in step 1 is the source of truth: only ever add people from it, and keep it current as
described in step 5.

## 4. Write and send the broadcast

Resend → **Broadcasts** → **Create**, send it to this gathering's segment, then write the email.

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

1. In Resend → **Audience** → **Contacts**, filter for unsubscribed contacts.
2. For each of them, and for anyone who asks you directly (reply, phone, in person), clear their
   choice in Neon so they are never picked again:

   ```sql
   update registrations
   set event_emails_consent_at = null
   where lower(email) = lower('guest@example.com');
   ```

If someone asks to be deleted entirely, delete their row from `registrations` and their contacts
from Resend.

## Who has reserved a place at a gathering

Guests reserve from each gathering's page on the site. To see the list for one gathering, run
this in Neon, with the event's `id` from `content/events.ts`:

```sql
select g.preferred_name, g.email, g.gender, g.age_group, g.phone, r.reserved_at
from event_reservations r
join registrations g on g.id = r.registration_id
where r.event_id = 'evening-downtown-2026-11'
  and r.cancelled_at is null
order by r.reserved_at;
```

Use it to send the location and any details before the evening (add these guests to a Resend
segment for this gathering). Emails about a place a guest reserved are fine to send to everyone
on this list, whether or not they ticked "Email me about upcoming gatherings".
