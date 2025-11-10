/**
 * Convert time string to milliseconds
 * Examples: '15m', '1h', '7d', '30s'
 */
export function parseTimeToMs(timeStr: string): number {
  const units: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  const match = timeStr.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid time format: ${timeStr}`);
  }

  const [, value, unit] = match;
  return parseInt(value, 10) * units[unit];
}

/**
 * Get expiration date from time string
 */
export function getExpirationDate(timeStr: string): Date {
  const ms = parseTimeToMs(timeStr);
  return new Date(Date.now() + ms);
}


