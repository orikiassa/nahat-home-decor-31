import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export const Route = createFileRoute("/wedding")({
  component: WeddingPage,
  head: () => ({
    meta: [
      { title: "יותם & סולל — הזמנה לחתונה" },
      {
        name: "description",
        content: "אנו מתכבדים להזמינכם לחגוג עמנו את יום נישואינו — יום חמישי, 20.8.2026",
      },
      { property: "og:title", content: "יותם & סולל — הזמנה לחתונה" },
      {
        property: "og:description",
        content: "אנו מתכבדים להזמינכם לחגוג עמנו את יום נישואינו",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300;400;500;700&family=Great+Vibes&display=swap",
      },
    ],
  }),
});

/* ---------- Event constants ---------- */

const WEDDING_DATE = new Date("2026-08-20T19:00:00+03:00");
const VENUE_NAME = "אולמי אלה";
const VENUE_ADDRESS = "נס ציונה";
const VENUE_QUERY = encodeURIComponent(`${VENUE_NAME}, ${VENUE_ADDRESS}`);
const WAZE_URL = `https://waze.com/ul?q=${VENUE_QUERY}&navigate=yes`;
const MAPS_URL = `https://maps.google.com/?q=${VENUE_QUERY}`;
const GOOGLE_CALENDAR_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=" +
  encodeURIComponent("החתונה של יותם וסולל 💍") +
  "&dates=20260820T190000/20260821T010000&ctz=Asia/Jerusalem" +
  "&details=" +
  encodeURIComponent("קבלת פנים 19:00 · חופה 20:00 · חוגגים עד אור הבוקר") +
  "&location=" +
  VENUE_QUERY;

const ICS_CONTENT = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//Yotam & Solel Wedding//HE",
  "BEGIN:VEVENT",
  "UID:yotam-solel-20260820@wedding",
  "DTSTAMP:20260701T000000Z",
  "DTSTART:20260820T160000Z",
  "DTEND:20260820T220000Z",
  "SUMMARY:החתונה של יותם וסולל 💍",
  `LOCATION:${VENUE_NAME}\\, ${VENUE_ADDRESS}`,
  "DESCRIPTION:קבלת פנים 19:00 · חופה 20:00",
  "END:VEVENT",
  "END:VCALENDAR",
].join("\r\n");
const ICS_HREF = `data:text/calendar;charset=utf-8,${encodeURIComponent(ICS_CONTENT)}`;

/* ---------- Reveal-on-scroll ---------- */

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("wed-reveal-visible");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="wed-reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------- Countdown ---------- */

function useCountdown(target: Date) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return null;
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
  };
}

function Countdown() {
  const time = useCountdown(WEDDING_DATE);
  const units = [
    { label: "ימים", value: time?.days },
    { label: "שעות", value: time?.hours },
    { label: "דקות", value: time?.minutes },
    { label: "שניות", value: time?.seconds },
  ];
  return (
    <div className="flex justify-center gap-3 md:gap-6" dir="rtl">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex w-20 flex-col items-center rounded-2xl border border-[#d9c49a]/60 bg-white/60 px-2 py-4 shadow-sm backdrop-blur-sm md:w-24 md:py-5"
        >
          <span className="wed-serif text-3xl font-medium tabular-nums text-[#7a6335] md:text-4xl">
            {unit.value === undefined ? "—" : String(unit.value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-xs tracking-widest text-[#a08c5f] md:text-sm">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Decorative bits ---------- */

function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center gap-4 text-[#c1a361]">
      <span className="h-px w-16 bg-gradient-to-l from-[#c1a361]/70 to-transparent md:w-28" />
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 21s-7.5-4.6-9.7-9.2C.7 8.4 2.7 5 6 5c2 0 3.4 1.1 4.2 2.4L12 10l1.8-2.6C14.6 6.1 16 5 18 5c3.3 0 5.3 3.4 3.7 6.8C19.5 16.4 12 21 12 21z"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
      <span className="h-px w-16 bg-gradient-to-r from-[#c1a361]/70 to-transparent md:w-28" />
    </div>
  );
}

function RingsIcon() {
  return (
    <svg
      width="52"
      height="36"
      viewBox="0 0 52 36"
      fill="none"
      aria-hidden="true"
      className="mx-auto text-[#c1a361]"
    >
      <circle cx="19" cy="20" r="13" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="33" cy="20" r="13" stroke="currentColor" strokeWidth="1.4" />
      <path d="M33 7l-3-5h6l-3 5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Schedule ---------- */

const SCHEDULE = [
  {
    time: "19:00",
    title: "קבלת פנים",
    description: "כוסית משהו קר, חיוכים גדולים ותחנות אוכל שוות במיוחד",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 3h8l-1 7a3 3 0 01-6 0L8 3z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M12 13v7m-4 1h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    time: "20:00",
    title: "חופה וקידושין",
    description: "הרגע הגדול — מתחת לשמיים, מוקפים בכל האנשים שאנחנו אוהבים",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 21s-7-4.3-9-8.5C1.5 9 3.4 6 6.4 6c1.8 0 3 1 3.8 2.2L12 10.6l1.8-2.4C14.6 7 15.8 6 17.6 6c3 0 4.9 3 3.4 6.5C19 16.7 12 21 12 21z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    ),
  },
  {
    time: "21:00",
    title: "חוגגים עד אור הבוקר",
    description: "רחבה פתוחה, מוזיקה טובה ואוכל שלא נגמר — תביאו נעליים נוחות",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 18V6l10-2v11M9 18a3 3 0 11-6 0 3 3 0 016 0zm10-3a3 3 0 11-6 0 3 3 0 016 0z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

/* ---------- RSVP form ---------- */

type RsvpStatus = "coming" | "not-coming";

function RsvpForm() {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("2");
  const [status, setStatus] = useState<RsvpStatus>("coming");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    try {
      localStorage.setItem(
        "wedding-rsvp",
        JSON.stringify({ name, guests, status, note, at: new Date().toISOString() }),
      );
    } catch {
      // localStorage unavailable — the confirmation screen is still shown
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-[#d9c49a]/60 bg-white/70 p-10 text-center shadow-sm backdrop-blur-sm">
        <RingsIcon />
        <h3 className="wed-serif mt-4 text-2xl font-medium text-[#5c4a24]">
          {status === "coming" ? `תודה ${name.trim()}! 🥂` : `תודה שעדכנתם אותנו, ${name.trim()}`}
        </h3>
        <p className="mt-3 leading-relaxed text-[#8a7649]">
          {status === "coming"
            ? "אישור ההגעה נקלט — אנחנו כבר סופרים את הימים. נתראה ברחבה!"
            : "חבל שלא תהיו איתנו, אבל מבטיחים לשמור לכם חתיכת עוגה. 🧡"}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md space-y-5 rounded-3xl border border-[#d9c49a]/60 bg-white/70 p-8 shadow-sm backdrop-blur-sm md:p-10"
    >
      <div className="space-y-2">
        <label htmlFor="rsvp-name" className="block text-sm font-medium text-[#5c4a24]">
          שם מלא
        </label>
        <input
          id="rsvp-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="למשל: משפחת כהן"
          className="w-full rounded-xl border border-[#d9c49a]/70 bg-white/80 px-4 py-2.5 text-[#5c4a24] placeholder:text-[#b3a071] focus:outline-none focus:ring-2 focus:ring-[#c1a361]/60"
        />
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-medium text-[#5c4a24]">האם תגיעו?</span>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { value: "coming", label: "מגיעים! 🎉" },
              { value: "not-coming", label: "לצערנו לא 😢" },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatus(option.value)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                status === option.value
                  ? "border-[#c1a361] bg-[#c1a361] text-white shadow-sm"
                  : "border-[#d9c49a]/70 bg-white/60 text-[#8a7649] hover:bg-[#f5ecd9]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {status === "coming" && (
        <div className="space-y-2">
          <label htmlFor="rsvp-guests" className="block text-sm font-medium text-[#5c4a24]">
            מספר אורחים
          </label>
          <select
            id="rsvp-guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full rounded-xl border border-[#d9c49a]/70 bg-white/80 px-4 py-2.5 text-[#5c4a24] focus:outline-none focus:ring-2 focus:ring-[#c1a361]/60"
          >
            {["1", "2", "3", "4", "5", "6", "7", "8"].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="rsvp-note" className="block text-sm font-medium text-[#5c4a24]">
          משהו שכדאי שנדע? (לא חובה)
        </label>
        <textarea
          id="rsvp-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="אלרגיות, מנה צמחונית, ברכה מרגשת..."
          className="w-full resize-none rounded-xl border border-[#d9c49a]/70 bg-white/80 px-4 py-2.5 text-[#5c4a24] placeholder:text-[#b3a071] focus:outline-none focus:ring-2 focus:ring-[#c1a361]/60"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-l from-[#c1a361] to-[#a8863f] px-6 py-3 font-medium text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[0.99]"
      >
        שליחת אישור הגעה
      </button>
    </form>
  );
}

/* ---------- Page ---------- */

function WeddingPage() {
  return (
    <div className="wed-page min-h-screen overflow-x-hidden bg-[#faf6ec] text-[#5c4a24]">
      <style>{`
        .wed-serif { font-family: "Frank Ruhl Libre", "Rubik", serif; }
        .wed-script { font-family: "Great Vibes", cursive; }
        .wed-page { background-image: radial-gradient(ellipse at top, #fdfaf2 0%, #faf6ec 55%, #f3ead6 100%); }
        .wed-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .wed-reveal-visible { opacity: 1; transform: translateY(0); }
        @keyframes wed-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(3deg); }
        }
        .wed-float { animation: wed-float 7s ease-in-out infinite; }
        @keyframes wed-fade-in {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .wed-hero-item { opacity: 0; animation: wed-fade-in 1s ease forwards; }
        @media (prefers-reduced-motion: reduce) {
          .wed-float, .wed-hero-item { animation: none; opacity: 1; }
          .wed-reveal { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      {/* Hero */}
      <header className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
        {/* floating petals */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {[
            { top: "12%", right: "8%", size: 22, delay: "0s" },
            { top: "24%", left: "10%", size: 16, delay: "1.5s" },
            { top: "62%", right: "14%", size: 18, delay: "3s" },
            { top: "72%", left: "16%", size: 24, delay: "2s" },
            { top: "40%", right: "28%", size: 12, delay: "4s" },
          ].map((petal, i) => (
            <svg
              key={i}
              className="wed-float absolute text-[#e3cf9e]"
              style={{
                ...petal,
                width: petal.size,
                height: petal.size,
                animationDelay: petal.delay,
              }}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2c3 4 6 6 6 10a6 6 0 11-12 0c0-4 3-6 6-10z" opacity="0.7" />
            </svg>
          ))}
        </div>

        <p
          className="wed-hero-item wed-script text-3xl text-[#c1a361] md:text-4xl"
          style={{ animationDelay: "0.1s" }}
          dir="ltr"
        >
          Save the Date
        </p>

        <div className="wed-hero-item mt-6" style={{ animationDelay: "0.3s" }}>
          <RingsIcon />
        </div>

        <h1
          className="wed-hero-item wed-serif mt-6 text-5xl font-medium leading-tight md:text-7xl"
          style={{ animationDelay: "0.5s" }}
        >
          יותם{" "}
          <span className="wed-script align-middle text-4xl text-[#c1a361] md:text-6xl">&</span>{" "}
          סולל
        </h1>

        <p
          className="wed-hero-item mt-6 max-w-xl text-lg leading-relaxed text-[#8a7649] md:text-xl"
          style={{ animationDelay: "0.7s" }}
        >
          מתרגשים להזמין אתכם לחגוג איתנו את היום שבו נהפוך למשפחה
        </p>

        <div className="wed-hero-item mt-8" style={{ animationDelay: "0.85s" }}>
          <OrnamentDivider />
        </div>

        <p
          className="wed-hero-item wed-serif mt-8 text-2xl text-[#7a6335] md:text-3xl"
          style={{ animationDelay: "1s" }}
        >
          יום חמישי · 20.8.2026 · ז׳ באלול תשפ״ו
        </p>
        <p className="wed-hero-item mt-2 text-[#a08c5f]" style={{ animationDelay: "1.1s" }}>
          {VENUE_NAME} · {VENUE_ADDRESS}
        </p>

        <div className="wed-hero-item mt-12 w-full" style={{ animationDelay: "1.25s" }}>
          <Countdown />
        </div>

        <a
          href="#rsvp"
          className="wed-hero-item mt-12 inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-[#c1a361] to-[#a8863f] px-8 py-3.5 font-medium text-white shadow-lg transition-transform hover:scale-105"
          style={{ animationDelay: "1.4s" }}
        >
          אישור הגעה
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 5v14m0 0l-6-6m6 6l6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </header>

      {/* Our story */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <OrnamentDivider />
            <h2 className="wed-serif mt-6 text-3xl font-medium md:text-4xl">הסיפור שלנו</h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-8 text-lg leading-relaxed text-[#8a7649]">
              הכל התחיל לפני חמש שנים, בערב קיץ אחד, כשיותם הזמין קפה וסולל קיבל בטעות את הכוס שלו.
              מאז — אלפי כוסות קפה, שלוש דירות שכורות, טיול גדול אחד בדרום אמריקה וכלב אחד בשם
              צ׳יפס. עכשיו הגיע הרגע להרים כוסית (לא של קפה) — ואנחנו רוצים אתכם לצידנו.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Schedule */}
      <section className="bg-white/50 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="text-center">
              <OrnamentDivider />
              <h2 className="wed-serif mt-6 text-3xl font-medium md:text-4xl">לוח הזמנים</h2>
            </div>
          </Reveal>
          <div className="relative mt-14 space-y-10 before:absolute before:inset-y-2 before:right-[27px] before:w-px before:bg-[#d9c49a]/70 md:before:right-1/2">
            {SCHEDULE.map((item, index) => (
              <Reveal key={item.time} delay={index * 150}>
                <div
                  className={`relative flex items-start gap-6 md:w-1/2 ${
                    index % 2 === 0
                      ? "md:me-auto md:flex-row-reverse md:pe-10 md:text-left"
                      : "md:ms-auto md:ps-10"
                  }`}
                >
                  <span
                    className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#d9c49a] bg-[#faf6ec] text-[#a8863f] shadow-sm ${
                      index % 2 === 0
                        ? "md:-me-7 md:translate-x-1/2"
                        : "md:-ms-7 md:-translate-x-1/2"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <span className="wed-serif text-xl font-medium text-[#a8863f]">
                      {item.time}
                    </span>
                    <h3 className="wed-serif mt-1 text-2xl font-medium">{item.title}</h3>
                    <p className="mt-2 leading-relaxed text-[#8a7649]">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <OrnamentDivider />
            <h2 className="wed-serif mt-6 text-3xl font-medium md:text-4xl">איך מגיעים?</h2>
            <p className="mt-6 text-lg text-[#8a7649]">
              {VENUE_NAME} · {VENUE_ADDRESS}
              <br />
              חניה חינם בשפע במקום 🚗
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href={WAZE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#c1a361] bg-white/70 px-7 py-3 font-medium text-[#7a6335] shadow-sm transition-colors hover:bg-[#f5ecd9]"
              >
                נווטו עם Waze
              </a>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#c1a361] bg-white/70 px-7 py-3 font-medium text-[#7a6335] shadow-sm transition-colors hover:bg-[#f5ecd9]"
              >
                Google Maps
              </a>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <a
                href={GOOGLE_CALENDAR_URL}
                target="_blank"
                rel="noreferrer"
                className="text-[#a8863f] underline-offset-4 hover:underline"
              >
                הוסיפו ליומן Google
              </a>
              <span className="text-[#d9c49a]">|</span>
              <a
                href={ICS_HREF}
                download="yotam-solel-wedding.ics"
                className="text-[#a8863f] underline-offset-4 hover:underline"
              >
                הורידו קובץ יומן (ICS)
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="bg-white/50 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <div className="text-center">
              <OrnamentDivider />
              <h2 className="wed-serif mt-6 text-3xl font-medium md:text-4xl">אישור הגעה</h2>
              <p className="mt-4 text-[#8a7649]">
                נשמח לדעת שאתם באים — זה עוזר לנו (ולקייטרינג) להתכונן כמו שצריך
              </p>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-10">
              <RsvpForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 pb-16 pt-10 text-center">
        <Reveal>
          <p className="wed-script text-3xl text-[#c1a361]" dir="ltr">
            Yotam &amp; Solel
          </p>
          <p className="mt-3 text-sm text-[#a08c5f]">מחכים לכם באהבה · 20.8.2026 · {VENUE_NAME}</p>
        </Reveal>
      </footer>
    </div>
  );
}
