import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jpcycdfayzvsbblgmmfu.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      // Legacy Webador URLs — permanent (301) redirects so any external
      // links (Google, flyers, business cards, old email footers) that
      // point at the previous site keep landing on a valid page.
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/client-reviews",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
