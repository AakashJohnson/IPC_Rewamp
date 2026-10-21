// Generates web-ready variants of the official IPC images in assets/official into public/images/official.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = path.resolve('assets/official');
const OUT = path.resolve('public/images/official');
fs.mkdirSync(OUT, { recursive: true });

const jobs = [
  // name, source, widths, options
  ['ip-2026-volumes', 'ip-2026-volumes.jpg', [480, 900, 1400], { quality: 78 }],
  ['ip-2026-launch', 'ip-2026-launch.jpg', [800, 1600], { quality: 76 }],
  ['ipc-headquarters', 'ipc-headquarters.jpg', [640], { quality: 82 }],
  ['training-1', 'training-1.png', [256], { quality: 82 }],
  ['training-2', 'training-2.jpg', [240], { quality: 82 }],
  ['training-3', 'training-3.jpg', [240], { quality: 82 }],
  ['nfi-2026', 'nfi-2026.png', [200], { quality: 85 }],
  ['iprs', 'iprs.png', [114], { quality: 85 }],
];

for (const [name, file, widths, { quality }] of jobs) {
  const input = path.join(SRC, file);
  const meta = await sharp(input).metadata();
  for (const w of widths) {
    const width = Math.min(w, meta.width);
    await sharp(input).resize({ width }).webp({ quality }).toFile(path.join(OUT, `${name}-${w}.webp`));
  }
  console.log(`${name}: ${widths.join(', ')}`);
}

// The official logo (State Emblem + IPC wordmark) is kept lossless; transparent PNG at ~2.5x of its rendered header height.
const logo = path.join(SRC, 'ipc-logo.png');
await sharp(logo).resize({ height: 192 }).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'ipc-logo-192.png'));
// Emblem-only crop (top portion of the lockup) for favicon / compact header.
const { width: lw } = await sharp(logo).metadata();
const emblem = sharp(logo).extract({ left: 0, top: 0, width: lw, height: 345 });
await emblem.clone().resize({ height: 128 }).png().toFile(path.join(OUT, 'ipc-emblem-128.png'));
await emblem.clone().resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(OUT, 'ipc-emblem-32.png'));
await sharp(path.join(SRC, 'swachh-bharat.png')).resize({ height: 96 }).png().toFile(path.join(OUT, 'swachh-bharat-96.png'));
await sharp(path.join(SRC, 'pharmacopoeial-forum.png')).png().toFile(path.join(OUT, 'pharmacopoeial-forum.png'));
console.log('logo + emblem + marks done');
