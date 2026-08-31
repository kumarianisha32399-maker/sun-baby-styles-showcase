import catBaby from "@/assets/cat-baby.jpg";
import catGirls from "@/assets/cat-girls.jpg";
import catBoys from "@/assets/cat-boys.jpg";
import catParty from "@/assets/cat-party.jpg";
import catEthnic from "@/assets/cat-ethnic.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";

export const categories = [
  {
    id: "baby",
    slug: "baby",
    name: "Baby & Newborn",
    image: catBaby,
    blurb: "Rompers, onesies and soft daily essentials.",
    tint: "bg-mint/30",
    active: true,
  },
  {
    id: "girls",
    slug: "girls",
    name: "Girls",
    image: catGirls,
    blurb: "Frocks, tops and playful everyday sets.",
    tint: "bg-softpink/30",
    active: true,
  },
  {
    id: "boys",
    slug: "boys",
    name: "Boys",
    image: catBoys,
    blurb: "Shirts, tees, jeans and smart shorts.",
    tint: "bg-sky/30",
    active: true,
  },
  {
    id: "party-wear",
    slug: "party-wear",
    name: "Party Wear",
    image: catParty,
    blurb: "Sparkle-ready dresses and celebration looks.",
    tint: "bg-sunshine/30",
    active: true,
  },
  {
    id: "ethnic-wear",
    slug: "ethnic-wear",
    name: "Ethnic Wear",
    image: catEthnic,
    blurb: "Kurta sets, lehengas and sherwanis.",
    tint: "bg-coral/20",
    active: true,
  },
  {
    id: "accessories",
    slug: "accessories",
    name: "Accessories",
    image: catAccessories,
    blurb: "Shoes, socks, hats and hair accessories.",
    tint: "bg-sky/25",
    active: true,
  },
];

export const ageGroups = [
  { id: "0-3m", label: "Newborn", range: "0–3M", tint: "bg-mint/30" },
  { id: "3-12m", label: "Baby", range: "3–12M", tint: "bg-softpink/30" },
  { id: "1-3y", label: "Toddler", range: "1–3Y", tint: "bg-sky/30" },
  { id: "4-8y", label: "Kids", range: "4–8Y", tint: "bg-sunshine/30" },
  { id: "9-12y", label: "Kids", range: "9–12Y", tint: "bg-coral/20" },
  { id: "13-16y", label: "Teens", range: "13–16Y", tint: "bg-mint/25" },
];

export const allSizes = [
  "0–3M",
  "3–6M",
  "6–12M",
  "1–2Y",
  "2–3Y",
  "4–5Y",
  "6–7Y",
  "8–9Y",
  "10–11Y",
  "12–13Y",
  "14–15Y",
];

export const filterSizes = [
  "0–3M",
  "3–6M",
  "6–12M",
  "1–3Y",
  "4–8Y",
  "9–12Y",
  "13–16Y",
];

export const priceBuckets = [
  { id: "u500", label: "Under ₹500", min: 0, max: 499 },
  { id: "500-999", label: "₹500 – ₹999", min: 500, max: 999 },
  { id: "1000-1499", label: "₹1,000 – ₹1,499", min: 1000, max: 1499 },
  { id: "1500p", label: "₹1,500+", min: 1500, max: Infinity },
];

export const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Rating" },
];
