/* =============================================================================
   ENGLISH CONTENT — mirrors site.ts field-for-field.
   Media paths and hrefs are identical to the French version; only user-facing
   text is translated. Proper names (album/track titles) are kept as-is.
   ============================================================================= */

const MEDIA = "/photos videos sons papa";

export const siteEn = {
  artiste: {
    nom: "Claude Tedesco",
    roles: ["Pianist", "Violinist", "Composer"],
    lieu: "France",
  },

  heroImage: "/images/claude-piano.jpg",

  meta: {
    titre: "Claude Tedesco — Pianist, Violinist & Composer",
    description:
      "Official site of Claude Tedesco, jazz pianist, violinist and composer. First Prize of the Nice National Conservatory. Discover his music, biography and recordings.",
  },

  nav: [
    { label: "Home", href: "#accueil" },
    { label: "Biography", href: "#biographie" },
    { label: "Gallery", href: "#galerie" },
    { label: "Media", href: "#medias" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    surtitre: "Pianist · Violinist · Composer",
    accroche:
      "From piano to violin, from gypsy jazz to improvisation — an eclectic musician who moves fluidly between genres, in service of a singular emotional intensity.",
    ctaPrincipal: { label: "Listen", href: "#medias" },
    ctaSecondaire: { label: "Biography", href: "#biographie" },
  },

  bio: {
    titre: "Biography",
    portrait: `${MEDIA}/claude-profil.jpg`,
    portraitPosition: "72% 38%",
    paragraphes: [
      "First Prize of the Nice National Conservatory, Claude Tedesco is at once a pianist, violinist, talented singer and composer, moving with remarkable fluidity between musical genres.",
      "After first making a name for himself in the variety repertoire for television shows, he established himself as a key figure of the jazz and improvisation scene. An inspired multi-instrumentalist, he is equally at ease elegantly accompanying the voice and lyrics of fellow artists (notably his celebrated piano work with vocalist David Amar) as he is bringing the magic of gypsy jazz violin back to life with virtuosity (in particular within the Minor Swing Quartet, a tribute to Stéphane Grappelli).",
      "A prolific composer, Claude Tedesco has authored several albums that reflect his sensitivity and taste for experimentation. Whether at the piano, on the violin, or crafting original themes, he puts his flawless technique in service of a singular emotional intensity.",
    ],
    reperes: [
      { valeur: "25", label: "years on stage" },
      { valeur: "6", label: "albums recorded" },
      { valeur: "Europe", label: "& international tours" },
    ],
  },

  galerie: {
    titre: "Gallery",
    intro: "Moments from the stage and the studio.",
    photos: [
      { src: `${MEDIA}/claude-chant.jpg`, alt: "Claude Tedesco singing, microphone in hand on stage" },
      { src: `${MEDIA}/claude-piano-sourire.jpg`, alt: "Claude Tedesco smiling at the piano, sheet music open" },
      { src: `${MEDIA}/claude-violon-solo.jpg`, alt: "Claude Tedesco playing the violin, mid-performance" },
      { src: `${MEDIA}/jazz-a-juan-piano.jpg`, alt: "Claude Tedesco at the piano at the Jazz à Juan festival" },
      { src: `${MEDIA}/photo1.jpg`, alt: "Claude Tedesco at the piano, in concert attire" },
      { src: `${MEDIA}/violon-scene-verte.jpg`, alt: "Claude Tedesco on violin under stage lights" },
      { src: `${MEDIA}/claude-piano-rouge.jpg`, alt: "Claude Tedesco in front of his grand piano" },
      { src: `${MEDIA}/violon-duo-chant.jpg`, alt: "Claude Tedesco on violin alongside a singer" },
      { src: `${MEDIA}/up2five.jpg`, alt: "The Up2Five band in the studio" },
      { src: `${MEDIA}/festival-jazz.jpg`, alt: "Claude Tedesco performing live with his ensemble" },
      { src: `${MEDIA}/studio-enregistrement.jpg`, alt: "Claude Tedesco directing a recording session" },
      { src: `${MEDIA}/claude-violon.jpg`, alt: "Claude Tedesco on violin" },
      { src: `${MEDIA}/photo3.jpg`, alt: "Claude Tedesco at the piano, in profile" },
      { src: `${MEDIA}/mains-clavier-rouge.jpg`, alt: "Hands on the keyboard in red light" },
      { src: `${MEDIA}/claude-profil.jpg`, alt: "Portrait of Claude Tedesco in backlight" },
    ],
  },

  albums: {
    titre: "Albums",
    intro: "Click a cover to flip it.",
    items: [
      {
        titre: "Orange Time",
        sousTitre: "Claude Tedesco",
        recto: `${MEDIA}/album-orange-time-recto.jpg`,
      },
      {
        titre: "Tine et le Chevalier de Lumière",
        sousTitre: "Claude Tedesco · Musical tale",
        recto: `${MEDIA}/album-tine-recto.jpg`,
        verso: `${MEDIA}/album-tine-verso.jpg`,
      },
      {
        titre: "Rebirth",
        sousTitre: "Eric Sempe & Synopsis · 2011",
        recto: `${MEDIA}/album-rebirth-recto.jpg`,
        verso: `${MEDIA}/album-rebirth-verso.jpg`,
      },
      {
        titre: "Home",
        sousTitre: "Synopsis",
        recto: `${MEDIA}/album-home-recto.jpg`,
        verso: `${MEDIA}/album-home-verso.jpg`,
      },
    ],
  },

  medias: {
    titre: "Media",
    intro: "Listen to Claude Tedesco's music and discover his live footage.",

    youtubeChannel: "https://www.youtube.com/@claudetedesco1496",

    collections: [
      {
        titre: "Orange Time",
        sousTitre: "Album",
        pistes: [
          { titre: "Ombre chinoise", src: `${MEDIA}/orange-time/01-ombre-chinoise.mp3` },
          { titre: "Walking on the Groove", src: `${MEDIA}/orange-time/02-walking-on-the-groove.mp3` },
          { titre: "Judith", src: `${MEDIA}/orange-time/03-judith.mp3` },
          { titre: "Pour Lucie", src: `${MEDIA}/orange-time/04-pour-lucie.mp3` },
          { titre: "Express", src: `${MEDIA}/orange-time/05-express.mp3` },
          { titre: "Hemispheres", src: `${MEDIA}/orange-time/06-hemispheres.mp3` },
          { titre: "Will", src: `${MEDIA}/orange-time/07-will.mp3` },
          { titre: "RG", src: `${MEDIA}/orange-time/08-rg.mp3` },
          { titre: "Child's Mood", src: `${MEDIA}/orange-time/09-childs-mood.mp3` },
          { titre: "Cresci", src: `${MEDIA}/orange-time/10-cresci.mp3` },
        ],
      },
      {
        titre: "New Sympho",
        sousTitre: "Symphonic work",
        pistes: [
          { titre: "Verseau", src: `${MEDIA}/new-sympho/01-verseau.mp3` },
          { titre: "Tango", src: `${MEDIA}/new-sympho/02-tango.mp3` },
          { titre: "Esquisse", src: `${MEDIA}/new-sympho/03-esquisse.mp3` },
          { titre: "Nuit noire", src: `${MEDIA}/new-sympho/04-nuit-noire.mp3` },
          { titre: "Comédie noire I", src: `${MEDIA}/new-sympho/05-comedie-noire-1.mp3` },
          { titre: "Comédie noire II", src: `${MEDIA}/new-sympho/06-comedie-noire-2.mp3` },
          { titre: "Nuit sans étoiles", src: `${MEDIA}/new-sympho/07-nuit-sans-etoiles.mp3` },
          { titre: "Grands espaces", src: `${MEDIA}/new-sympho/08-grands-espaces.mp3` },
          { titre: "Asiatique", src: `${MEDIA}/new-sympho/09-asiatique.mp3` },
          { titre: "Océan imaginaire", src: `${MEDIA}/new-sympho/10-ocean-imaginaire.mp3` },
          { titre: "Première évasion", src: `${MEDIA}/new-sympho/11-premiere-evasion.mp3` },
          { titre: "Impression", src: `${MEDIA}/new-sympho/12-impression.mp3` },
          { titre: "Mer et vent", src: `${MEDIA}/new-sympho/13-mer-et-vent.mp3` },
        ],
      },
      {
        titre: "Piano Solo",
        sousTitre: "Solo piano compositions",
        pistes: [
          { titre: "Color the World", src: `${MEDIA}/Color-the-world.mp3` },
          { titre: "Flotter", src: `${MEDIA}/Flotter.mp3` },
          { titre: "Atlantide", src: `${MEDIA}/Atlantide.mp3` },
          { titre: "Mondes inexplorés", src: `${MEDIA}/Mondes-inexplores.mp3` },
          { titre: "Peace", src: `${MEDIA}/Peace.mp3` },
          { titre: "Entre deux eaux", src: `${MEDIA}/Entre-deux-eaux.mp3` },
          { titre: "Eternity", src: `${MEDIA}/Eternity.mp3` },
          { titre: "Valse à la lune", src: `${MEDIA}/Valse-a-la-lune.mp3` },
        ],
      },
      {
        titre: "Tine et le Chevalier de Lumière",
        sousTitre: "Musical tale · excerpts",
        pistes: [
          { titre: "Inspiration", src: `${MEDIA}/Imspiration.mp3` },
          { titre: "Naissance", src: `${MEDIA}/Naissance.mp3` },
          { titre: "Évasion", src: `${MEDIA}/Evasion.mp3` },
          { titre: "Amoroso", src: `${MEDIA}/Amoroso.mp3` },
          { titre: "Versus", src: `${MEDIA}/Versus.mp3` },
          { titre: "Tine et le chevalier de lumière", src: `${MEDIA}/Tine-et-le-chevalier-de-lumiere.mp3` },
          { titre: "Énigme", src: `${MEDIA}/Enigme.mp3` },
          { titre: "Paradise", src: `${MEDIA}/Paradise.mp3` },
          { titre: "Antheos", src: `${MEDIA}/Antheos.mp3` },
          { titre: "Armonia", src: `${MEDIA}/Armonia.mp3` },
          { titre: "Pensées induites", src: `${MEDIA}/Pensees-induites.mp3` },
        ],
      },
    ],

    video: [
      {
        titre: "New Sympho",
        sousTitre: "Recording session",
        src: `${MEDIA}/enregistrement-studio.mp4`,
        poster: `${MEDIA}/enregistrement-studio.jpg`,
      },
      {
        titre: "Minor Swing",
        sousTitre: "Gypsy jazz · violin",
        src: `${MEDIA}/minor-swing.mp4`,
        poster: `${MEDIA}/minor-swing.jpg`,
      },
      {
        titre: "Hommage à Nat King Cole",
        sousTitre: "Live",
        src: `${MEDIA}/hommage-nat-king-cole.mp4`,
        poster: `${MEDIA}/hommage-nat-king-cole.jpg`,
      },
      {
        titre: "Color the World",
        sousTitre: "Video clip",
        src: `${MEDIA}/color-the-world.mp4`,
        poster: `${MEDIA}/color-the-world.jpg`,
      },
      {
        titre: "Flotter",
        sousTitre: "Video clip",
        src: `${MEDIA}/flotter.mp4`,
        poster: `${MEDIA}/flotter.jpg`,
      },
      {
        titre: "Retour à la normale",
        sousTitre: "Video clip",
        src: `${MEDIA}/retour-a-la-normale.mp4`,
        poster: `${MEDIA}/retour-a-la-normale.jpg`,
      },
    ],
  },

  contact: {
    titre: "Contact",
    intro: "For concerts, press and collaborations.",
    email: "claudetedesco06@gmail.com",
    reseaux: [
      { label: "YouTube", href: "https://www.youtube.com/@claudetedesco1496" },
    ],
  },
};
