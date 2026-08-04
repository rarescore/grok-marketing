# RS Marketing animation repair

## Root causes found

1. The old intro enlarged one 2200×880 PNG to 8.8× its size. That was not a camera move; it was an oversized bitmap transform, so the tire became soft and unstable.
2. The tire portal was a separate centered HTML layer. It did not share the wheel's coordinate system, so the transition could drift or jump at different aspect ratios.
3. The intro used independent Web Animations and `setTimeout` calls instead of one authored sequence. Skipping, slow asset loading, or browser timing differences could expose intermediate states.
4. Two permanent `requestAnimationFrame` loops ran after the intro. One recalculated every section and blurred the fixed car every frame; the other redrew a full-screen canvas every frame. These loops caused unnecessary CPU/GPU work while the page was idle.
5. Applying a changing CSS blur to a large transparent PNG forced expensive repeated rasterization. That was the main source of the "laggy" feeling during scroll.
6. The animation and website were being designed simultaneously. This made every revision change both motion and layout, so neither had a stable target.

## Repair used in this package

- The opening is now one deterministic 1920×1080, 60fps H.264 sequence.
- The camera move is mathematically anchored to the selected wheel center.
- The video ends on the exact warm-white homepage color for a seamless handoff.
- A 1280×720 mobile encode is selected automatically on small screens.
- The intro has autoplay, skip, reduced-motion, decoding-error, and autoplay-blocked fallbacks.
- The full-screen telemetry canvas loop was removed.
- Scroll-car animation now runs only while scroll position or interpolation is changing.
- Scroll animation uses transform and opacity only—no animated blur.
- Offscreen sections use `content-visibility` to reduce rendering work.

## Preview

Run a local server from this folder:

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080
```
