export { cn } from "cn";

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}
