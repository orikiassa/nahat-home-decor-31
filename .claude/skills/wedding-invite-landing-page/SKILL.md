---
name: wedding-invite-landing-page
description: Generate a polished, self-contained Hebrew/RTL wedding invitation page (countdown, timeline, map links, calendar add, WhatsApp RSVP) as a Claude Artifact. Use whenever asked to create/update a wedding invitation, save-the-date, or wedding landing page. Reuses a pre-built, pre-tested parchment/gold/olive design instead of redesigning from scratch — keep this fast and cheap, not a full design pass.
---

# Wedding invite landing page

A finished, screenshot-verified design lives at `template.html` next to this
file: a printed-invitation-card hero (double gold border, drifting canvas
leaves), live countdown, "our story", a 3-stop timeline, Waze/Google Maps +
Google Calendar/ICS links, and an RSVP form that hands off to WhatsApp
(there's no backend, so "submit" composes a `wa.me` message instead of
storing anything). Fonts (Frank Ruhl Libre + Great Vibes) are already
embedded as base64 `@font-face` data URIs — do not re-fetch or re-link
Google Fonts.

**Do not regenerate the design.** Do not `Read` `template.html` into your
context either — it's ~150KB, almost entirely embedded font data, and
reading it burns tokens for no benefit. Instead, treat it as an opaque file
and do a placeholder substitution on disk with a small Python/Bash script,
the same way you'd fill a mail-merge template. That's the entire point of
this skill: turning a ~50K-token design-and-build pass into a ~2K-token
fill-in-the-blanks pass.

## Steps

1. **Collect the inputs** below from the user's message. Ask only for what's
   missing and actually needed (names, date, venue at minimum) — don't
   interrogate for every field, most have sensible defaults.
2. **Compute the derived values** (ICS timestamps, slug, compact date) — see
   the Python snippet below.
3. **Substitute placeholders** with a script that reads and writes the file
   in one process (never through your own context):
   ```bash
   python3 - <<'PY'
   path = "<repo>/.claude/skills/wedding-invite-landing-page/template.html"
   out = "<scratch-dir>/wedding-invite.html"
   s = open(path, encoding="utf-8").read()
   values = { "NAME_A_HE": "...", "NAME_B_HE": "...", ... }
   for k, v in values.items():
       s = s.replace("{{%s}}" % k, v)
   open(out, "w", encoding="utf-8").write(s)
   PY
   ```
   After substitution, grep the output for any leftover `{{` to catch a
   missed token before publishing.
4. **Publish** with the `Artifact` tool (favicon: 💍). Do not run a dev
   server or screenshot pipeline for routine name/date/venue swaps — that
   verification already happened when this template was built. Only
   re-screenshot (Playwright, `/opt/pw-browsers/chromium`, module at
   `/opt/node22/lib/node_modules/playwright/index.mjs`) if you changed
   structural HTML/CSS, not for text substitutions.
5. If asked to also ship this as a route in an app (not just an Artifact),
   that's a separate, bigger task — check with the user before doing both.

## Placeholder reference

| Token | Example | Notes |
|---|---|---|
| `NAME_A_HE`, `NAME_B_HE` | `יותם`, `סולל` | Hebrew first names, no niqqud |
| `NAME_A_EN`, `NAME_B_EN` | `Yotam`, `Solel` | Latin transliteration, footer only |
| `DATE_ISO` | `2026-08-20T19:00:00+03:00` | Feeds the live countdown |
| `DATE_HE_LINE` | `יום חמישי · 20.8.2026 · ז׳ באלול תשפ״ו` | Day name + date; Hebrew date optional, omit the `·` segment if unknown |
| `DATE_SHORT` | `20.8.2026` | Footer + WhatsApp message |
| `DATE_COMPACT` | `20260820` | For the ICS UID, no separators |
| `VENUE_NAME` | `אולמי אלה` | |
| `VENUE_CITY` | `נס ציונה` | |
| `RECEPTION_TIME` | `19:00` | |
| `SCHEDULE_SUMMARY` | `קבלת פנים 19:00 · חופה 20:00 · חוגגים עד אור הבוקר` | Goes into the calendar event description |
| `STORY_TEXT` | free text, 2–4 sentences | Ask the couple for their real story; never invent specifics as if true — a generic placeholder is fine only if they explicitly want one |
| `INVITE_LINE` | `מתרגשים להזמין אתכם לחגוג איתנו את היום שבו נהפוך למשפחה` | Reasonable default, offer to personalize |
| `WHATSAPP_NUMBER` | `972501234567` | Digits only, country code, no `+`/`00`. Leave the literal empty string `""` if not provided — the RSVP button still works, it just opens WhatsApp's contact picker instead of a fixed chat |
| `SLUG` | `yotam-solel` | Latin, hyphenated, used in the `.ics` filename and UID |
| `DTSTAMP_UTC`, `DTSTART_UTC`, `DTEND_UTC` | `20260701T000000Z`, `20260820T160000Z`, `20260820T220000Z` | ICS format `YYYYMMDDTHHMMSSZ` in UTC — compute from `DATE_ISO` (start = reception time; end = start + ~6h is a reasonable default; DTSTAMP = now) |

Compute the UTC/derived fields instead of asking the user for them:
```python
from datetime import datetime, timedelta, timezone

local = datetime.fromisoformat("2026-08-20T19:00:00+03:00")  # DATE_ISO
dtstart = local.astimezone(timezone.utc)
dtend = dtstart + timedelta(hours=6)
dtstamp = datetime.now(timezone.utc)

fmt = lambda d: d.strftime("%Y%m%dT%H%M%SZ")
DTSTART_UTC, DTEND_UTC, DTSTAMP_UTC = fmt(dtstart), fmt(dtend), fmt(dtstamp)
DATE_COMPACT = local.strftime("%Y%m%d")
```

## What's intentionally NOT parametrized

The three timeline stops (קבלת פנים / חופה וקידושין / ריקודים) and the RSVP
form copy are left as good defaults in the template — most weddings follow
that shape. If a couple wants a different running order or extra sections
(kids' corner, dress code, gift/registry note), edit `template.html`'s copy
directly for that one run rather than adding more tokens — don't over-
engineer the template for one-off requests.
