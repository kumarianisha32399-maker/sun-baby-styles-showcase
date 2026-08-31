import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import SiteLayout from "./SiteLayout";
import Breadcrumbs from "./Breadcrumbs";
import ProductCard from "./ProductCard";
import Rating from "./Rating";
import { inr, useStore } from "@/store/StoreProvider";

const trust = [
  { icon: "📲", label: "Easy UPI Payment" },
  { icon: "✅", label: "Quality Checked Products" },
  { icon: "🤝", label: "Hassle-Free Shopping" },
  { icon: "🏬", label: "Store Pickup Available" },
];

export default function ProductDetailPage({ id }) {
  const { products, categories, addToCart, toggleWishlist, inWishlist, toast } = useStore();
  const navigate = useNavigate();
  const product = products.find((p) => String(p.id) === String(id));

  const [size, setSize] = useState(product?.sizes?.[0]);
  const [color, setColor] = useState(product?.colors?.[0]);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [pincode, setPincode] = useState("");
  const [pinResult, setPinResult] = useState(null);

  const related = useMemo(
    () =>
      product
        ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
        : [],
    [products, product],
  );

  if (!product) {
    return (
      <SiteLayout>
        <div className="container-x grid place-items-center gap-4 py-24 text-center">
          <span className="text-5xl">🧦</span>
          <h1 className="font-display text-2xl font-bold">This product is no longer available</h1>
          <Link to="/shop" className="btn-base btn-primary px-6 py-2.5">
            Continue Shopping
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const category = categories.find((c) => c.slug === product.category);
  const gallery = [product.image, category?.image, product.image].filter(Boolean);
  const saved = inWishlist(product.id);

  const checkPin = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setPinResult({ ok: false, text: "Please enter a valid 6-digit pincode." });
      return;
    }
    const ok = pincode.startsWith("41");
    setPinResult(
      ok
        ? { ok: true, text: `Delivery available for ${pincode} in 2–4 days. Store pickup today.` }
        : { ok: false, text: `We currently deliver around Pune. Call us for ${pincode}.` },
    );
  };

  return (
    <SiteLayout>
      <Breadcrumbs
        items={[
          { label: "Shop", to: "/shop" },
          category
            ? { label: category.name, to: "/category/$category", params: { category: category.slug } }
            : { label: "Products" },
          { label: product.name },
        ]}
      />

      <div className="container-x grid gap-10 py-8 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-3xl bg-muted">
            <img
              src={gallery[activeImage]}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="mt-3 flex gap-3">
            {gallery.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
                className={`h-20 w-16 overflow-hidden rounded-xl border-2 transition ${
                  activeImage === i ? "border-coral" : "border-border"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {category?.name} • {product.subcategory}
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <Rating value={product.rating} size="lg" />
            <span className="text-sm text-muted-foreground">{product.reviews} reviews</span>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="font-display text-3xl font-extrabold">{inr(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {inr(product.originalPrice)}
                </span>
                <span className="rounded-full bg-mint/40 px-2.5 py-1 text-xs font-bold">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

          <Section title="Select Size">
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition ${
                    size === s ? "border-coral bg-coral/15 text-coral" : "border-border hover:border-coral/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Select Colour">
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
                    color === c ? "border-coral bg-coral/15 text-coral" : "border-border hover:border-coral/50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Quantity">
            <div className="inline-flex items-center rounded-full border-2 border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                className="px-4 py-2 text-lg font-bold"
              >
                −
              </button>
              <span className="min-w-10 text-center font-bold">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((n) => Math.min(10, n + 1))}
                className="px-4 py-2 text-lg font-bold"
              >
                +
              </button>
            </div>
            <span className="ml-3 text-sm text-muted-foreground">
              {product.stock > 5 ? "In stock" : `Only ${product.stock} left`}
            </span>
          </Section>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => addToCart(product, { size, color, qty })}
              className="btn-base btn-primary flex-1 px-6 py-3"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart(product, { size, color, qty });
                navigate({ to: "/checkout" });
              }}
              className="btn-base btn-accent flex-1 px-6 py-3"
            >
              Buy Now
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className="btn-base btn-outline px-5 py-3"
            >
              {saved ? "♥ Saved" : "♡ Wishlist"}
            </button>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="soft-card mt-6 p-5">
            <h2 className="font-display text-lg font-bold">Product Information</h2>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <Info label="Fabric" value={product.fabric} />
              <Info label="Fit" value={product.fit} />
              <Info label="Wash Care" value={product.washCare} />
              <Info label="Country of Origin" value={product.origin} />
              <Info label="Age Group" value={product.ageGroup.toUpperCase()} />
              <Info label="SKU" value={product.sku} />
            </dl>
          </div>

          <form onSubmit={checkPin} className="soft-card mt-5 p-5">
            <h2 className="font-display text-lg font-bold">Check Delivery</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your pincode to check delivery availability.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="411014"
                aria-label="Pincode"
                className="w-full rounded-full border-2 border-border bg-background px-4 py-2 text-sm outline-none"
              />
              <button type="submit" className="btn-base btn-outline px-5 py-2 text-sm">
                Check
              </button>
            </div>
            {pinResult && (
              <p
                className={`mt-3 text-sm font-semibold ${
                  pinResult.ok ? "text-foreground" : "text-destructive"
                }`}
              >
                {pinResult.text}
              </p>
            )}
          </form>

          <ul className="mt-5 grid grid-cols-2 gap-3 text-sm font-semibold">
            {trust.map((t) => (
              <li key={t.label} className="flex items-center gap-2 rounded-2xl bg-muted p-3">
                <span aria-hidden="true">{t.icon}</span>
                {t.label}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => toast("Size guide is available at the store counter", "info")}
            className="mt-4 text-sm font-semibold text-coral hover:underline"
          >
            Need help with sizing?
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-x pb-16">
          <h2 className="font-display text-2xl font-extrabold">You May Also Like</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}

function Section({ title, children }) {
  return (
    <div className="mt-6">
      <h2 className="font-display text-sm font-bold uppercase tracking-wide">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
