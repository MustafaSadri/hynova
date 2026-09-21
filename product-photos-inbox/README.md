# Product mockup uploads

Drop your product photos here, then tell me they're ready — I'll process, resize, and wire them into the site for both languages.

## Where to put files

- `en/` — English-packaging mockups
- `ru/` — Russian-packaging mockups

## Filenames (exactly 4 per folder)

Name each file to match its product — extension can be `.jpg` or `.png`, doesn't matter, I'll normalize it:

| Filename | Product |
|---|---|
| `tirzepatide-pen` | Tirzepatide Pen |
| `retatrutide-pen` | Retatrutide Pen |
| `retatrutide-vial` | Retatrutide Vial |
| `orforglipron-tablets` | Orforglipron Tablets |

So `en/` should end up with 4 files, `ru/` with 4 files — 8 total.

## Photo specs (source photos, before I process them)

- **Resolution:** at least 2000px on the longest side. The site displays these fairly small, but I need headroom to crop tightly around the product and still look sharp on retina phone/laptop screens.
- **Background:** plain white or light gray, evenly lit, no harsh shadows. I run automatic background removal — a clean, high-contrast background makes that come out clean; busy backgrounds or reflections can leave visible edges.
- **Framing:** product centered, not cropped at the edges, no other objects in frame. Any orientation (portrait, landscape, square) is fine — I crop to fit automatically, you don't need to pre-crop or resize.
- **Format:** JPG or PNG, whichever your camera/export gives you.

You don't need to resize, crop, or remove backgrounds yourself — just get a clean, sharp, well-lit shot of each product and drop it in. I'll handle the rest with the same pipeline already used for the current product photos on the site (`scripts/process-product-photo.mjs`).
