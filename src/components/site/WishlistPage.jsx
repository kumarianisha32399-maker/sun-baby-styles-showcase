import { useState } from "react";
import { Link } from "@tanstack/react-router";
import SiteLayout from "./SiteLayout";
import Breadcrumbs from "./Breadcrumbs";
import ProductCard from "./ProductCard";
import QuickView from "./QuickView";
import { useStore } from "@/store/StoreProvider";
import catGirls from "@/assets/cat-girls.jpg";

export default function WishlistPage() {
  const { wishlist, addToCart } = useStore();
  const [quick, setQuick] = useState(null);

  return (
    <SiteLayout>
      <Breadcrumbs items={[{ label: "Wishlist" }]} />
      <section className="container-x py-8">
        <h1 className="font-display text-3xl font-extrabold">My Wishlist</h1>
        <p className="mt-1 text-muted-foreground">
          Save the styles you love and pick them up on your next store visit.
        </p>

        {wishlist.length === 0 ? (
          <div className="mt-8 grid place-items-center gap-4 text-center">
            <img
              src={catGirls}
              alt="Girls dresses from the Sun Baby collection"
              className="h-48 w-48 rounded-full object-cover shadow-lg"
            />
            <h2 className="font-display text-2xl font-bold">No favourites yet</h2>
            <p className="max-w-md text-muted-foreground">
              Tap the heart on any product to keep it here while you browse.
            </p>
            <Link to="/shop" className="btn-base btn-primary px-6 py-3">
              Browse Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {wishlist.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={setQuick} />
              ))}
            </div>
            <button
              type="button"
              onClick={() => wishlist.forEach((p) => addToCart(p))}
              className="btn-base btn-accent mt-6 px-6 py-3"
            >
              Add All to Cart
            </button>
          </>
        )}
      </section>
      {quick && <QuickView product={quick} onClose={() => setQuick(null)} />}
    </SiteLayout>
  );
}
