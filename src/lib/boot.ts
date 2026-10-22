// First-load handshake with the boot loader in index.html. The loader leaves as soon as the app has
// rendered and the resources that shape the first screen are ready (web fonts, plus the first hero
// scene on the homepage). Each wait is capped, so a slow font or image never holds the page back.

declare global {
  interface Window {
    __ipcBoot?: { done: (reason: string) => void };
  }
}

const FONT_CAP_MS = 1200;
const HERO_CAP_MS = 1800;

let resolveHero: () => void = () => {};
const heroReady = new Promise<void>(r => { resolveHero = r; });
let started = false;

const cap = (ms: number) => new Promise<void>(r => window.setTimeout(r, ms));

/** Called by the hero once its first scene image has loaded or failed. */
export function markHeroReady() {
  resolveHero();
}

/** Called once after the first commit. Only the first call has an effect. */
export function finishBoot(pathname: string) {
  if (started) return;
  started = true;
  const fonts = document.fonts ? Promise.race([document.fonts.ready.then(() => undefined), cap(FONT_CAP_MS)]) : Promise.resolve();
  const hero = pathname === '/' ? Promise.race([heroReady, cap(HERO_CAP_MS)]) : Promise.resolve();
  Promise.all([fonts, hero]).then(() => {
    requestAnimationFrame(() => window.__ipcBoot?.done('ready'));
  });
}
