import { useState } from "react";
import { Link } from "@tanstack/react-router";
import SiteLayout from "./SiteLayout";
import ProductCard from "./ProductCard";
import QuickView from "./QuickView";
import Rating from "./Rating";
import { useStore } from "@/store/StoreProvider";
import { ageGroups } from "@/data/categories";
import { testimonials, trustFeatures } from "@/data/store-info";
import promoFestive from "@/assets/promo-festive.jpg";

export default function HomePage() {
  const { products, categories, banners, settings, toast } = useStore();
  const [slide, setSlide] = useState(0);
  const [quick, setQuick] = useState(null);
  const [email, setEmail] = useState("");

  const activeBanners = banners.filter((b) => b.active);
  const banner = activeBanners[Math.min(slide, activeBanners.length - 1)] || activeBanners[0];

  const featured = products.filter((p) => p.status !== "Draft").slice(0, 16);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 8);
  const bestSellers = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const partyWear = products.filter((p) => p.category === "party-wear").slice(0, 8);
  const everyday = products
    .filter((p) => /cotton|denim|comfort|night|legging/i.test(p.name + p.fabric))
    .slice(0, 8);
  const festive = products
    .filter((p) => p.category === "ethnic-wear" || p.category === "party-wear")
    .slice(0, 8);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="bg-cream">
        <div className="container-x grid items-center gap-8 py-10 lg:grid-cols-2 lg:py-16">
          <div>
            <p className="inline-block rounded-full bg-mint px-3 py-1 text-xs font-bold uppercase tracking-wide text-charcoal">
              Newborn to Early Teens
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {banner?.title}
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
              {banner?.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/shop" search={{ collection: "new" }} className="btn-base btn-primary">
                Shop New Arrivals
              </Link>
              <Link to="/shop" className="btn-base btn-outline">
                Explore Kids Collection
              </Link>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Newborn to Early Teens • Everyday Comfort • Festive Styles
            </p>
            {activeBanners.length > 1 && (
              <div className="mt-6 flex gap-2">
                {activeBanners.map((b, i) => (
                  <button
                    key={b.id}
                    onClick={() => setSlide(i)}
                    aria-label={`Show banner ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      i === slide ? "w-8 bg-coral" : "w-2.5 bg-border"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <img
              src={banner?.image}
              alt="Children wearing colourful kids fashion from Sun Baby Kids Wear"
              className="aspect-[4/3] w-full rounded-4xl object-cover shadow-xl"
            />
            <div className="soft-card absolute -bottom-5 left-4 hidden items-center gap-3 px-4 py-3 sm:flex">
              <span className="text-2xl">🧡</span>
              <div>
                <p className="font-display text-sm font-bold">1000+ happy families</p>
                <p className="text-xs text-muted-foreground">in Chandan Nagar, Pune</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section-pad">
        <div className="container-x">
          <SectionHead
            title="Shop By Category"
            subtitle="Find something special for every little one."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories
              .filter((c) => c.active)
              .map((c) => (
                <Link
                  key={c.id}
                  to="/category/$category"
                  params={{ category: c.slug }}
                  className={`group soft-card overflow-hidden ${c.tint}`}
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="p-4">
                    <h3 className="font-display text-lg">{c.name}</h3>
                    <p className="text-sm text-muted-foreground">{c.blurb}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* AGE */}
      <section className="bg-surface section-pad">
        <div className="container-x">
          <SectionHead title="Shop By Age" subtitle="Pick the right fit in one tap." />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {ageGroups.map((a) => (
              <Link
                key={a.id}
                to="/shop"
                search={{ age: a.id }}
                className={`soft-card p-4 text-center transition hover:-translate-y-1 ${a.tint}`}
              >
                <p className="font-display text-base font-bold">{a.label}</p>
                <p className="text-sm text-muted-foreground">{a.range}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section-pad">
        <div className="container-x">
          <SectionHead
            title="Little Favorites"
            subtitle="Comfortable styles parents love and kids enjoy."
          />
          <ProductGrid items={featured} onQuickView={setQuick} />
        </div>
      </section>

      {/* PROMO */}
      <section className="container-x">
        <div className="soft-card grid items-center gap-6 overflow-hidden bg-softpink/25 md:grid-cols-2">
          <img
            src={promoFestive}
            alt="Children in festive Indian ethnic kids wear"
            loading="lazy"
            className="h-full w-full object-cover md:aspect-auto"
          />
          <div className="p-6 sm:p-10">
            <h2 className="font-display text-3xl">Make Every Occasion Extra Special</h2>
            <p className="mt-3 text-muted-foreground">
              Festive outfits, party-ready styles and adorable everyday looks for your little
              stars.
            </p>
            <Link
              to="/category/$category"
              params={{ category: "party-wear" }}
              className="btn-base btn-primary mt-6"
            >
              Explore Party Wear
            </Link>
          </div>
        </div>
      </section>

      <Collection title="New Arrivals" subtitle="Fresh off the rack this season." items={newArrivals} onQuickView={setQuick} />
      <Collection title="Best Sellers" subtitle="Most loved by Pune parents." items={bestSellers} onQuickView={setQuick} />
      <Collection title="Party Wear" subtitle="Sparkle-ready looks for birthdays and celebrations." items={partyWear} onQuickView={setQuick} />
      <Collection title="Everyday Comfort" subtitle="Soft cottons and easy fits for school and play." items={everyday} onQuickView={setQuick} />
      <Collection title="Festive Collection" subtitle="Lehengas, kurtas, sherwanis and ethnic sets." items={festive} onQuickView={setQuick} />

      {/* WHY */}
      <section className="section-pad">
        <div className="container-x">
          <SectionHead
            title="Why Shop With Sun Baby Kids Wear"
            subtitle="A friendly neighbourhood kids store, online and in person."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trustFeatures.map((f) => (
              <div key={f.title} className={`soft-card p-5 ${f.tint}`}>
                <h3 className="font-display text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORE */}
      <section className="bg-surface section-pad">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <div className="soft-card p-6 sm:p-8">
            <h2 className="font-display text-3xl">Visit Our Store</h2>
            <p className="mt-4 font-display text-lg">{settings.name}</p>
            <address className="mt-2 space-y-1 text-muted-foreground not-italic">
              <p>{settings.addressLine1}</p>
              <p>{settings.addressLine2}</p>
              <p>{settings.addressLine3}</p>
            </address>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="font-bold">Phone:</dt>
                <dd>{settings.phone}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold">Email:</dt>
                <dd>{settings.email}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold">Hours:</dt>
                <dd>{settings.hours}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="btn-base btn-primary">
                Call Store
              </a>
              <a
                href="https://maps.google.com/?q=Samruddhi+Market+Chandan+Nagar+Pune"
                target="_blank"
                rel="noreferrer"
                className="btn-base btn-outline"
              >
                Get Directions
              </a>
            </div>
          </div>
          <div className="soft-card grid place-items-center bg-sky/20 p-10 text-center">
            <div>
              <p className="text-5xl">📍</p>
              <p className="mt-3 font-display text-xl">Samruddhi Market, Sangharsh Chowk</p>
              <p className="text-sm text-muted-foreground">
                Chandan Nagar–Kharadi Road, Pune 411014
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                Illustrative location card — open 9:00 AM to 10:00 PM, all days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad">
        <div className="container-x">
          <SectionHead
            title="Happy Little Customers"
            subtitle="Demo testimonials from families around Chandan Nagar."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote key={t.id} className="soft-card p-5">
                <Rating value={t.rating} />
                <p className="mt-3 text-sm text-muted-foreground">“{t.text}”</p>
                <footer className="mt-4 text-sm font-bold">
                  {t.name}
                  <span className="block text-xs font-normal text-muted-foreground">{t.place}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container-x">
        <div className="soft-card bg-sunshine/30 p-6 text-center sm:p-10">
          <h2 className="font-display text-3xl">Get Little Fashion Updates</h2>
          <p className="mt-2 text-muted-foreground">
            Be the first to know about new arrivals, festive collections and special offers.
          </p>
          <form
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              toast("You're subscribed to Sun Baby updates!");
              setEmail("");
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              aria-label="Email address"
              className="w-full rounded-full border-2 border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-coral"
            />
            <button type="submit" className="btn-base btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </SiteLayout>
  );
}

export function SectionHead({ title, subtitle }) {
  return (
    <header className="mb-6 text-center">
      <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
    </header>
  );
}

export function ProductGrid({ items, onQuickView }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
      ))}
    </div>
  );
}

function Collection({ title, subtitle, items, onQuickView }) {
  if (!items.length) return null;
  return (
    <section className="section-pad">
      <div className="container-x">
        <SectionHead title={title} subtitle={subtitle} />
        <ProductGrid items={items.slice(0, 8)} onQuickView={onQuickView} />
      </div>
    </section>
  );
}
