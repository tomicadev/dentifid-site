import type { MetadataRoute } from "next";

// Staticni izvoz trazi da ruta bude unapred ispisana.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const datum = new Date("2026-09-22");
  return [
    { url: "https://dentifid.rs/", lastModified: datum, priority: 1 },
    { url: "https://dentifid.rs/o-autoru/", lastModified: datum, priority: 0.5 },
  ];
}
