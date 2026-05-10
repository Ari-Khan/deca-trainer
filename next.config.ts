import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		optimizePackageImports: ["lucide-react"],
	},
	typescript: {
		tsconfigPath: "./tsconfig.json",
	},
	turbopack: {
		// Turbopack config for memory optimization
	},
	onDemandEntries: {
		// Reduce pages kept in memory in dev mode
		maxInactiveAge: 15 * 1000,
		pagesBufferLength: 2,
	},
	allowedDevOrigins: ["10.5.0.2"],
};

export default nextConfig;
