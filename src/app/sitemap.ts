import type { MetadataRoute } from "next";
import { env } from "@/env";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
    },
  ];
}
