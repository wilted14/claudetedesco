import type { NextConfig } from "next";

// Nom du dépôt = sous-chemin sur GitHub Pages (wilted14.github.io/claudetedesco)
const repo = "claudetedesco";
// Le sous-chemin n'est appliqué que pour le build GitHub Pages (variable PAGES=true).
// En local (npm run dev / build), le site reste servi à la racine.
const basePath = process.env.PAGES === "true" ? `/${repo}` : "";

const nextConfig: NextConfig = {
  // Export 100% statique → hébergeable sur GitHub Pages
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    // L'optimisation d'images nécessite un serveur ; en statique on sert tel quel
    unoptimized: true,
  },
  // Exposé au navigateur pour préfixer les médias servis via <img>/<audio>/<video>
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
