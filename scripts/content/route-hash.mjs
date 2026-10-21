// Must stay identical to src/lib/route-hash.ts — maps a route to its content file name.
export function routeHash(route) {
  let h = 0x811c9dc5;
  for (const ch of route) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36).padStart(7, '0');
}
