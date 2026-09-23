import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const cormorant = await readFile(join(process.cwd(), "assets/fonts/CormorantGaramond-Light.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#f5f3ef",
          fontFamily: "Cormorant",
          fontSize: 132,
          paddingBottom: 16,
        }}
      >
        R
      </div>
    ),
    { ...size, fonts: [{ name: "Cormorant", data: cormorant, style: "normal", weight: 300 }] },
  );
}
