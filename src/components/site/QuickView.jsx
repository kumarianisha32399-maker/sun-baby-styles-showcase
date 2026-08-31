import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { inr, useStore } from "@/store/StoreProvider";
import Rating from "./Rating";

export default function QuickView({ product, onClose }) {
  const { addToCart } = useStore();
  const [size, setSize] = useState(product?.sizes?.[0]);
  const [color, setColor] = useState(product?.colors?.[0]);

  useEffect(() => {
    setSize(product?.sizes?.[0]);
    setColor(product?.colors?.[0]);
  }, [product]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-charcoal/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
      onClick={onClose}
    >
      <div
        className="soft-card max-h-[90vh] w-full max-w-3xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-[4/5] w-full rounded-2xl object-cover"
          />
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-2xl">{product.name}</h2>
              <button
                onClick={onClose}
                aria-label="Close quick view"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted"
              >
                ✕
              </button>
            </div>
            <Rating value={product.rating} reviews={product.reviews} size="lg" />
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold">{inr(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-muted-foreground line-through">
                    {inr(product.originalPrice)}
                  </span>
                  <span className="font-semibold text-coral">{product.discount}% OFF</span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{product.description}</p>

            <div>
              <p className="mb-1 text-sm font-bold">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-full border-2 px-3 py-1 text-sm font-semibold transition ${
                      size === s ? "border-coral bg-coral/15" : "border-border bg-surface"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm font-bold">Colour</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`rounded-full border-2 px-3 py-1 text-sm font-semibold transition ${
                      color === c ? "border-sky bg-sky/25" : "border-border bg-surface"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              <button
                className="btn-base btn-primary flex-1"
                onClick={() => {
                  addToCart(product, { size, color });
                  onClose();
                }}
              >
                Add to Cart
              </button>
              <Link
                to="/product/$id"
                params={{ id: String(product.id) }}
                onClick={onClose}
                className="btn-base btn-outline"
              >
                Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
