import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: "שאלות נפוצות — נחת Home" },
      { name: "description", content: "תשובות לשאלות הנפוצות ביותר על משלוחים, החזרות ותשלומים בנחת Home." },
      { property: "og:title", content: "שאלות נפוצות — נחת Home" },
    ],
  }),
});

const faqs = [
  {
    q: "כמה זמן לוקח המשלוח?",
    a: "המשלוח לוקח בין 10-18 ימי עסקים. ברגע שההזמנה נשלחת, תקבלו מספר מעקב למייל.",
  },
  {
    q: "האם אפשר להחזיר מוצר?",
    a: "בטח! אם המוצר לא מתאים, ניתן להחזיר אותו תוך 14 יום מרגע הקבלה. המוצר צריך להגיע באריזתו המקורית ובמצב תקין.",
  },
  {
    q: "אילו אמצעי תשלום מקבלים?",
    a: "אנחנו מקבלים כרטיסי אשראי (ויזה, מאסטרקארד, אמריקן אקספרס), PayPal ו-Bit.",
  },
  {
    q: "האם יש משלוח חינם?",
    a: "כן! בהזמנות מעל ₪300 המשלוח חינם לכל הארץ.",
  },
  {
    q: "מאיפה המוצרים?",
    a: "אנחנו עובדים עם יצרנים ומעצבים מכל העולם, ובוחרים כל מוצר בקפידה כדי להבטיח איכות ועיצוב ברמה הגבוהה ביותר.",
  },
];

function FaqPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-16 md:py-24">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">שאלות נפוצות</h1>
        <div className="mt-10 space-y-8">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-border pb-6">
              <h3 className="font-display text-lg font-semibold text-foreground">{faq.q}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
