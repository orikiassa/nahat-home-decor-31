import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getProduct } from "@/lib/products";

export const Route = createFileRoute("/products/$productId")({
  component: ProductPage,
  head: ({ params }) => {
    const product = getProduct(params.productId);
    return {
      meta: [
        { title: product ? `${product.name} — נחת Home` : "מוצר לא נמצא" },
        { name: "description", content: product?.description ?? "" },
        { property: "og:title", content: product ? `${product.name} — נחת Home` : "מוצר לא נמצא" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center text-center">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">המוצר לא נמצא</h1>
        <Link to="/" className="mt-4 inline-block text-accent hover:underline">חזרה לדף הבית</Link>
      </div>
    </div>
  ),
});

function ProductPage() {
  const { productId } = Route.useParams();
  const product = getProduct(productId);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">המוצר לא נמצא</h1>
          <Link to="/" className="mt-4 inline-block text-accent hover:underline">חזרה לדף הבית</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <Link to="/" className="mb-8 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← חזרה לחנות
        </Link>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              width={800}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-3xl font-bold text-accent">₪{product.price}</p>
            <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>
            <button className="mt-8 w-full rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-all hover:brightness-110 md:w-auto">
              הוסיפו לסל
            </button>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <span>🚚</span>
              <span>משלוח: {product.shippingDays}</span>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
