import { ScannedItem } from "@/store";

export const parsePrice = (price: string | number | null): number | null => {
  if (!price) return null;
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return isNaN(num) ? null : num;
};

export const transformProductPrices = (product: any): ScannedItem => {
  return {
    ...product,
    estimatedPrice: parsePrice(product.estimatedPrice),
    pricePaid: parsePrice(product.pricePaid),
    priceSold: parsePrice(product.priceSold),
    timestamp: new Date(product.createdAt).getTime(),
    purchased: product.status === "PURCHASED" || product.status === "SOLD",
    sold: product.status === "SOLD",
  };
};