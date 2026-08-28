export const PRODUCT_GROUPS = ["PEN_1", "PEN_2", "VIAL", "TABLET"] as const;

export type ProductGroup = (typeof PRODUCT_GROUPS)[number];

export const PRODUCT_GROUP_LABELS: Record<ProductGroup, string> = {
  PEN_1: "Pen 1",
  PEN_2: "Pen 2",
  VIAL: "Vial",
  TABLET: "Tablet",
};

export function isProductGroup(value: string): value is ProductGroup {
  return (PRODUCT_GROUPS as readonly string[]).includes(value);
}
