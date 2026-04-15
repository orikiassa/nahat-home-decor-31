import { Link } from "@tanstack/react-router";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const firstVariant = product.node.variants.edges[0]?.node;
  const imageUrl = product.node.images.edges[0]?.node.url;
  const price = product.node.priceRange.minVariantPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant) return;
    await addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    });
    toast.success("נוסף לסל!");
  };

  return (
    <div className="group block">
      <Link to="/product/$handle" params={{ handle: product.node.handle }}>
        <div className="overflow-hidden rounded-lg bg-card">
          <div className="aspect-square overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.node.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                אין תמונה
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-display text-base font-medium text-foreground">
              {product.node.title}
            </h3>
            <p className="mt-1 text-lg font-bold text-accent">
              ₪{parseFloat(price.amount).toFixed(0)}
            </p>
          </div>
        </div>
      </Link>
      <button
        onClick={handleAddToCart}
        disabled={isLoading || !firstVariant}
        className="mt-2 w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "הוסיפו לסל"}
      </button>
    </div>
  );
}
