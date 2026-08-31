import { Link } from "@tanstack/react-router";
import { useStore } from "@/store/StoreProvider";

const shop = [
  { label: "New Arrivals", to: "/shop", search: { collection: "new" } },
  { label: "Baby", to: "/category/$category", params: { category: "baby" } },
  { label: "Girls", to: "/category/$category", params: { category: "girls" } },
  { label: "Boys", to: "/category/$category", params: { category: "boys" } },
  {
    label: "Party Wear",
    to: "/category/$category",
    params: { category: "party-wear" },
  },
  {
    label: "Accessories",
    to: "/category/$category",
    params: { category: "accessories" },
  },
  { label: "Sale", to: "/shop", search: { collection: "sale" } },
];

export default function Footer() {
  const { settings } = useStore();

  return (
    <footer className="mt-16 bg-charcoal text-cream">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="font-display text-xl">Shop</h2>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            {shop.map((s) => (
              <li key={s.label}>
                <Link to={s.to} params={s.params} search={s.search} className="hover:text-sunshine">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl">Customer Care</h2>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>
              <Link to="/contact" className="hover:text-sunshine">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/contact" hash="shipping" className="hover:text-sunshine">
                Shipping Information
              </Link>
            </li>
            <li>
              <Link to="/contact" hash="returns" className="hover:text-sunshine">
                Returns
              </Link>
            </li>
            <li>
              <Link to="/contact" hash="size-guide" className="hover:text-sunshine">
                Size Guide
              </Link>
            </li>
            <li>
              <Link to="/contact" hash="faqs" className="hover:text-sunshine">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl">Store</h2>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>
              <Link to="/contact" hash="about" className="hover:text-sunshine">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" hash="visit" className="hover:text-sunshine">
                Visit Store
              </Link>
            </li>
            <li>Store Hours: {settings.hours}</li>
            <li>
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-sunshine">
                {settings.phone}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl">Contact</h2>
          <address className="mt-4 space-y-1 text-sm not-italic text-cream/80">
            <p className="font-semibold text-cream">{settings.name}</p>
            <p>{settings.addressLine1}</p>
            <p>{settings.addressLine2}</p>
            <p>{settings.addressLine3}</p>
            <p>
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-sunshine">
                {settings.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${settings.email}`} className="hover:text-sunshine">
                {settings.email}
              </a>
            </p>
          </address>
          <div className="mt-4 flex gap-2 text-lg" aria-label="Social links">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-cream/10">f</span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-cream/10">◎</span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-cream/10">✆</span>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/70 sm:flex-row">
          <p>© 2026 {settings.name}. Demo store — frontend showcase only.</p>
          <Link
            to="/admin/login"
            className="rounded-full border border-cream/30 px-3 py-1 font-semibold text-cream hover:bg-cream/10"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
