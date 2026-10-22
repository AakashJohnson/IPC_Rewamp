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
// Emblem-only crop (top portion of the lockup) for favicon / compact header.
const { width: lw } = await sharp(logo).metadata();
const emblem = sharp(logo).extract({ left: 0, top: 0, width: lw, height: 345 });
await emblem.clone().resize({ height: 128 }).png().toFile(path.join(OUT, 'ipc-emblem-128.png'));
await emblem.clone().resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(OUT, 'ipc-emblem-32.png'));
console.log('logo + emblem + marks done');

// AVIF + WebP sets for the hero and story imagery. Portraits are crops of official IPC carousel slides
// (see README, "Asset provenance"); scenes are generated backgrounds with no text or logos.
const RESPONSIVE = [
  // [outDir, name, source, widths]
  ['official', 'ip-2026-volumes', 'official/ip-2026-volumes.jpg', [640, 1000]],
  // Photograph area of the official "IP 2026 launch" carousel slide, without the slide's text banner.
  ['official', 'ip-2026-release-photo', 'official/ip-2026-release-photo.jpg', [640, 1100]],
  // Generated with Canva (see README, "Asset provenance"). Leader banners are generated likenesses
  // from the official portraits and are always captioned "Digital illustration" on the site.
  ['generated', 'leader-modi', 'gen2/leader-modi.jpg', [768, 1280, 1920]],
  ['generated', 'leader-nadda', 'gen2/leader-nadda.jpg', [768, 1280, 1920]],
  ['generated', 'leader-patel', 'gen2/leader-patel.jpg', [768, 1280, 1920]],
  ['generated', 'ip-volumes', 'gen2/ip-volumes.jpg', [768, 1280, 1920]],
  ['generated', 'iprs-vials', 'gen2/iprs-vials.jpg', [768, 1280, 1920]],
  ['generated', 'story-need', 'gen2/story-need.jpg', [640, 1080, 1440]],
  ['generated', 'story-development', 'gen2/story-development.jpg', [640, 1080, 1440]],
  ['generated', 'story-review', 'gen2/story-review.jpg', [640, 1080, 1440]],
];

for (const [dir, name, file, widths] of RESPONSIVE) {
  const out = path.resolve('public/images', dir);
  fs.mkdirSync(out, { recursive: true });
  const input = path.resolve('assets', file);
  const meta = await sharp(input).metadata();
  for (const w of widths) {
    const img = sharp(input).resize({ width: Math.min(w, meta.width) });
    await img.clone().avif({ quality: 52, effort: 6 }).toFile(path.join(out, `${name}-${w}.avif`));
    await img.clone().webp({ quality: 74 }).toFile(path.join(out, `${name}-${w}.webp`));
  }
  console.log(`${dir}/${name}: ${widths.join(', ')} (avif, webp)`);
}

// "Powered by Anuvadini": the supplied logo, only its uniform white margin trimmed. Colours and proportions untouched.
const brandOut = path.resolve('public/images/brand');
fs.mkdirSync(brandOut, { recursive: true });
await sharp(path.resolve('assets/brand/anuvadini-logo.png'))
  .trim({ threshold: 12 })
  .resize({ height: 96 })
  .png({ compressionLevel: 9 })
  .toFile(path.join(brandOut, 'anuvadini-logo-96.png'));
console.log('brand/anuvadini-logo-96.png');
