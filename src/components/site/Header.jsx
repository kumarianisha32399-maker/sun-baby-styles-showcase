import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/store/StoreProvider";

const nav = [
  { label: "Home", to: "/" },
  { label: "New Arrivals", to: "/shop", search: { collection: "new" } },
  { label: "Baby", to: "/category/$category", params: { category: "baby" } },
  { label: "Girls", to: "/category/$category", params: { category: "girls" } },
  { label: "Boys", to: "/category/$category", params: { category: "boys" } },
  {
    label: "Accessories",
    to: "/category/$category",
    params: { category: "accessories" },
  },
  {
    label: "Party Wear",
    to: "/category/$category",
    params: { category: "party-wear" },
  },
  { label: "Sale", to: "/shop", search: { collection: "sale" } },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const { settings, cartCount, wishlist } = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    navigate({ to: "/shop", search: { q: q || undefined } });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="bg-sunshine text-accent-foreground">
        <p className="container-x py-2 text-center text-xs font-semibold sm:text-sm">
          {settings.announcement}
        </p>
      </div>

      <div className="container-x flex items-center gap-3 py-3">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full bg-muted text-lg lg:hidden"
          aria-label="Open menu"
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-coral text-xl">
            🌞
          </span>
          <span className="font-display text-lg leading-4 font-extrabold sm:text-xl">
            SUN BABY
            <span className="block text-[0.6rem] tracking-[0.22em] text-muted-foreground sm:text-[0.65rem]">
              KIDS WEAR
            </span>
          </span>
        </Link>

        <form onSubmit={submit} className="mx-auto hidden w-full max-w-xl md:block">
          <label className="sr-only" htmlFor="site-search">
            Search products
          </label>
          <div className="flex items-center rounded-full border-2 border-border bg-background px-4">
            <input
              id="site-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for dresses, rompers, jeans, toys..."
              className="w-full bg-transparent py-2.5 text-sm outline-none"
            />
            <button type="submit" className="text-lg" aria-label="Search">
              🔍
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1.5">
          <Link
            to="/admin/login"
            aria-label="Account"
            className="grid h-10 w-10 place-items-center rounded-full bg-muted"
          >
            👤
          </Link>
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative grid h-10 w-10 place-items-center rounded-full bg-muted"
          >
            ♥
            {wishlist.length > 0 && <Badge>{wishlist.length}</Badge>}
          </Link>
          <Link
            to="/cart"
            aria-label="Shopping bag"
            className="relative grid h-10 w-10 place-items-center rounded-full bg-coral"
          >
            🛍
            {cartCount > 0 && <Badge>{cartCount}</Badge>}
          </Link>
        </div>
      </div>

      <form onSubmit={submit} className="container-x pb-3 md:hidden">
        <div className="flex items-center rounded-full border-2 border-border bg-background px-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search dresses, rompers, jeans..."
            aria-label="Search products"
            className="w-full bg-transparent py-2 text-sm outline-none"
          />
          <button type="submit" aria-label="Search">
            🔍
          </button>
        </div>
      </form>

      <nav className="hidden border-t border-border lg:block">
        <ul className="container-x flex items-center justify-center gap-1 py-2 text-sm font-semibold">
          {nav.map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                params={item.params}
                search={item.search}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-coral/15 text-coral" }}
                className="rounded-full px-3 py-1.5 transition hover:bg-muted"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {open && (
        <nav className="border-t border-border bg-surface lg:hidden">
          <ul className="container-x grid grid-cols-2 gap-1 py-3 text-sm font-semibold">
            {nav.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  params={item.params}
                  search={item.search}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 hover:bg-muted"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function Badge({ children }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-charcoal px-1 text-[0.65rem] font-bold text-cream">
      {children}
    </span>
  );
}
