import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // A package-lock.json in the user home was making Turbopack scan that whole folder.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
