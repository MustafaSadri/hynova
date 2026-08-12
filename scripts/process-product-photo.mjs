// Cuts a product photo's background out (ML segmentation, so it's safe on
// white-on-white packaging) and crops to the product's bounding box with a
// small margin. Doesn't touch the artwork itself — only the surrounding
// canvas.
//
// Usage: node scripts/process-product-photo.mjs <input.jpg> <output.png> [marginPct=0.05]

import { removeBackground } from "@imgly/background-removal-node";
import { Jimp } from "jimp";
import { writeFile } from "fs/promises";

const [, , inPath, outPath, marginPctArg] = process.argv;
if (!inPath || !outPath) {
  console.error(
    "usage: node scripts/process-product-photo.mjs <input.jpg> <output.png> [marginPct=0.05]",
  );
  process.exit(1);
}
const marginPct = marginPctArg ? Number(marginPctArg) : 0.05;

const blob = await removeBackground(inPath);
const cutoutBuffer = Buffer.from(await blob.arrayBuffer());

const image = await Jimp.read(cutoutBuffer);
const { width, height } = image.bitmap;
const data = image.bitmap.data;

let minX = width, minY = height, maxX = 0, maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const a = data[(y * width + x) * 4 + 3];
    if (a > 10) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

const boxW = maxX - minX + 1;
const boxH = maxY - minY + 1;
const marginX = Math.round(boxW * marginPct);
const marginY = Math.round(boxH * marginPct);

const cropX = Math.max(0, minX - marginX);
const cropY = Math.max(0, minY - marginY);
const cropW = Math.min(width - cropX, boxW + marginX * 2);
const cropH = Math.min(height - cropY, boxH + marginY * 2);

image.crop({ x: cropX, y: cropY, w: cropW, h: cropH });
await image.write(outPath);

console.log(`${inPath} -> ${outPath} (${cropW}x${cropH})`);
