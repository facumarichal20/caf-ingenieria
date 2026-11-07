import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Los datos privados (cédulas, carnés) nunca se empaquetan en el servidor publicado.
  outputFileTracingExcludes: { "*": ["data/private/**", "**/*.xlsm", "**/*.xlsx"] },
};

export default nextConfig;
