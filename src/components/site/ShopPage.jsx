import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import SiteLayout from "./SiteLayout";
import ProductCard from "./ProductCard";
import QuickView from "./QuickView";
import Breadcrumbs from "./Breadcrumbs";
import { useStore } from "@/store/StoreProvider";
import {
  ageGroups,
  filterSizes,
  priceBuckets,
  sortOptions,
} from "@/data/categories";

const sizeMatch = (productSizes = [], filter) => {
  if (filter === "1–3Y") return productSizes.some((s) => /1–2Y|2–3Y/.test(s));
  if (filter === "4–8Y") return productSizes.some((s) => /4–5Y|6–7Y|8–9Y/.test(s));
  if (filter === "9–12Y") return productSizes.some((s) => /8–9Y|10–11Y|12–13Y/.test(s));
  if (filter === "13–16Y") return productSizes.some((s) => /12–13Y|14–15Y/.test(s));
  return productSizes.includes(filter);
};

export default function ShopPage({
  q = "",
  collection = "",
  category = "",
  title = "Shop All Kids Wear",
  subtitle = "Browse the full Sun Baby collection — newborn essentials to early-teen styles.",
  hero,
  breadcrumb = [{ label: "Shop" }],
}) {
  const { products, categories } = useStore();
  const [cats, setCats] = useState(category ? [category] : []);
  const [ages, setAges] = useState([]);
  const [prices, setPrices] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [sort, setSort] = useState("featured");
  const [quick, setQuick] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggle = (setter, value) =>
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const clearAll = () => {
    setCats(category ? [category] : []);
    setAges([]);
    setPrices([]);
    setSizes([]);
    setSort("featured");
  };

  const results = useMemo(() => {
    let list = products.filter((p) => p.status !== "Draft");

    if (category) list = list.filter((p) => p.category === category);
    if (collection === "new") list = list.filter((p) => p.newArrival);
    if (collection === "sale") list = list.filter((p) => p.discount >= 20);
    if (collection === "bestsellers") list = list.filter((p) => p.bestseller);

    const term = q.trim().toLowerCase();
    if (term) {
      list = list.filter((p) =>
        [p.name, p.category, p.subcategory, p.fabric, p.description]
          .join(" ")
          .toLowerCase()
          .includes(term),
      );
    }

    if (cats.length) list = list.filter((p) => cats.includes(p.category));
    if (ages.length) list = list.filter((p) => ages.includes(p.ageGroup));
    if (sizes.length) list = list.filter((p) => sizes.some((s) => sizeMatch(p.sizes, s)));
    if (prices.length) {
      const buckets = priceBuckets.filter((b) => prices.includes(b.id));
      list = list.filter((p) => buckets.some((b) => p.price >= b.min && p.price <= b.max));
    }

    const sorted = [...list];
    if (sort === "newest") sorted.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "featured") sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    return sorted;
  }, [products, category, collection, q, cats, ages, sizes, prices, sort]);

  const activeCount = cats.length + ages.length + prices.length + sizes.length;

  const filterPanel = (
    <div className="space-y-6">
      <FilterGroup title="Category">
        {categories
          .filter((c) => c.active)
          .map((c) => (
            <Check
              key={c.id}
              label={c.name}
              checked={cats.includes(c.slug)}
              onChange={() => toggle(setCats, c.slug)}
            />
          ))}
      </FilterGroup>

      <FilterGroup title="Age">
        {ageGroups.map((a) => (
          <Check
            key={a.id}
            label={a.range}
            checked={ages.includes(a.id)}
            onChange={() => toggle(setAges, a.id)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        {priceBuckets.map((b) => (
          <Check
            key={b.id}
            label={b.label}
            checked={prices.includes(b.id)}
            onChange={() => toggle(setPrices, b.id)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {filterSizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(setSizes, s)}
              className={`rounded-full border-2 px-3 py-1 text-xs font-semibold transition ${
                sizes.includes(s)
                  ? "border-coral bg-coral/15 text-coral"
                  : "border-border hover:border-coral/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>

      <button type="button" onClick={clearAll} className="btn-base btn-outline w-full py-2 text-sm">
        Clear Filters
      </button>
    </div>
  );

  return (
    <SiteLayout>
      <Breadcrumbs items={breadcrumb} />

      <section className="container-x pt-4">
        {hero && (
          <div className="relative mb-6 overflow-hidden rounded-3xl">
            <img src={hero} alt={title} className="h-40 w-full object-cover sm:h-56" />
            <div className="absolute inset-0 bg-charcoal/35" />
          </div>
        )}
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>
        {q && (
          <p className="mt-3 text-sm">
            Showing results for <span className="font-bold text-coral">“{q}”</span>
          </p>
        )}
      </section>

      <div className="container-x grid gap-8 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-40 lg:h-fit">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="btn-base btn-outline w-full py-2 text-sm lg:hidden"
          >
            {filtersOpen ? "Hide Filters" : `Show Filters${activeCount ? ` (${activeCount})` : ""}`}
          </button>
          <div className={`soft-card mt-3 p-5 lg:mt-0 lg:block ${filtersOpen ? "" : "hidden"}`}>
            {filterPanel}
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5">
            <p className="text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? "product" : "products"}
            </p>
            <label className="flex items-center gap-2 text-sm font-semibold">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border-2 border-border bg-background px-3 py-1.5 text-sm font-semibold outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {results.length === 0 ? (
            <div className="soft-card grid place-items-center gap-3 p-10 text-center">
              <span className="text-5xl">🧸</span>
              <h2 className="font-display text-xl font-bold">No little styles matched</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Try a different search or clear a few filters — we have plenty more for every age.
              </p>
              <button type="button" onClick={clearAll} className="btn-base btn-primary px-5 py-2">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={setQuick} />
              ))}
            </div>
          )}

          <p className="pt-8 text-sm text-muted-foreground">
            Looking for something specific?{" "}
            <Link to="/contact" className="font-semibold text-coral hover:underline">
              Call the store
            </Link>{" "}
            and our team will help you find the right size.
          </p>
        </div>
      </div>

      {quick && <QuickView product={quick} onClose={() => setQuick(null)} />}
    </SiteLayout>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <h2 className="font-display text-sm font-bold uppercase tracking-wide">{title}</h2>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-coral"
      />
      {label}
    </label>
  );
}
