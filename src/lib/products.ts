import mushroomLamp from "@/assets/product-mushroom-lamp.jpg";
import silverTray from "@/assets/product-silver-tray.jpg";
import flipClock from "@/assets/product-flip-clock.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  shippingDays: string;
}

export const products: Product[] = [
  {
    id: "mushroom-lamp",
    name: "מנורת פטריה עץ",
    price: 149,
    image: mushroomLamp,
    description:
      "מנורת שולחן בעיצוב פטריה עשויה עץ טבעי. תאורה חמה ורכה שמוסיפה אווירה ביתית לכל חלל. מתאימה לשידת לילה, שולחן עבודה או מדף.",
    shippingDays: "10-18 ימי עסקים",
  },
  {
    id: "silver-tray",
    name: "מגש גלי כסוף",
    price: 99,
    image: silverTray,
    description:
      "מגש דקורטיבי בגימור כסוף מבריק עם קצוות גליים. מושלם להגשה, לאחסון תכשיטים או כפריט עיצובי על שולחן הסלון.",
    shippingDays: "10-18 ימי עסקים",
  },
  {
    id: "flip-clock",
    name: "שעון פליפ רטרו",
    price: 189,
    image: flipClock,
    description:
      "שעון פליפ בסגנון רטרו בגוון קרם חם. עיצוב נוסטלגי שמשלב פונקציונליות עם אסתטיקה. מוסיף אופי לכל חדר.",
    shippingDays: "10-18 ימי עסקים",
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
