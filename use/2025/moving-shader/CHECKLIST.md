## Particle Point Cloud Checklist

- [x] Confirm source image asset and loading mechanism for sampling.
- [x] Review existing helpers in `geometryUtil.ts`/`geometryHelper.ts` for reusable pieces.
- [x] Implement image-to-point-cloud loader producing position and color arrays.
- [x] Build `THREE.BufferGeometry` with `position` and `color` attributes and a `THREE.PointsMaterial` using vertex colors.
- [x] Replace the textured plane in the scene with the new point cloud and verify alignment/aspect.
- [ ] Adjust sampling density/transparency handling and prepare hooks for future particle motion.
