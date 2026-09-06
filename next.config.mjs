/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/sanity-image-loader.ts",
  },

  // Silence React hydration warnings from next-themes injecting class on <html>
  reactStrictMode: true,

  // Ensure Sanity Studio client-side bundle works
  transpilePackages: ["sanity"],
};

export default nextConfig;
