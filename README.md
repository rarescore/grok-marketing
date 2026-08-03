# RS Marketing — Terminal/Race Experience

A complete, immediately runnable RS Marketing website built around the approved Formula-car narrative:

1. RS car enters from the left.
2. Camera follows the car.
3. The rear wheel fills the screen.
4. The wheel becomes the RS portal.
5. A white flash reveals the bright marketing site.
6. The same car continues through system, services, pricing, results, work, SEO Lab, and contact chapters.

## Fastest preview

Open `index.html` directly in a modern browser. The immediate version has no build step and no external CDN dependency.

For the most accurate local preview, run:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Primary files

- `index.html` — all page content and semantic structure.
- `styles.css` — visual design, responsive layout, intro styling, and motion system.
- `app.js` — intro timeline, smooth car movement, service tabs, calculator, demo plan counts, telemetry canvas, and contact behavior.
- `assets/rs-formula-car.png` — consistent high-resolution RS Formula car.
- `assets/rs-marketing.svg` — editable vector logo.
- `IMPLEMENTATION_MAP.md` — scene-by-scene production map.
- `react-source/` — React/Vite version using the requested creative-development stack.

## Important launch edits

1. Replace `YOUR-DOMAIN.com` in `robots.txt` and `sitemap.xml`.
2. Connect the contact form to a real form service or backend. It currently opens a prepared email to `hello.rarescore@gmail.com`.
3. Replace masked review previews and sample result figures with verified client material.
4. Connect pricing activity counts to real CRM/checkout data before removing the small `demo` labels.
5. Replace the supplied pre-rendered car PNG with a studio-quality transparent render or GLB model when the final RS1 car asset is ready.

## Performance strategy

- All major movement uses compositor-friendly CSS transforms.
- The car is a high-resolution pre-rendered transparent asset, avoiding heavy real-time reflections and ray tracing.
- The telemetry layer uses one lightweight high-DPI canvas.
- Pixel density is capped at 2.
- Mobile layouts simplify fixed-car animation.
- `prefers-reduced-motion` skips the intro and disables continuous movement.

A browser may animate at 120 Hz on a capable display, GPU, and browser, but no site can guarantee 120 FPS on every device.
