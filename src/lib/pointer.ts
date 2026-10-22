// One pointer loop for the whole site. It writes CSS variables only, so moving the mouse never
// re-renders React. Active on fine pointers without reduced motion; touch devices get none of it.
//   .spotlight  → --sx / --sy   (glow position inside the element)
//   .tilt       → --rx / --ry / --gx / --gy   (3D tilt and glare)
//   .cursor-halo (one element) → --cx / --cy, data-hover over links and buttons

const TILT_MAX = 7; // degrees

export function startPointerLayer(halo: HTMLElement | null) {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  let frame = 0;
  let last: PointerEvent | null = null;
  let tiltEl: HTMLElement | null = null;
  let hx = -100, hy = -100, tx = -100, ty = -100;
  let haloFrame = 0;

  const enabled = () => fine.matches && !reduce.matches && root.dataset.contrast !== 'high';
  const sync = () => root.classList.toggle('pointer-fine', enabled());
  sync();

  const resetTilt = (el: HTMLElement | null) => {
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  const apply = () => {
    frame = 0;
    const e = last;
    if (!e) return;
    const target = e.target as Element | null;

    const spot = target?.closest?.('.spotlight') as HTMLElement | null;
    if (spot) {
      const r = spot.getBoundingClientRect();
      spot.style.setProperty('--sx', `${e.clientX - r.left}px`);
      spot.style.setProperty('--sy', `${e.clientY - r.top}px`);
    }

    const tilt = target?.closest?.('.tilt') as HTMLElement | null;
    if (tilt !== tiltEl) { resetTilt(tiltEl); tiltEl = tilt; }
    if (tilt) {
      const r = tilt.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      tilt.style.setProperty('--ry', `${((px - 0.5) * 2 * TILT_MAX).toFixed(2)}deg`);
      tilt.style.setProperty('--rx', `${((0.5 - py) * 2 * TILT_MAX).toFixed(2)}deg`);
      tilt.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
      tilt.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
    }

    if (halo) {
      tx = e.clientX; ty = e.clientY;
      const interactive = target?.closest?.('a, button, [role="button"], input, select, textarea, label');
      halo.dataset.hover = interactive ? 'true' : 'false';
      const accentHost = target?.closest?.('[class*="accent-"], [class*="field-"]') as HTMLElement | null;
      if (accentHost) halo.style.setProperty('--halo', getComputedStyle(accentHost).getPropertyValue('--accent') || '#0a8a82');
      if (!haloFrame) haloFrame = requestAnimationFrame(followHalo);
    }
  };

  // The halo eases towards the pointer, which gives it a soft trailing feel.
  const followHalo = () => {
    haloFrame = 0;
    if (!halo) return;
    hx += (tx - hx) * 0.22;
    hy += (ty - hy) * 0.22;
    halo.style.setProperty('--cx', `${hx}px`);
    halo.style.setProperty('--cy', `${hy}px`);
    if (Math.abs(tx - hx) > 0.5 || Math.abs(ty - hy) > 0.5) haloFrame = requestAnimationFrame(followHalo);
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !enabled()) return;
    last = e;
    if (halo) halo.dataset.on = 'true';
    if (!frame) frame = requestAnimationFrame(apply);
  };
  const onLeaveWindow = () => {
    if (halo) halo.dataset.on = 'false';
    resetTilt(tiltEl);
    tiltEl = null;
  };

  document.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeaveWindow);
  fine.addEventListener('change', sync);
  reduce.addEventListener('change', sync);
  const contrastObserver = new MutationObserver(sync);
  contrastObserver.observe(root, { attributes: true, attributeFilter: ['data-contrast'] });

  return () => {
    cancelAnimationFrame(frame);
    cancelAnimationFrame(haloFrame);
    document.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeaveWindow);
    fine.removeEventListener('change', sync);
    reduce.removeEventListener('change', sync);
    contrastObserver.disconnect();
    root.classList.remove('pointer-fine');
  };
}
