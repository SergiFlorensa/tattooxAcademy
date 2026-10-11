/** Native images extracted from the artist's portfolio, pages 2–6. */
export type PortfolioPiece = {
  id: string; ca: string; es: string; group: number; kind: "work" | "design";
  src: string; width: number; height: number;
};

export const artistPortrait = { src: "/portfolio/p02-x10.webp", width: 1080, height: 1440 };
export const processDesign = { src: "/portfolio/p03-x6.webp", width: 365, height: 648 };
export const processResult = { src: "/portfolio/p03-x8.webp", width: 472, height: 534 };

export const tattooWorks: PortfolioPiece[] = [
  { id: "portrait-realism", ca: "Retrat en realisme", es: "Retrato en realismo", group: 1, kind: "work", src: "/portfolio/p04-x4.webp", width: 465, height: 700 },
  { id: "eye-landscape", ca: "Mirada i paisatge", es: "Mirada y paisaje", group: 1, kind: "work", src: "/portfolio/p04-x7.webp", width: 688, height: 1055 },
  { id: "portrait-butterflies", ca: "Retrat i papallones", es: "Retrato y mariposas", group: 1, kind: "work", src: "/portfolio/p04-x9.webp", width: 1106, height: 1593 },
  { id: "fine-line-butterflies", ca: "Papallones en fine line", es: "Mariposas en fine line", group: 2, kind: "work", src: "/portfolio/p04-x10.webp", width: 1210, height: 1613 },
];

export const availableDesigns: PortfolioPiece[] = [
  { id: "road-compass", ca: "Rumb i carretera", es: "Rumbo y carretera", group: 0, kind: "design", src: "/portfolio/p05-x8.webp", width: 506, height: 759 },
  { id: "hands-music", ca: "Mans i música", es: "Manos y música", group: 0, kind: "design", src: "/portfolio/p05-x6.webp", width: 561, height: 701 },
  { id: "geometry-emotions", ca: "Geometria i emocions", es: "Geometría y emociones", group: 0, kind: "design", src: "/portfolio/p05-x4.webp", width: 620, height: 877 },
  { id: "wolf-motor", ca: "Instint i motor", es: "Instinto y motor", group: 0, kind: "design", src: "/portfolio/p05-x7.webp", width: 702, height: 807 },
  { id: "between-shadows", ca: "Entre ombres", es: "Entre sombras", group: 0, kind: "design", src: "/portfolio/p06-x5.webp", width: 768, height: 512 },
  { id: "cycles-transformation", ca: "Cicles i transformació", es: "Ciclos y transformación", group: 0, kind: "design", src: "/portfolio/p06-x8.webp", width: 512, height: 768 },
  { id: "hand-eye", ca: "La mirada a les teves mans", es: "La mirada en tus manos", group: 0, kind: "design", src: "/portfolio/p06-x9.webp", width: 557, height: 680 },
  { id: "geisha-red", ca: "Geisha en negre i vermell", es: "Geisha en negro y rojo", group: 0, kind: "design", src: "/portfolio/p06-x7.webp", width: 467, height: 843 },
];
