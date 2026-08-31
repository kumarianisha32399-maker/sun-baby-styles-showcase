import { useState } from "react";
import { Link } from "@tanstack/react-router";
import SiteLayout from "./SiteLayout";
import Breadcrumbs from "./Breadcrumbs";
import { inr, useStore } from "@/store/StoreProvider";

const payments = [
  { id: "UPI", label: "UPI", hint: "Google Pay, PhonePe, Paytm" },
  { id: "Card", label: "Credit / Debit Card", hint: "Visa, Mastercard, RuPay" },
  { id: "COD", label: "Cash on Delivery", hint: "Pay when it reaches you" },
  { id: "Pickup", label: "Store Pickup", hint: "Collect at Samruddhi Market" },
];

const empty = {
  fullName: "",
  mobile: "",
  email: "",
  house: "",
  street: "",
  area: "",
  city: "Pune",
  state: "Maharashtra",
  pincode: "",
};

export default function CheckoutPage() {
  const { cart, subtotal, couponDiscount, delivery, total, coupon, placeOrder, settings } =
    useStore();
  const [form, setForm] = useState(empty);
  const [payment, setPayment] = useState("UPI");
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [placedTotal, setPlacedTotal] = useState(0);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (form.fullName.trim().length < 3) next.fullName = "Please enter your full name";
    if (!/^[6-9]\d{9}$/.test(form.mobile.replace(/\s/g, "")))
      next.mobile = "Enter a valid 10-digit mobile number";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address";
    if (payment !== "Pickup") {
      if (!form.house.trim()) next.house = "Required";
      if (!form.street.trim()) next.street = "Required";
      if (!form.area.trim()) next.area = "Required";
      if (!/^\d{6}$/.test(form.pincode)) next.pincode = "6-digit pincode";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setPlacing(true);
    const amount = total;
    setTimeout(() => {
      const number = placeOrder({ ...form, payment });
      setPlacedTotal(amount);
      setOrderNumber(number);
      setPlacing(false);
    }, 800);
  };

  if (orderNumber) {
    return (
      <SiteLayout>
        <div className="container-x grid place-items-center gap-4 py-20 text-center">
          <span className="text-6xl" aria-hidden="true">
            🎉
          </span>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
            Yay! Your Order Has Been Placed!
          </h1>
          <p className="max-w-lg text-muted-foreground">
            Thank you {form.fullName.split(" ")[0]}! Our team will call you on {form.mobile} to
            confirm sizes before dispatch.
          </p>
          <div className="soft-card grid gap-2 p-6 text-left text-sm">
            <p>
              <span className="text-muted-foreground">Order number:</span>{" "}
              <span className="font-display text-lg font-bold">{orderNumber}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Amount:</span>{" "}
              <span className="font-bold">{inr(placedTotal)}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Payment:</span>{" "}
              <span className="font-bold">{payment}</span>
            </p>
            <p className="text-muted-foreground">
              Questions? Call {settings.phone} between {settings.hours}.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn-base btn-primary px-6 py-3">
              Continue Shopping
            </Link>
            <Link to="/contact" className="btn-base btn-outline px-6 py-3">
              Visit Our Store
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Demo checkout — no payment is processed and no order is stored.
          </p>
        </div>
      </SiteLayout>
    );
  }

  if (cart.length === 0) {
    return (
      <SiteLayout>
        <div className="container-x grid place-items-center gap-4 py-24 text-center">
          <span className="text-5xl">🛍</span>
          <h1 className="font-display text-2xl font-bold">Your bag is empty</h1>
          <p className="text-muted-foreground">Add a few styles before heading to checkout.</p>
          <Link to="/shop" className="btn-base btn-primary px-6 py-3">
            Start Shopping
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <Breadcrumbs items={[{ label: "Shopping Bag", to: "/cart" }, { label: "Checkout" }]} />
      <form onSubmit={submit} className="container-x grid gap-8 py-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <h1 className="font-display text-3xl font-extrabold">Checkout</h1>

          <fieldset className="soft-card p-5">
            <legend className="px-1 font-display text-lg font-bold">Customer Information</legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" value={form.fullName} onChange={set("fullName")} error={errors.fullName} />
              <Field label="Mobile Number" value={form.mobile} onChange={set("mobile")} error={errors.mobile} placeholder="9168001210" />
              <div className="sm:col-span-2">
                <Field label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
              </div>
            </div>
          </fieldset>

          <fieldset className="soft-card p-5">
            <legend className="px-1 font-display text-lg font-bold">Delivery Address</legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="House / Flat" value={form.house} onChange={set("house")} error={errors.house} />
              <Field label="Street" value={form.street} onChange={set("street")} error={errors.street} />
              <Field label="Area" value={form.area} onChange={set("area")} error={errors.area} />
              <Field label="City" value={form.city} onChange={set("city")} />
              <Field label="State" value={form.state} onChange={set("state")} />
              <Field label="Pincode" value={form.pincode} onChange={set("pincode")} error={errors.pincode} />
            </div>
            {payment === "Pickup" && (
              <p className="mt-3 text-sm text-muted-foreground">
                Store pickup selected — address is optional. Collect from {settings.addressLine1}.
              </p>
            )}
          </fieldset>

          <fieldset className="soft-card p-5">
            <legend className="px-1 font-display text-lg font-bold">Payment Method</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {payments.map((p) => (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition ${
                    payment === p.id ? "border-coral bg-coral/10" : "border-border hover:border-coral/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={p.id}
                    checked={payment === p.id}
                    onChange={() => setPayment(p.id)}
                    className="mt-1 h-4 w-4 accent-coral"
                  />
                  <span>
                    <span className="block font-semibold">{p.label}</span>
                    <span className="block text-xs text-muted-foreground">{p.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Frontend demo only — no real payment gateway is connected.
            </p>
          </fieldset>
        </div>

        <aside className="lg:sticky lg:top-40 lg:h-fit">
          <div className="soft-card p-5">
            <h2 className="font-display text-lg font-bold">Your Order</h2>
            <ul className="mt-4 space-y-3">
              {cart.map((l) => (
                <li key={`${l.id}-${l.size}-${l.color}`} className="flex gap-3 text-sm">
                  <img src={l.image} alt="" className="h-16 w-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold leading-snug">{l.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.size} • {l.color} • Qty {l.qty}
                    </p>
                  </div>
                  <span className="font-bold">{inr(l.price * l.qty)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <SumRow label="Subtotal" value={inr(subtotal)} />
              {couponDiscount > 0 && (
                <SumRow label={`Coupon ${coupon?.code}`} value={`− ${inr(couponDiscount)}`} />
              )}
              <SumRow label="Delivery" value={delivery === 0 ? "Free" : inr(delivery)} />
              <div className="border-t border-border pt-3">
                <SumRow label="Total" value={inr(total)} bold />
              </div>
            </dl>

            <button type="submit" disabled={placing} className="btn-base btn-primary mt-5 w-full py-3 disabled:opacity-70">
              {placing ? "Placing your order..." : "Place Order"}
            </button>
            <Link to="/cart" className="btn-base btn-outline mt-2 w-full py-3">
              Back to Bag
            </Link>
          </div>
        </aside>
      </form>
    </SiteLayout>
  );
}

function Field({ label, value, onChange, error, type = "text", placeholder }) {
  return (
    <label className="block text-sm">
      <span className="font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-2xl border-2 bg-background px-4 py-2.5 outline-none transition ${
          error ? "border-destructive" : "border-border focus:border-coral"
        }`}
      />
      {error && <span className="mt-1 block text-xs font-semibold text-destructive">{error}</span>}
    </label>
  );
}

function SumRow({ label, value, bold }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "font-display text-lg font-bold" : ""}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
