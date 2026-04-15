import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/products/$productId"
      params={{ productId: product.id }}
      className="group block"
    >
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={800}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="font-display text-base font-medium text-foreground">
            {product.name}
          </h3>
          <p className="mt-1 text-lg font-bold text-accent">₪{product.price}</p>
        </div>
      </div>
    </Link>
  );
}
