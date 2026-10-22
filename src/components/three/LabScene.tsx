import { useEffect, useRef, type RefObject } from 'react';
import { registerScene } from './sceneManager';

// Code-rendered 3D layer: floating glass molecules and two-tone capsules lit by a studio environment.
// three.js is imported on demand so it never sits in the first-paint bundle. The canvas is transparent and
// decorative (aria-hidden). Only the most visible scene on the page animates (sceneManager); it renders one
// still frame for reduced motion and renders nothing at all if WebGL is unavailable.
//
// Orbit mode (`orbit` = the element to frame): objects travel along a band around that element's box and
// the canvas is masked over the box itself, so they frame the picture and never cross it.

export type LabVariant = 'molecules' | 'capsules' | 'mixed';

interface Props {
  accent: string;
  variant?: LabVariant;
  className?: string;
  /** Number of objects; kept small for mobile GPUs. */
  count?: number;
  orbit?: RefObject<HTMLElement | null>;
}

const FPS = 45;

export function LabScene({ accent, variant = 'mixed', className = '', count = 9, orbit }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const accentRef = useRef(accent);
  accentRef.current = accent;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    import('three').then(async THREE => {
      if (disposed) return;
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      } catch {
        return; // No WebGL: the section's colour field and imagery carry the design on their own.
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 0, 14);

      const key = new THREE.DirectionalLight(0xffffff, 1.4);
      key.position.set(4, 6, 8);
      scene.add(key, new THREE.AmbientLight(0xffffff, 0.35));

      const accentColor = new THREE.Color(accentRef.current);
      // Glass look without transmission (which costs a second render pass every frame).
      const glass = new THREE.MeshPhysicalMaterial({
        color: accentColor.clone().lerp(new THREE.Color('#ffffff'), 0.7), roughness: 0.04, metalness: 0,
        clearcoat: 1, clearcoatRoughness: 0.03, transparent: true, opacity: 0.6, envMapIntensity: 1.6,
      });
      const tinted = new THREE.MeshPhysicalMaterial({ color: accentColor, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1, sheen: 0.4 });
      const pearl = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.32, clearcoat: 0.8 });
      const bondMat = new THREE.MeshPhysicalMaterial({ color: 0xdfe8f2, roughness: 0.3, metalness: 0.1 });

      const atomGeo = new THREE.SphereGeometry(0.42, 32, 32);
      const bondGeo = new THREE.CylinderGeometry(0.09, 0.09, 1, 12);
      const capCyl = new THREE.CylinderGeometry(0.5, 0.5, 0.9, 32, 1, true);
      const capEnd = new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);

      // A benzene-like ring with substituents: six atoms, alternating materials, joined by bonds.
      const molecule = () => {
        const g = new THREE.Group();
        const pts: InstanceType<typeof THREE.Vector3>[] = [];
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i;
          pts.push(new THREE.Vector3(Math.cos(a) * 1.25, Math.sin(a) * 1.25, 0));
        }
        pts.push(pts[0].clone().multiplyScalar(1.9), pts[3].clone().multiplyScalar(1.9));
        const links: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 6], [3, 7]];
        pts.forEach((p, i) => {
          const m = new THREE.Mesh(atomGeo, i % 3 === 0 ? tinted : i % 2 ? glass : pearl);
          m.position.copy(p);
          if (i >= 6) m.scale.setScalar(0.8);
          g.add(m);
        });
        links.forEach(([a, b]) => {
          const pa = pts[a], pb = pts[b];
          const bond = new THREE.Mesh(bondGeo, bondMat);
          bond.position.copy(pa).add(pb).multiplyScalar(0.5);
          bond.scale.y = pa.distanceTo(pb);
          bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pb.clone().sub(pa).normalize());
          g.add(bond);
        });
        return g;
      };

      // A two-tone hard capsule: accent half and pearl half.
      const capsule = () => {
        const g = new THREE.Group();
        const top = new THREE.Mesh(capCyl, tinted); top.position.y = 0.45;
        const bot = new THREE.Mesh(capCyl, pearl); bot.position.y = -0.45;
        const t = new THREE.Mesh(capEnd, tinted); t.position.y = 0.9;
        const b = new THREE.Mesh(capEnd, pearl); b.position.y = -0.9; b.rotation.x = Math.PI;
        g.add(top, bot, t, b);
        return g;
      };

      const items: { g: InstanceType<typeof THREE.Group>; speed: number; phase: number; spin: InstanceType<typeof THREE.Vector3>; base: InstanceType<typeof THREE.Vector3> }[] = [];
      for (let i = 0; i < count; i++) {
        const kind = variant === 'molecules' ? 'm' : variant === 'capsules' ? 'c' : i % 3 === 0 ? 'm' : 'c';
        const g = kind === 'm' ? molecule() : capsule();
        // Free mode: deterministic layout, biased to the edges and the right.
        const base = new THREE.Vector3(((i * 2.7) % 12) - 4, ((i * 2.3) % 8.4) - 4.2, -((i * 1.3) % 4));
        g.position.copy(base);
        const s = (kind === 'm' ? 0.62 + ((i * 0.13) % 0.35) : 0.95 + ((i * 0.17) % 0.5)) * (orbit ? 0.42 : 1);
        g.scale.setScalar(s);
        g.rotation.set(i * 0.7, i * 1.1, i * 0.4);
        scene.add(g);
        items.push({ g, base, speed: 0.25 + (i % 4) * 0.08, phase: i * 1.37, spin: new THREE.Vector3(0.12 + (i % 3) * 0.05, 0.18 + (i % 2) * 0.07, 0.05) });
      }

      // Orbit band in world units: the framed box, grown by a margin, in the plane z = 0.
      const band = { x0: 0, x1: 0, y0: 0, y1: 0, on: false };
      const measure = () => {
        const w = el.clientWidth || 1, h = el.clientHeight || 1;
        const target = orbit?.current;
        if (!target) { band.on = false; el.style.removeProperty('--hole'); return; }
        const hr = el.getBoundingClientRect(), r = target.getBoundingClientRect();
        const worldH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
        const u = worldH / h; // world units per pixel at z = 0
        const toX = (px: number) => (px - w / 2) * u;
        const toY = (py: number) => (h / 2 - py) * u;
        const m = 1.05; // band offset from the box edge: wider than half an object, so none straddles it
        band.x0 = toX(r.left - hr.left) - m;
        band.x1 = toX(r.right - hr.left) + m;
        band.y1 = toY(r.top - hr.top) + m;
        band.y0 = toY(r.bottom - hr.top) - m;
        band.on = true;
        // CSS mask hole over the box, so nothing can ever render on the picture.
        el.style.setProperty('--hole-x', `${r.left - hr.left}px`);
        el.style.setProperty('--hole-y', `${r.top - hr.top}px`);
        el.style.setProperty('--hole-w', `${r.width}px`);
        el.style.setProperty('--hole-h', `${r.height}px`);
      };
      // A point travelling around the band's perimeter; t in [0, 1).
      const onBand = (t: number, out: InstanceType<typeof THREE.Vector3>) => {
        const w = band.x1 - band.x0, h = band.y1 - band.y0, p = 2 * (w + h);
        let d = (((t % 1) + 1) % 1) * p;
        if (d < w) out.set(band.x0 + d, band.y1, 0);
        else if ((d -= w) < h) out.set(band.x1, band.y1 - d, 0);
        else if ((d -= h) < w) out.set(band.x1 - d, band.y0, 0);
        else { d -= w; out.set(band.x0, band.y0 + d, 0); }
        return out;
      };

      const resize = () => {
        const w = el.clientWidth || 1, h = el.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        measure();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      if (orbit?.current) ro.observe(orbit.current);
      if (orbit) el.classList.add('orbit-masked');

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let px = 0, py = 0, cx = 0, cy = 0;
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        px = (e.clientX / window.innerWidth) * 2 - 1;
        py = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      const tmp = new THREE.Vector3();
      const target = new THREE.Color();
      let raf = 0, running = false, last = 0, time = 0, tick = 0;
      const draw = (dt: number) => {
        time += dt;
        // The framed box moves with scroll and pointer parallax: re-measure a few times a second.
        if (orbit && ++tick % 8 === 0) measure();
        target.set(accentRef.current);
        tinted.color.lerp(target, 0.08);
        glass.color.lerp(target.clone().lerp(new THREE.Color('#ffffff'), 0.7), 0.08);
        cx += (px - cx) * 0.06; cy += (py - cy) * 0.06;
        if (band.on) {
          // Orbit: tilt the scene with the pointer instead of moving the camera, so the band stays aligned.
          scene.rotation.y = cx * 0.06; scene.rotation.x = cy * 0.04;
          camera.position.set(0, 0, 14);
        } else {
          camera.position.x = cx * 1.6; camera.position.y = -cy * 1.1;
        }
        camera.lookAt(0, 0, 0);
        items.forEach((it, i) => {
          if (band.on) {
            onBand(i / items.length + time * 0.012, tmp);
            it.g.position.set(tmp.x, tmp.y + Math.sin(time * it.speed + it.phase) * 0.12, Math.sin(time * 0.3 + it.phase) * 0.6);
          } else {
            it.g.position.y = it.base.y + Math.sin(time * it.speed + it.phase) * 0.45;
            it.g.position.x = it.base.x + Math.cos(time * it.speed * 0.7 + it.phase) * 0.25;
          }
          it.g.rotation.x += it.spin.x * dt * 0.6;
          it.g.rotation.y += it.spin.y * dt * 0.6;
        });
        renderer.render(scene, camera);
      };
      const loop = (now: number) => {
        raf = 0;
        if (!running) return;
        const dt = last ? (now - last) / 1000 : 1 / FPS;
        if (now - last >= 1000 / FPS - 2) { draw(Math.min(dt, 0.1)); last = now; }
        raf = requestAnimationFrame(loop);
      };
      const start = () => { if (reduce || running) return; running = true; last = 0; raf = requestAnimationFrame(loop); };
      const stop = () => { running = false; cancelAnimationFrame(raf); raf = 0; };
      draw(0); // one still frame for every scene, animated or not
      const unregister = registerScene(el, start, stop);

      cleanup = () => {
        stop();
        unregister();
        ro.disconnect();
        window.removeEventListener('pointermove', onMove);
        scene.traverse(o => { if ((o as InstanceType<typeof THREE.Mesh>).isMesh) (o as InstanceType<typeof THREE.Mesh>).geometry.dispose(); });
        [glass, tinted, pearl, bondMat].forEach(m => m.dispose());
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }).catch(() => { /* chunk failed to load: decorative layer simply stays empty */ });

    return () => { disposed = true; cleanup(); };
  }, [variant, count, orbit]);

  return <div ref={host} aria-hidden className={`pointer-events-none ${className}`} />;
}
