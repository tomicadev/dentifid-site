import type { MetadataRoute } from "next";

// Staticni izvoz trazi da ruta bude unapred ispisana.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://dentifid.rs/sitemap.xml",
  };
}
