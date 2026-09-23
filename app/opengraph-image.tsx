import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}: private gatherings for Toronto professionals`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const cormorant = await readFile(join(process.cwd(), "assets/fonts/CormorantGaramond-Light.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px 96px",
          background: "#0a0a0a",
          color: "#f5f3ef",
          fontFamily: "Cormorant",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 8, color: "#a39e94", textTransform: "uppercase" }}>
          {`${site.city} · Private gatherings`}
        </div>
        <div style={{ fontSize: 136, lineHeight: 1, marginTop: 28 }}>{site.name}</div>
        <div style={{ width: 96, height: 2, background: "#b89b5e", marginTop: 56 }} />
      </div>
    ),
    { ...size, fonts: [{ name: "Cormorant", data: cormorant, style: "normal", weight: 300 }] },
  );
}
