import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // A package-lock.json in the user home was making Turbopack scan that whole folder.
  turbopack: {
    root: path.join(__dirname),
  },
  // Old route names redirect permanently. Next keeps the query string.
  async redirects() {
    const moves: Record<string, string> = {
      "/toolbox": "/practice",
      "/sprint": "/build",
      "/room": "/locker",
      "/metrics": "/score",
      "/teacher": "/teach",
    };
    return Object.entries(moves).flatMap(([from, to]) => [
      { source: from, destination: to, permanent: true },
      { source: `${from}/:path*`, destination: `${to}/:path*`, permanent: true },
    ]);
  },
};

export default nextConfig;
