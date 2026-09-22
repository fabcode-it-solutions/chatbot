export const calculateDiscount = (price, compareAtPrice) => {
  if (
    typeof price !== "number" ||
    typeof compareAtPrice !== "number" ||
    compareAtPrice <= price ||
    compareAtPrice === 0
  ) {
    return null; // or return "No Discount"
  }

  const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
  return Math.round(discount); // round to nearest whole number
};
