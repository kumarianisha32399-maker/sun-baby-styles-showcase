import { useState } from "react";
import { Link } from "@tanstack/react-router";
import SiteLayout from "./SiteLayout";
import Breadcrumbs from "./Breadcrumbs";
import { inr, useStore } from "@/store/StoreProvider";
import catBaby from "@/assets/cat-baby.jpg";

export default function CartPage() {
  const {
    cart,
    updateQty,
    removeFromCart,
    toggleWishlist,
    products,
    subtotal,
    savings,
    couponDiscount,
    delivery,
    total,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useStore();
  const [code, setCode] = useState("");

  if (cart.length === 0) {
    return (
      <SiteLayout>
        <Breadcrumbs items={[{ label: "Shopping Bag" }]} />
        <div className="container-x grid place-items-center gap-4 py-16 text-center">
          <img
            src={catBaby}
            alt="Kids clothing waiting to be picked"
            className="h-48 w-48 rounded-full object-cover shadow-lg"
          />
          <h1 className="font-display text-3xl font-extrabold">Your bag is empty</h1>
          <p className="max-w-md text-muted-foreground">
            Add a few little favourites — rompers, frocks, jeans or festive sets — and they will
            show up right here.
          </p>
          <Link to="/shop" className="btn-base btn-primary px-6 py-3">
            Start Shopping
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <Breadcrumbs items={[{ label: "Shopping Bag" }]} />
      <div className="container-x grid gap-8 py-8 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Shopping Bag</h1>
          <p className="mt-1 text-muted-foreground">
            {cart.length} {cart.length === 1 ? "style" : "styles"} ready for your little one.
          </p>

          <ul className="mt-6 space-y-4">
            {cart.map((line) => {
              const product = products.find((p) => p.id === line.id);
              return (
                <li
                  key={`${line.id}-${line.size}-${line.color}`}
                  className="soft-card flex gap-4 p-4"
                >
                  <img
                    src={line.image}
                    alt={line.name}
                    className="h-28 w-24 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <h2 className="font-display text-base font-bold">
                      <Link to="/product/$id" params={{ id: String(line.id) }} className="hover:text-coral">
                        {line.name}
                      </Link>
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Size {line.size} • {line.color}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="inline-flex items-center rounded-full border-2 border-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateQty(line, line.qty - 1)}
                          className="px-3 py-1 font-bold"
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-sm font-bold">{line.qty}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateQty(line, line.qty + 1)}
                          className="px-3 py-1 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-display font-bold">{inr(line.price * line.qty)}</span>
                    </div>
                    <div className="mt-auto flex gap-4 pt-3 text-sm font-semibold">
                      <button
                        type="button"
                        onClick={() => removeFromCart(line)}
                        className="text-destructive hover:underline"
                      >
                        Remove
                      </button>
                      {product && (
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product)}
                          className="text-coral hover:underline"
                        >
                          Move to Wishlist
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-40 lg:h-fit">
          <div className="soft-card p-5">
            <h2 className="font-display text-lg font-bold">Order Summary</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (applyCoupon(code)) setCode("");
              }}
              className="mt-4 flex gap-2"
            >
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Coupon code (SUN10)"
                aria-label="Coupon code"
                className="w-full rounded-full border-2 border-border bg-background px-4 py-2 text-sm outline-none"
              />
              <button type="submit" className="btn-base btn-outline px-4 py-2 text-sm">
                Apply
              </button>
            </form>
            {coupon && (
              <p className="mt-2 text-sm font-semibold">
                {coupon.code} applied ({coupon.percent}% off){" "}
                <button type="button" onClick={removeCoupon} className="text-destructive hover:underline">
                  remove
                </button>
              </p>
            )}

            <dl className="mt-5 space-y-2 text-sm">
              <Row label="Subtotal" value={inr(subtotal)} />
              {savings > 0 && <Row label="You save (MRP)" value={`− ${inr(savings)}`} />}
              {couponDiscount > 0 && <Row label="Coupon discount" value={`− ${inr(couponDiscount)}`} />}
              <Row label="Delivery" value={delivery === 0 ? "Free" : inr(delivery)} />
              <div className="border-t border-border pt-3">
                <Row label="Total" value={inr(total)} bold />
              </div>
            </dl>

            <Link to="/checkout" className="btn-base btn-primary mt-5 w-full py-3">
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="btn-base btn-outline mt-2 w-full py-3">
              Continue Shopping
            </Link>
            <p className="mt-4 text-xs text-muted-foreground">
              Free delivery on orders above ₹999. Store pickup available at Samruddhi Market,
              Chandan Nagar.
            </p>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "font-display text-lg font-bold" : ""}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
