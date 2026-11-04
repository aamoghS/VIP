import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";

// Neon Object Storage bucket declared in neon.ts. Locally, `neon env pull` writes the
// AWS_* names. Vercel reserves AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_REGION for
// its own runtime, so deployments use NEON_STORAGE_* and the keys are passed explicitly
// (never the ambient AWS credential chain, which on Vercel would not be Neon's).
const env = process.env;

export const files = new Files({
  adapter: neon({
    bucket: "assets",
    endpoint: env.NEON_STORAGE_ENDPOINT ?? env.AWS_ENDPOINT_URL_S3,
    region: env.NEON_STORAGE_REGION ?? env.AWS_REGION,
    accessKeyId: env.NEON_STORAGE_ACCESS_KEY_ID ?? env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.NEON_STORAGE_SECRET_ACCESS_KEY ?? env.AWS_SECRET_ACCESS_KEY,
  }),
});
