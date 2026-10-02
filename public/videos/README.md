# Hero video

> **Replacing the video?** All four files below must contain the same footage. Browsers pick
> whichever format they support first (most use the `.webm` files), so replacing only the `.mp4`
> files leaves most visitors seeing the old video. The simplest route: upload your new video under
> any name and ask for all four files to be regenerated from it.

The home page hero plays a silent background video. Add these two files to this folder
(the site works without them and shows the fallback image instead):

| File | Format | Max size |
|---|---|---|
| `hero.webm` | WebM, VP9 codec (tried first by browsers that support it) | 4 MB |
| `hero.mp4` | MP4, H.264 codec, `yuv420p` pixel format (Safari and older browsers) | 6 MB |
| `hero-mobile.webm` | 720p WebM version for phones and tablets | 2 MB |
| `hero-mobile.mp4` | 720p MP4 version for phones and tablets | 2.5 MB |

The video starts only after the rest of the page has loaded, so it never slows down the first
view. Phones and tablets get the smaller `hero-mobile` files (falling back to the full-size ones
if those are missing). Visitors with "reduce motion" or data saver turned on see the still image.

## Recommended specs

- **Duration:** 10–20 seconds, cut so the last frame flows into the first (it loops).
- **Resolution:** 1920 × 1080 (16:9). The video is cropped to fill any screen shape,
  so keep the important subject near the centre.
- **Frame rate:** 24 or 25 fps.
- **Audio:** none. Remove the audio track entirely (it is muted anyway, and removing it saves size).
- **Look:** dark, low-contrast, slow movement: candlelight, glassware, hands, a room
  before guests arrive. Avoid readable faces, logos, or venue signage. The page darkens
  the bottom of the frame so the text stays legible.
- **First frame:** should match `public/images/hero-fallback.jpg` so the switch from
  image to video is invisible.

## Example export commands (ffmpeg)

```sh
ffmpeg -i source.mov -an -vf "scale=1920:-2,fps=24" -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 hero.webm
ffmpeg -i source.mov -an -vf "scale=1920:-2,fps=24" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart hero.mp4
ffmpeg -i source.mov -an -vf "scale=-2:720,fps=24" -c:v libvpx-vp9 -b:v 0 -crf 42 -row-mt 1 hero-mobile.webm
ffmpeg -i source.mov -an -vf "scale=-2:720,fps=24" -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart hero-mobile.mp4
```

Use only footage you own or have licensed for commercial web use.
