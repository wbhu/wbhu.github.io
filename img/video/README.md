# Publication teaser sources

The September 2026 additions use actual project outputs, encoded locally as
muted MP4 (H.264) and WebM (VP9) loops with JPEG poster frames.

## WorldCrafter

- Project: https://drexubery.github.io/WorldCrafter/
- Source: https://drexubery.github.io/WorldCrafter/assets/consistency/pavilion/output.mp4
- Preserve the full 51.4-second exploration and revisit, played at 2x speed
  (also labeled on the card); encode at 18 fps.
- Fit the 640x384 source into 480x270 without cropping or stretching, using
  15-pixel side padding. Poster: 1 second into the encoded loop.
- The clip shows generated RGB video, not an explicit internal memory or a
  reconstruction of that memory.

## GAE

- Project: https://jiah-cloud.github.io/GAE.github.io/
- Case: `world-089`, Village Street, selected by the project owner from
  21–27 seconds of `03_GAE_Native_Latent_30s_No_Music.mp4` (V4_World089).
- RGB: https://jiah-cloud.github.io/GAE.github.io/assets/teaser-sync/world-089_rgb.mp4
- Geometry: https://jiah-cloud.github.io/GAE.github.io/assets/teaser-sync/world-089_progressive.mp4
- Both original sources contain 81 corresponding frames at 13.5 fps. Use
  `settb=2/27,setpts=N` on both before composing a synchronized 6-second loop.
  Source hashes were checked against the supplied video's edit manifest.
- Render geometry at 640x360, with a 272x153 RGB inset, a 4-pixel teal border,
  and an RGB label at the upper left. Poster: 2 seconds into the loop.
- The inset covers the source's small diagnostic counter, leaving the car,
  progressive point cloud, and camera trajectory visible at thumbnail size.

H.264 uses CRF 26 (WorldCrafter) / 23 (GAE), `yuv420p`, and `+faststart`;
VP9 uses CRF 38 / 34 respectively with zero target bitrate. These clips illustrate qualitative
behavior; the paper and project links provide the method and evaluation.
