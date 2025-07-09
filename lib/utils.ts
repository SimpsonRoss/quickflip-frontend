import { ScannedItem } from '@/store';

export const formatPrice = (price?: number | null): string => {
  if (price == null) return "—";
  return `$${price.toFixed(2)}`;
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString();
};

export const formatPercentage = (value: number, includeSign: boolean = true): string => {
  const sign = includeSign && value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
};

export const calculateProfit = (sellPrice?: number | null, buyPrice?: number | null): number | null => {
  if (sellPrice == null || buyPrice == null) return null;
  return sellPrice - buyPrice;
};

export const calculateProfitPercentage = (sellPrice?: number | null, buyPrice?: number | null): number => {
  if (sellPrice == null || buyPrice == null || buyPrice === 0) return 0;
  return ((sellPrice - buyPrice) / buyPrice) * 100;
};

export const getConfidenceLevel = (priceCount?: number): {
  level: "Low" | "Medium" | "High";
  color: string;
} => {
  const count = priceCount ?? 0;
  
  if (count >= 5 && count <= 10) {
    return { level: "Medium", color: "#FF9500" };
  } else if (count > 10) {
    return { level: "High", color: "#34C759" };
  } else {
    return { level: "Low", color: "#8E8E93" };
  }
};

export const validatePrice = (priceText: string): { isValid: boolean; value?: number } => {
  const price = parseFloat(priceText);
  if (isNaN(price) || price <= 0) {
    return { isValid: false };
  }
  return { isValid: true, value: price };
};

export const calculateSummaryStats = (items: ScannedItem[]) => {
  const totalRevenue = items.reduce((sum, item) => sum + (item.priceSold ?? 0), 0);
  const totalCost = items.reduce((sum, item) => sum + (item.pricePaid ?? 0), 0);
  const totalProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  const averageProfitPercentage = items.length > 0
    ? items.reduce((sum, item) => {
        if (item.pricePaid && item.priceSold && item.pricePaid > 0) {
          const profitPercent = ((item.priceSold - item.pricePaid) / item.pricePaid) * 100;
          return sum + profitPercent;
        }
        return sum;
      }, 0) / items.length
    : 0;
  
  return {
    totalRevenue,
    totalCost,
    totalProfit,
    profitMargin,
    averageProfitPercentage,
    itemCount: items.length,
  };
};

export const calculateEstimatedStats = (items: ScannedItem[]) => {
  const totalPaid = items.reduce((sum, item) => sum + (item.pricePaid ?? 0), 0);
  const totalResale = items.reduce((sum, item) => sum + (item.estimatedPrice ?? 0), 0);
  const totalProfit = totalResale - totalPaid;
  
  return {
    totalPaid,
    totalResale,
    totalProfit,
    itemCount: items.length,
  };
};