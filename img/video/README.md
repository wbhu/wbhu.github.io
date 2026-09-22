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
- RGB: https://jiah-cloud.github.io/GAE.github.io/assets/i2v/videos/re10k_038_rgb.mp4
- Geometry: https://jiah-cloud.github.io/GAE.github.io/assets/i2v/videos/re10k_038_progressive.mp4
- Both sources contain 81 corresponding frames. RGB is 16 fps and geometry
  is 12 fps: use `settb=1/12,setpts=N` on both before composing, producing
  a synchronized 6.75-second loop.
- Render geometry at 640x360, with a 272x153 RGB inset, a 4-pixel teal border,
  and an RGB label at the upper left. Poster: 4.5 seconds into the loop.
- The inset covers the source's small diagnostic counter, leaving the room,
  progressive point cloud, and camera trajectory visible at thumbnail size.

H.264 uses CRF 26 (WorldCrafter) / 23 (GAE), `yuv420p`, and `+faststart`;
VP9 uses CRF 38 / 34 respectively with zero target bitrate. These clips illustrate qualitative
behavior; the paper and project links provide the method and evaluation.
