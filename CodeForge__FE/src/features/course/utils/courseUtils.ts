export const calculateDiscount = (
  price?: number,
  discount?: number
): number => {
  if (price === undefined || discount === undefined) return 0;
  return Math.round(price - (price * discount) / 100);
};

export const formatPrice = (price?: number): string => {
  if (price === undefined) return "";
  return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
};
export const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};
