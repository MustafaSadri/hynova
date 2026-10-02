# PDF assets

`cynapept-logo.png` is a pre-rendered raster copy of `public/logo/cynapept-color.svg`,
used by `src/lib/entry-pass-server.ts` because pdf-lib can only embed PNG/JPEG
images, not SVG. Regenerate it if the source logo changes:

```js
const sharp = require("sharp"); // available transitively; add as a dev dependency if it's gone
sharp("public/logo/cynapept-color.svg", { density: 300 })
  .resize({ height: 300 })
  .png()
  .toBuffer()
  .then((buf) => require("fs").writeFileSync("assets/pdf/cynapept-logo.png", buf));
```
