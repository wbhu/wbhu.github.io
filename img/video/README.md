# Publication teaser sources

The September 2026 additions use actual project outputs, encoded locally as
muted MP4 (H.264) and WebM (VP9) loops with JPEG poster frames.

## WorldCrafter

- Project: https://drexubery.github.io/WorldCrafter/
- Source: the project owner's supplied `WorldCrafter_Interactive_Demo.mp4`.
- Case: the classroom with “WorldCrafter” written on its blackboard; select
  75.6–90.85 seconds, excluding the transitions to adjacent cases. The 15.25-second
  loop preserves the room exploration, return to the blackboard, and look up.
- The supplied demo labels this sequence as 6x speed. Retain its timing without
  further acceleration, label 6x on the card, and encode at 24 fps without audio.
- Crop the 1920x1080 source to its generated viewport (`1352:806:278:108`),
  keeping the keyboard overlays while removing the outer presentation margin
  and small runtime statistics. Scale proportionally to 604x360 and pad to
  640x360. Poster: 0.4 seconds into the encoded loop.
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

H.264 uses CRF 25 (WorldCrafter) / 23 (GAE), `yuv420p`, and `+faststart`;
VP9 uses CRF 35 / 34 respectively with zero target bitrate. These clips illustrate qualitative
behavior; the paper and project links provide the method and evaluation.

## Looking Ahead (October 2026)

- Project: https://hellorpg.github.io/looking-ahead/
- Official hero video: https://hellorpg.github.io/looking-ahead/assets/hero/r13-00064-42.mp4
- Official poster: https://hellorpg.github.io/looking-ahead/assets/hero/r13-00064-42.jpg
- Case: `r13-00064-42`, Domino chain reaction. Preserve the complete five-second,
  640x360, 24 fps source loop and its timing. The MP4 and JPEG are unchanged;
  WebM is encoded locally with VP9, CRF 35, zero target bitrate, without audio.
- This is a qualitative project demonstration, not a benchmark comparison.
