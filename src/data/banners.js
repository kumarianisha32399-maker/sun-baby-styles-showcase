import heroKids from "@/assets/hero-kids.jpg";
import promoFestive from "@/assets/promo-festive.jpg";
import catGirls from "@/assets/cat-girls.jpg";

export const banners = [
  {
    id: 1,
    title: "Little Styles, Big Smiles",
    subtitle:
      "Discover comfortable, trendy and adorable fashion for every little personality.",
    image: heroKids,
    ctaText: "Shop New Arrivals",
    ctaLink: "/shop",
    active: true,
  },
  {
    id: 2,
    title: "Festive Looks for Little Stars",
    subtitle:
      "Kurta sets, lehengas and sherwanis ready for weddings and Diwali evenings.",
    image: promoFestive,
    ctaText: "Explore Ethnic Wear",
    ctaLink: "/category/ethnic-wear",
    active: true,
  },
  {
    id: 3,
    title: "Everyday Comfort, Made Cute",
    subtitle:
      "Soft cottons, easy fits and playful prints for school days and playdates.",
    image: catGirls,
    ctaText: "Shop Everyday Wear",
    ctaLink: "/category/girls",
    active: true,
  },
];
