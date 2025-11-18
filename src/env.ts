import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    EXCHANGE_RATE_API_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.url(),
    NEXT_PUBLIC_GTM_ID: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    EXCHANGE_RATE_API_KEY: process.env.EXCHANGE_RATE_API_KEY,
  },
});
