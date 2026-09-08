import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The new portfolio (landing page + case studies) lives under
  // /portfolio-import; the old one-page site still exists at "/" but isn't
  // what should greet visitors right now. Temporary (307) rather than
  // permanent so browsers/search engines don't cache this aggressively
  // while things are still being finalized — easy to flip to permanent
  // (or remove entirely, once /portfolio-import's content moves to "/"
  // directly) later.
  async redirects() {
    return [
      {
        source: "/",
        destination: "/portfolio-import",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
