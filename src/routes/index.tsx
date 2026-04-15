import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import heroImage from "@/assets/hero-home.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "נחת Home — עיצוב הבית שלך" },
      { name: "description", content: "חנות עיצוב הבית המינימליסטית. מוצרים נבחרים שישדרגו כל חלל." },
      { property: "og:title", content: "נחת Home — עיצוב הבית שלך" },
      { property: "og:description", content: "חנות עיצוב הבית המינימליסטית. מוצרים נבחרים שישדרגו כל חלל." },
    ],
  }),
});

function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="בית מעוצב"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/30" />
        </div>
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl items-center px-4">
          <div className="max-w-lg">
            <h1 className="font-display text-4xl font-bold leading-tight text-background md:text-5xl lg:text-6xl">
              לבית שלך מגיע להרגיש טוב
            </h1>
            <p className="mt-4 text-lg text-background/80">
              מוצרי עיצוב נבחרים שמביאים נחת לכל חלל
            </p>
            <a
              href="#products"
              className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-base font-medium text-accent-foreground transition-all hover:brightness-110"
            >
              לקניה
            </a>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-border bg-card py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 px-4 text-center">
          {[
            { icon: "🚚", label: "משלוח מהיר" },
            { icon: "↩️", label: "החזרה קלה" },
            { icon: "🔒", label: "תשלום מאובטח" },
          ].map((badge) => (
            <div key={badge.label} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-sm font-medium text-foreground">{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-2xl font-bold text-foreground md:text-3xl">
            המוצרים שלנו
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-sm text-muted-foreground">
            כל מוצר נבחר בקפידה כדי להביא סטייל ונוחות לבית שלך
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">
            הסיפור שלנו
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            נחת Home נולדה מתוך אהבה לעיצוב פשוט וחם. אנחנו מאמינים שהבית צריך
            להרגיש כמו חיבוק — מקום שמזמין מנוחה, השראה ושלווה. כל מוצר שאנחנו
            בוחרים עובר קורציה קפדנית כדי שתקבלו רק את הטוב ביותר.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
