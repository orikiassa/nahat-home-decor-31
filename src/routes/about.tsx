import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "עלינו — נחת Home" },
      { name: "description", content: "הסיפור מאחורי נחת Home — חנות עיצוב הבית המינימליסטית מישראל." },
      { property: "og:title", content: "עלינו — נחת Home" },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-16 md:py-24">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">עלינו</h1>
        <div className="mt-8 space-y-6 leading-relaxed text-muted-foreground">
          <p>
            נחת Home נוסדה מתוך תשוקה לעיצוב פנים פשוט, חם ונגיש. אנחנו מאמינים שהבית הוא
            המקום הכי חשוב בעולם, והוא מגיע להיראות ולהרגיש בדיוק ככה.
          </p>
          <p>
            כל מוצר בחנות שלנו עובר תהליך בחירה קפדני. אנחנו מחפשים פריטים שמשלבים
            בין אסתטיקה לפונקציונליות — דברים שגם יפים וגם שימושיים.
          </p>
          <p>
            הלקוחות שלנו הם צעירים ישראלים שאוהבים עיצוב, עוקבים אחרי טרנדים ורוצים
            בית שנראה כמו הפיד שלהם באינסטגרם. אנחנו כאן בשבילם.
          </p>
          <p>
            הצטרפו למשפחת נחת — כי הבית שלך מגיע להרגיש טוב. 🧡
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
