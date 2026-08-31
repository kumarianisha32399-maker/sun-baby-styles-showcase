import { Link } from "@tanstack/react-router";
import { inr, useStore } from "@/store/StoreProvider";
import Rating from "./Rating";

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const saved = inWishlist(product.id);

  return (
    <article className="group soft-card relative flex flex-col overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Link
          to="/product/$id"
          params={{ id: String(product.id) }}
          aria-label={product.name}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {product.discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-coral px-2.5 py-1 text-xs font-bold text-primary-foreground">
            {product.discount}% OFF
          </span>
        )}
        {product.newArrival && (
          <span className="absolute right-3 top-3 rounded-full bg-sunshine px-2.5 py-1 text-xs font-bold text-accent-foreground">
            New
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full text-lg shadow transition ${
            saved ? "bg-coral text-primary-foreground" : "bg-surface text-foreground"
          }`}
        >
          {saved ? "♥" : "♡"}
        </button>

        {onQuickView && (
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100 max-md:hidden">
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="btn-base btn-outline w-full py-2 text-sm"
            >
              Quick View
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {product.subcategory} • {product.sizes?.[0]}–{product.sizes?.[product.sizes.length - 1]}
        </p>
        <h3 className="font-display text-base leading-snug">
          <Link to="/product/$id" params={{ id: String(product.id) }} className="hover:text-coral">
            {product.name}
          </Link>
        </h3>
        <Rating value={product.rating} reviews={product.reviews} />
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-display text-lg font-bold">{inr(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {inr(product.originalPrice)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => addToCart(product)}
          className="btn-base btn-primary mt-2 w-full py-2 text-sm"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
