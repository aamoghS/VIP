import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";

// Neon Object Storage bucket declared in neon.ts. Endpoint, region and keys come
// from the AWS_* vars that `neon deploy` / `neon env pull` write.
export const files = new Files({ adapter: neon({ bucket: "assets" }) });
