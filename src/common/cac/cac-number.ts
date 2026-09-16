export const CAC_NUMBER_PATTERN = /^(RC|BN|IT)\d{4,8}$/;

export function normalizeCacNumber(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

export function isValidCacNumber(value: string): boolean {
  return CAC_NUMBER_PATTERN.test(normalizeCacNumber(value));
}
