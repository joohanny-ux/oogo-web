#!/usr/bin/env node
/**
 * Local helper for OOGO media workflow.
 *
 * What this does:
 * 1) Creates an originals/ + web/ folder layout (Google Drive friendly)
 * 2) Optionally converts originals → optimized WebP into web/
 *
 * Run on your PC (where Google Drive is mounted), not required on the server.
 *
 * Examples (PowerShell):
 *   node scripts/prepare-web-images.mjs --root "G:\내 드라이브\Joohanny_Project\oogo-web\media"
 *   node scripts/prepare-web-images.mjs --root "G:\...\oogo-web\media" --convert
 *
 * Folder layout created:
 *   media/
 *     originals/
 *       products/
 *       archive/oogo/
 *       archive/youngbin-edition/
 *       landing/
 *     web/
 *       products/
 *       archive/oogo/
 *       archive/youngbin-edition/
 *       landing/
 */

import { mkdir, readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const folders = [
  "originals/products",
  "originals/archive/oogo",
  "originals/archive/youngbin-edition",
  "originals/landing",
  "web/products",
  "web/archive/oogo",
  "web/archive/youngbin-edition",
  "web/landing"
];

const presets = {
  products: { maxEdge: 1800, quality: 78 },
  archive: { maxEdge: 2400, quality: 84 },
  landing: { maxEdge: 2200, quality: 80 }
};

function parseArgs(argv) {
  const args = { root: "", convert: false };
  for (let i = 2; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === "--convert") args.convert = true;
    if (value === "--root") args.root = argv[i + 1] ?? "";
  }
  return args;
}

function presetForRelativeDir(relativeDir) {
  if (relativeDir.startsWith("archive")) return presets.archive;
  if (relativeDir.startsWith("landing")) return presets.landing;
  return presets.products;
}

async function ensureFolders(root) {
  for (const folder of folders) {
    await mkdir(path.join(root, folder), { recursive: true });
  }
}

async function listImageFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listImageFiles(full)));
      continue;
    }
    if (/\.(jpe?g|png|webp)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

async function convertTree(root) {
  const originalsRoot = path.join(root, "originals");
  const webRoot = path.join(root, "web");
  const files = await listImageFiles(originalsRoot);
  let converted = 0;

  for (const file of files) {
    const relative = path.relative(originalsRoot, file);
    const relativeDir = path.dirname(relative).replaceAll("\\", "/");
    const preset = presetForRelativeDir(relativeDir);
    const outDir = path.join(webRoot, path.dirname(relative));
    await mkdir(outDir, { recursive: true });

    const outName = `${path.parse(file).name}.webp`;
    const outPath = path.join(outDir, outName);
    const source = await readFile(file);
    const result = await sharp(source, { failOn: "none" })
      .rotate()
      .resize({
        width: preset.maxEdge,
        height: preset.maxEdge,
        fit: "inside",
        withoutEnlargement: true
      })
      .webp({ quality: preset.quality, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    await writeFile(outPath, result.data);
    const sourceStat = await stat(file);
    converted += 1;
    console.log(
      `${relative} -> web/${path.join(path.dirname(relative), outName).replaceAll("\\", "/")} ` +
        `(${(sourceStat.size / 1024 / 1024).toFixed(2)}MB -> ${(result.data.byteLength / 1024 / 1024).toFixed(2)}MB, ` +
        `${result.info.width}x${result.info.height})`
    );
  }

  return converted;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.root) {
    console.error('Missing --root "G:\\...\\oogo-web\\media"');
    process.exit(1);
  }

  const root = path.resolve(args.root);
  await ensureFolders(root);
  console.log(`Folders ready under: ${root}`);
  console.log(folders.map((folder) => ` - ${folder}`).join("\n"));

  if (!args.convert) {
    console.log("\nNext:");
    console.log("1) Put originals into originals/...");
    console.log("2) Re-run with --convert");
    console.log("3) Upload files from web/... in Admin (or replace existing assets)");
    return;
  }

  const count = await convertTree(root);
  console.log(`\nConverted ${count} image(s) into web/`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
