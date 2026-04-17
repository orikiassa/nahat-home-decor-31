import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useState, useEffect } from "react";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$handle")({
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        if (data?.data?.productByHandle) {
          setProduct(data.data.productByHandle);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [handle]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">המוצר לא נמצא</h1>
          <Link to="/" className="mt-4 inline-block text-accent hover:underline">
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIdx]?.node;
  const imageUrl = product.images.edges[0]?.node.url;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("נוסף לסל!");
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <Link to="/" className="mb-8 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← חזרה לחנות
        </Link>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-lg">
            {imageUrl ? (
              <img src={imageUrl} alt={product.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex aspect-square items-center justify-center bg-muted text-muted-foreground">
                אין תמונה
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              {product.title}
            </h1>
            <p className="mt-4 text-3xl font-bold text-accent">
              ₪{parseFloat(selectedVariant?.price.amount || "0").toFixed(0)}
            </p>

            {/* Variant selector */}
            {product.variants.edges.length > 1 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-foreground">בחרו גרסה:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map((v, idx) => (
                    <button
                      key={v.node.id}
                      onClick={() => setSelectedVariantIdx(idx)}
                      className={`rounded-full border px-4 py-2 text-sm transition-all ${
                        idx === selectedVariantIdx
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border text-foreground hover:border-accent"
                      } ${!v.node.availableForSale ? "opacity-40 line-through" : ""}`}
                      disabled={!v.node.availableForSale}
                    >
                      {v.node.selectedOptions.map((o) => o.value).join(" / ")}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-6 leading-relaxed text-muted-foreground">
              {product.description.split("Product Description")[0].trim()}
            </p>

            <button
              onClick={handleAddToCart}
              disabled={isLoading || !selectedVariant?.availableForSale}
              className="mt-8 w-full rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50 md:w-auto"
            >
              {isLoading ? (
                <Loader2 className="mx-auto h-5 w-5 animate-spin" />
              ) : !selectedVariant?.availableForSale ? (
                "אזל מהמלאי"
              ) : (
                "הוסיפו לסל"
              )}
            </button>

            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <span>🚚</span>
              <span>משלוח: 10-18 ימי עסקים</span>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
