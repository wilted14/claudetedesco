/**
 * Préfixe un chemin d'asset avec le basePath (sous-chemin GitHub Pages).
 * À utiliser pour les balises brutes <img>/<audio>/<video>/poster.
 * ⚠️ Ne PAS utiliser avec next/image (qui applique déjà le basePath).
 */
export const asset = (p: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p}`;
