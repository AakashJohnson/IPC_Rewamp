// Only one 3D scene animates at a time: the most visible one. The rest have rendered a still frame and
// wait. This keeps the GPU budget to a single render loop however many scenes are on the page.

interface Entry {
  ratio: number;
  start: () => void;
  stop: () => void;
}

const entries = new Map<Element, Entry>();
let active: Element | null = null;

function choose() {
  let best: Element | null = null;
  let bestRatio = 0;
  for (const [el, e] of entries) if (e.ratio > bestRatio) { best = el; bestRatio = e.ratio; }
  if (best === active) return;
  if (active) entries.get(active)?.stop();
  active = best;
  if (active && !document.hidden) entries.get(active)?.start();
}

const io = typeof IntersectionObserver !== 'undefined'
  ? new IntersectionObserver(list => {
    for (const r of list) { const e = entries.get(r.target); if (e) e.ratio = r.isIntersecting ? r.intersectionRatio : 0; }
    choose();
  }, { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] })
  : null;

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    const e = active && entries.get(active);
    if (!e) return;
    if (document.hidden) e.stop(); else e.start();
  });
}

export function registerScene(el: Element, start: () => void, stop: () => void) {
  entries.set(el, { ratio: 0, start, stop });
  io?.observe(el);
  return () => {
    io?.unobserve(el);
    entries.delete(el);
    if (active === el) { active = null; choose(); }
  };
}
