# RS Marketing — Smooth Cinematic WebGL Experience

A production-oriented React/Vite website inspired by the movement language in the supplied smooth logistics-site reference, reinterpreted for RS Marketing.

## Design direction

The reference was not copied page-for-page. Its useful principles were translated into RS Marketing's story:

- one persistent 3D centerpiece rather than unrelated hero images
- continuous scroll-controlled camera and object movement
- dark cinematic composition with pale glass, restrained green, and warm metallic accents
- large kinetic typography with generous negative space
- single-purpose sections instead of crowded dashboards
- glass-gate, wire-network, data-pillar, package-door, orbital-telemetry, and portal transitions
- RS Marketing's existing services, packages, masked reviews, SEO explanations, and contact information retained

## Exact stack

- React + Vite
- React Three Fiber + drei
- Three.js
- GSAP + ScrollTrigger
- Lenis
- Tailwind CSS

No additional runtime dependency was added. React DOM and the official Vite/Tailwind plugins are the normal supporting packages for the requested stack.

## Run locally

Use Node 20.19+ or Node 22.12+.

```bash
npm install
npm run dev
```

Open the local Vite URL, normally `http://localhost:5173`.

Production build:

```bash
npm run build
npm run preview
```

## Instant no-install preview

Open:

```text
preview/index.html
```

That standalone file is a lightweight visual prototype using native canvas. It is not the production React build, but it lets you inspect the layout and transition concept without installing packages.

## Main edit points

### All content, pricing, reviews, services, projects, and articles

`src/data/content.js`

### Brand settings, logo, email, colors, and future 3D model path

`src/data/siteConfig.js`

### Continuous 3D camera/object choreography

`src/experience/World.jsx`

### Procedural SR-71-inspired signal craft

`src/experience/SignalCraft.jsx`

### Glass gate, network, pillars, package doors, orbit, and contact portal

`src/experience/SceneObjects.jsx`

### GSAP, ScrollTrigger, Lenis, section activation, and text reveals

`src/App.jsx`

### Visual system and responsive layouts

`src/styles.css`

## Replace the procedural aircraft with a studio model

Export a compressed GLB from Blender/Cinema 4D and place it in:

```text
public/models/rs-blackbird.glb
```

The current build intentionally uses a procedural craft so the project runs without external assets. A production aircraft model should use:

- one to three draw-call groups where practical
- baked or compressed PBR textures
- 2K textures for desktop, 1K mobile variants
- Draco or Meshopt compression
- clean pivots and forward direction documented in `public/models/README.md`

## Performance behavior

- WebGL loads lazily.
- DPR is capped at 1.5.
- Low-power mobile devices can receive the CSS fallback.
- The scene uses procedural geometry, lines, points, and restrained lights rather than expensive post-processing.
- `prefers-reduced-motion` disables smooth scrolling and replaces the WebGL scene with a static readable fallback.
- All business content remains semantic HTML above the decorative canvas.

## Truth and launch checklist

The project preserves existing RS Marketing figures and masked review copy, but labels unverifiable claims in the interface and source. Before publishing:

1. Verify the 4.9-star source and permissions.
2. Verify the ad-spend figure with supporting records.
3. Confirm every review quote and client permission.
4. Replace demo activity notifications with a real CRM/checkout feed or remove them.
5. Connect the form to a real endpoint instead of the current email fallback.
6. Add final privacy policy, terms, analytics consent, and legal business details.
