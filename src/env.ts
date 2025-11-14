import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    EXCHANGE_RATE_API_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.url(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    EXCHANGE_RATE_API_KEY: process.env.EXCHANGE_RATE_API_KEY,
  },
});
