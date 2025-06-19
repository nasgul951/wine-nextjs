/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    apiBaseUrl: process.env.API_BASE_URL,
    apiKey: process.env.API_KEY,
  }
};

export default nextConfig;
