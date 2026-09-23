import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
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
          border: "2px solid #b89b5e",
          color: "#f5f3ef",
          fontFamily: "Cormorant",
          fontSize: 48,
          paddingBottom: 6,
        }}
      >
        R
      </div>
    ),
    { ...size, fonts: [{ name: "Cormorant", data: cormorant, style: "normal", weight: 300 }] },
  );
}
