/**
 * Small in-memory sliding-window limiter. On serverless hosting each instance
 * has its own memory, so this is best-effort abuse protection, not a hard
 * guarantee (see docs/adr/0003-enquiry-delivery.md).
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return true;
}

export function resetRateLimit(): void {
  hits.clear();
}
