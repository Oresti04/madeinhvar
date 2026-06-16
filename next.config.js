/**
 * Next.js config for demo project.
 * Note: When you deploy, configure image domains and environment variables.
 */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/**': ['./content/**/*'],
  },
}

module.exports = nextConfig
