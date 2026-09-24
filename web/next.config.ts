import type { NextConfig } from "next";

// Sajt se objavljuje kao statican izvoz na GitHub Pages, pa nema servera:
// slike se ne optimizuju u hodu, a svaka strana dobija svoj folder.
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default config;
