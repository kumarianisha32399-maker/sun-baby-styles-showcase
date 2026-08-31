import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { products as seedProducts } from "@/data/products";
import { categories as seedCategories } from "@/data/categories";
import { banners as seedBanners } from "@/data/banners";
import { coupons as seedCoupons } from "@/data/coupons";
import { orders as seedOrders } from "@/data/orders";
import { customers as seedCustomers } from "@/data/customers";
import { storeInfo as seedSettings } from "@/data/store-info";

const StoreContext = createContext(null);

let toastId = 0;
let couponSeq = 100;
let bannerSeq = 100;
let productSeq = 1000;

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(seedProducts);
  const [categories, setCategories] = useState(seedCategories);
  const [banners, setBanners] = useState(seedBanners);
  const [coupons, setCoupons] = useState(seedCoupons);
  const [orders, setOrders] = useState(seedOrders);
  const [customers] = useState(seedCustomers);
  const [settings, setSettings] = useState(seedSettings);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const toast = useCallback((message, tone = "success") => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  /* ---------------- cart ---------------- */
  const addToCart = useCallback(
    (product, { size, color, qty = 1 } = {}) => {
      const chosenSize = size || product.sizes?.[0] || "Free Size";
      const chosenColor = color || product.colors?.[0] || "Default";
      setCart((prev) => {
        const idx = prev.findIndex(
          (l) => l.id === product.id && l.size === chosenSize && l.color === chosenColor,
        );
        if (idx > -1) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            originalPrice: product.originalPrice,
            size: chosenSize,
            color: chosenColor,
            qty,
          },
        ];
      });
      toast(`${product.name} added to bag`);
    },
    [toast],
  );

  const updateQty = useCallback((line, qty) => {
    setCart((prev) =>
      prev
        .map((l) =>
          l.id === line.id && l.size === line.size && l.color === line.color
            ? { ...l, qty: Math.max(1, qty) }
            : l,
        )
        .filter((l) => l.qty > 0),
    );
  }, []);

  const removeFromCart = useCallback(
    (line) => {
      setCart((prev) =>
        prev.filter(
          (l) => !(l.id === line.id && l.size === line.size && l.color === line.color),
        ),
      );
      toast(`${line.name} removed from bag`, "info");
    },
    [toast],
  );

  const clearCart = useCallback(() => setCart([]), []);

  /* ---------------- wishlist ---------------- */
  const toggleWishlist = useCallback(
    (product) => {
      setWishlist((prev) => {
        if (prev.some((p) => p.id === product.id)) {
          toast(`${product.name} removed from wishlist`, "info");
          return prev.filter((p) => p.id !== product.id);
        }
        toast(`${product.name} saved to wishlist`);
        return [...prev, product];
      });
    },
    [toast],
  );

  const inWishlist = useCallback(
    (id) => wishlist.some((p) => p.id === id),
    [wishlist],
  );

  /* ---------------- totals ---------------- */
  const cartCount = cart.reduce((n, l) => n + l.qty, 0);
  const subtotal = cart.reduce((n, l) => n + l.price * l.qty, 0);
  const mrpTotal = cart.reduce((n, l) => n + (l.originalPrice || l.price) * l.qty, 0);
  const savings = mrpTotal - subtotal;
  const couponDiscount = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0;
  const delivery = subtotal === 0 || subtotal - couponDiscount >= 999 ? 0 : 59;
  const total = Math.max(0, subtotal - couponDiscount + delivery);

  const applyCoupon = useCallback(
    (code) => {
      const found = coupons.find(
        (c) => c.code.toLowerCase() === String(code).trim().toLowerCase() && c.active,
      );
      if (!found) {
        toast("That coupon code is not valid", "error");
        return false;
      }
      if (subtotal < found.minOrder) {
        toast(`Add ₹${found.minOrder - subtotal} more to use ${found.code}`, "error");
        return false;
      }
      setCoupon(found);
      toast(`${found.code} applied — ${found.percent}% off`);
      return true;
    },
    [coupons, subtotal, toast],
  );

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const placeOrder = useCallback(
    (details) => {
      const number = `SBKW-2026-${10450 + orders.length + 1}`;
      const order = {
        id: number,
        customer: details.fullName || "Guest Customer",
        date: new Date().toISOString().slice(0, 10),
        items: cartCount,
        products: cart.map((l) => l.name).join(", "),
        amount: total,
        payment: details.payment || "UPI",
        status: "Pending",
      };
      setOrders((prev) => [order, ...prev]);
      setLastOrder({ ...order, lines: cart, address: details });
      setCart([]);
      setCoupon(null);
      return number;
    },
    [cart, cartCount, orders.length, total],
  );

  /* ---------------- admin ---------------- */
  const adminLogin = useCallback(
    (email, password) => {
      const ok =
        email.trim().toLowerCase() === "admin@sunbabykidswear.com" &&
        password === "admin123";
      setIsAdmin(ok);
      if (!ok) toast("Invalid demo credentials", "error");
      return ok;
    },
    [toast],
  );

  const adminLogout = useCallback(() => setIsAdmin(false), []);

  const saveProduct = useCallback(
    (product) => {
      setProducts((prev) => {
        if (product.id) return prev.map((p) => (p.id === product.id ? { ...p, ...product } : p));
        return [{ ...product, id: ++productSeq }, ...prev];
      });
      toast(product.id ? "Product updated" : "Product added");
    },
    [toast],
  );

  const deleteProduct = useCallback(
    (id) => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast("Product deleted", "info");
    },
    [toast],
  );

  const saveCategory = useCallback(
    (category) => {
      setCategories((prev) => {
        if (prev.some((c) => c.id === category.id))
          return prev.map((c) => (c.id === category.id ? { ...c, ...category } : c));
        return [...prev, category];
      });
      toast("Category saved");
    },
    [toast],
  );

  const deleteCategory = useCallback(
    (id) => {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast("Category deleted", "info");
    },
    [toast],
  );

  const saveCoupon = useCallback(
    (c) => {
      setCoupons((prev) => {
        if (c.id) return prev.map((x) => (x.id === c.id ? { ...x, ...c } : x));
        return [...prev, { ...c, id: ++couponSeq }];
      });
      toast("Coupon saved");
    },
    [toast],
  );

  const deleteCoupon = useCallback(
    (id) => {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast("Coupon deleted", "info");
    },
    [toast],
  );

  const saveBanner = useCallback(
    (b) => {
      setBanners((prev) => {
        if (b.id) return prev.map((x) => (x.id === b.id ? { ...x, ...b } : x));
        return [...prev, { ...b, id: ++bannerSeq }];
      });
      toast("Banner saved");
    },
    [toast],
  );

  const deleteBanner = useCallback(
    (id) => {
      setBanners((prev) => prev.filter((b) => b.id !== id));
      toast("Banner deleted", "info");
    },
    [toast],
  );

  const setOrderStatus = useCallback(
    (id, status) => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      toast(`Order ${id} → ${status}`);
    },
    [toast],
  );

  const saveSettings = useCallback(
    (next) => {
      setSettings((prev) => ({ ...prev, ...next }));
      toast("Store settings updated");
    },
    [toast],
  );

  const value = useMemo(
    () => ({
      products,
      categories,
      banners,
      coupons,
      orders,
      customers,
      settings,
      cart,
      wishlist,
      toasts,
      coupon,
      isAdmin,
      lastOrder,
      cartCount,
      subtotal,
      savings,
      couponDiscount,
      delivery,
      total,
      toast,
      dismissToast,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      inWishlist,
      applyCoupon,
      removeCoupon,
      placeOrder,
      adminLogin,
      adminLogout,
      saveProduct,
      deleteProduct,
      saveCategory,
      deleteCategory,
      saveCoupon,
      deleteCoupon,
      saveBanner,
      deleteBanner,
      setOrderStatus,
      saveSettings,
    }),
    [
      products,
      categories,
      banners,
      coupons,
      orders,
      customers,
      settings,
      cart,
      wishlist,
      toasts,
      coupon,
      isAdmin,
      lastOrder,
      cartCount,
      subtotal,
      savings,
      couponDiscount,
      delivery,
      total,
      toast,
      dismissToast,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      inWishlist,
      applyCoupon,
      removeCoupon,
      placeOrder,
      adminLogin,
      adminLogout,
      saveProduct,
      deleteProduct,
      saveCategory,
      deleteCategory,
      saveCoupon,
      deleteCoupon,
      saveBanner,
      deleteBanner,
      setOrderStatus,
      saveSettings,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
