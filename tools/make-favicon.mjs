// Builds the site favicon set from the profile photo.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const SRC = "public/images/profile.png";
// A slightly tighter frame than the avatar: the head fills a 16px tab icon.
const CROP = { left: 110, top: 20, width: 420, height: 420 };

const square = (size) =>
  sharp(SRC).extract(CROP).resize(size, size, { fit: "cover" }).png({ compressionLevel: 9 }).toBuffer();

// The same crop, clipped to a circle so the icon reads as a round avatar.
const circle = async (size) => {
  const r = size / 2;
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${r}" cy="${r}" r="${r}" fill="#fff"/></svg>`,
  );
  return sharp(await square(size))
    .composite([{ input: mask, blend: "dest-in" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
};

// ICO with PNG payloads (supported by every browser that matters).
async function ico(sizes) {
  const images = await Promise.all(sizes.map(circle));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);

  let offset = 6 + 16 * sizes.length;
  const entries = sizes.map((size, i) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(images[i].length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += images[i].length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images]);
}

await writeFile("public/favicon.ico", await ico([16, 32, 48]));
for (const [name, size] of [["icon-192.png", 192], ["icon-512.png", 512]]) {
  await writeFile(`public/${name}`, await circle(size));
}
// iOS fills transparency with black and applies its own rounding, so this one stays square.
await writeFile("public/apple-touch-icon.png", await square(180));
console.log("favicon set written");
