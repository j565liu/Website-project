# Images

## `hero-fallback.jpg` (required before launch)

Shown in place of the hero video while it loads, when the video files are missing or fail,
and for visitors who have "reduce motion" turned on. It is also the video's poster frame.

- **Content:** ideally the first frame of the hero video (see `public/videos/README.md`).
- **Dimensions:** 2400 × 1350 (16:9). Keep the subject near the centre, since it is
  cropped to fill every screen shape.
- **Format:** JPEG, progressive, quality around 75.
- **Max size:** 400 KB. The site automatically serves smaller, optimized versions to phones.
- **Look:** dark and low-contrast, matching the brand. The page darkens the lower part
  of the image so the headline stays readable.

Until this file exists, the hero shows a plain dark background.

Use only images you own or have licensed for commercial web use.

## Page background photos

Every page except the home page shows a photo behind its content, darkened so text stays easy
to read. The list of which photo goes on which page is in `content/backgrounds.ts`:

```ts
export const pageBackgrounds = {
  default: "/images/hero-fallback.jpg",   // used by any page not listed below
  "/events": "/images/events.jpg",        // example: a different photo for Events
};
```

To change a photo: add the image to this folder, then add or edit its line in that file.
A page also covers its sub-pages (`"/register"` applies to the confirmation pages too).

- **Dimensions:** at least 2000 px wide, landscape. The photo is cropped to fill the screen,
  so keep the subject near the centre.
- **Max size:** about 500 KB. The site serves smaller versions to phones automatically.
- **Look:** anything works because the site darkens it by 85%, but calm, warm, low-detail photos
  (a candlelit table, glassware, a room before guests arrive) look best behind text.
