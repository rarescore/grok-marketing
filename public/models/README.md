# Final aircraft model specification

Place the production file at `public/models/rs-blackbird.glb`.

Recommended export:

- GLB / glTF 2.0
- nose points toward local +Z
- top points toward local +Y
- origin centered around the aircraft's visual center of mass
- real-world scale is not required, but the model should fit within roughly 8 x 3 x 8 Three.js units after import
- PBR metallic/roughness materials
- no embedded lights or cameras
- 2K maximum texture set for desktop
- separate 1K mobile model if the final asset is heavy
- Draco or Meshopt compression
- target under 8 MB desktop and under 3 MB mobile

After adding the model, create or update a loader component and switch `modelUrl` in `src/data/siteConfig.js`.
