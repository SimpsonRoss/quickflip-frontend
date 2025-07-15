import { ScannedItem } from "@/store";

export const parsePrice = (
  price: string | number | null | undefined
): number | null => {
  if (!price) return null;
  const num = typeof price === "string" ? parseFloat(price) : price;
  return isNaN(num) ? null : num;
};

export const formatPrice = (
  price: string | number | null | undefined
): string => {
  const parsed = parsePrice(price);
  return parsed !== null ? parsed.toFixed(2) : "—";
};

export const formatPriceWithSign = (
  price: string | number | null | undefined
): string => {
  const parsed = parsePrice(price);
  return parsed !== null ? `$${parsed.toFixed(2)}` : "$—";
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

export const calculateProfit = (
  priceSold: string | number | null | undefined,
  pricePaid: string | number | null | undefined
): number | null => {
  const sold = parsePrice(priceSold);
  const paid = parsePrice(pricePaid);
  return sold !== null && paid !== null ? sold - paid : null;
};

export const calculateProfitPercentage = (
  priceSold: string | number | null | undefined,
  pricePaid: string | number | null | undefined
): number => {
  const sold = parsePrice(priceSold);
  const paid = parsePrice(pricePaid);
  return sold !== null && paid !== null && paid > 0
    ? ((sold - paid) / paid) * 100
    : 0;
};
