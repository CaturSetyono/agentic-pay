import type { NextConfig } from "next";
import { cwd } from "node:process";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: { root: cwd() },
};
export default nextConfig;
