/* =============================================================================
   CONTENU DU SITE — TOUT SE MODIFIE ICI
   -----------------------------------------------------------------------------
   Remplacez simplement les valeurs ci-dessous par le vrai contenu.
   Médias : placez les fichiers dans  public/photos videos sons papa/
     • images  → photo1.jpg, photo2.jpg, ...
     • vidéos  → video1.mp4, video2.mp4, ...
     • musiques→ morceau1.mp3, morceau2.mp3, ...
   Les fichiers absents s'affichent automatiquement comme « à venir ».
   ============================================================================= */

const MEDIA = "/photos videos sons papa";

export const site = {
  /* Identité de l'artiste ---------------------------------------------------- */
  artiste: {
    nom: "Claude Tedesco",
    roles: ["Pianiste", "Violoniste", "Compositeur"],
    lieu: "France",
  },

  /* Image de fond du hero (plein cadre, assombrie) -------------------------- */
  heroImage: "/images/claude-piano.jpg",

  /* Métadonnées (onglet du navigateur, SEO) --------------------------------- */
  meta: {
    titre: "Claude Tedesco — Pianiste, Violoniste & Compositeur",
    description:
      "Site officiel de Claude Tedesco, pianiste, violoniste et compositeur de jazz. Premier prix du Conservatoire National de Nice. Découvrez sa musique, sa biographie et ses enregistrements.",
  },

  /* Navigation --------------------------------------------------------------- */
  nav: [
    { label: "Accueil", href: "#accueil" },
    { label: "Biographie", href: "#biographie" },
    { label: "Galerie", href: "#galerie" },
    { label: "Médias", href: "#medias" },
    { label: "Contact", href: "#contact" },
  ],

  /* Section ACCUEIL (hero) --------------------------------------------------- */
  hero: {
    surtitre: "Pianiste · Violoniste · Compositeur",
    accroche:
      "Du piano au violon, du jazz manouche à l'improvisation — un musicien éclectique qui navigue avec fluidité entre les genres, au service d'une intensité émotionnelle unique.",
    ctaPrincipal: { label: "Écouter", href: "#medias" },
    ctaSecondaire: { label: "Biographie", href: "#biographie" },
  },

  /* Section BIOGRAPHIE ------------------------------------------------------- */
  bio: {
    titre: "Biographie",
    portrait: "/images/claude-portrait.jpg",
    paragraphes: [
      "Premier prix du Conservatoire National de Nice, Claude Tedesco est un musicien et jazzman éclectique au profil rare. À la fois pianiste, violoniste de talent et compositeur, il navigue avec une immense fluidité entre les genres musicaux.",
      "Après s'être d'abord illustré dans le répertoire de la variété pour des émissions télévisées, il s'est affirmé comme une figure incontournable de la scène jazz et de l'improvisation. Multi-instrumentiste inspiré, il sait aussi bien escorter avec élégance la voix et les textes d'artistes compagnons de route (comme son travail remarqué au piano avec le vocaliste David Amar) que faire revivre avec virtuosité la magie du jazz manouche au violon (notamment au sein du Minor Swing Quartet en hommage à Stéphane Grappelli).",
      "Compositeur prolifique, Claude Tedesco est l'auteur de plusieurs albums qui témoignent de sa sensibilité et de son goût pour l'expérimentation. Qu'il soit au piano, au violon ou à la création de thèmes originaux, il met sa technique irréprochable au service d'une intensité émotionnelle unique.",
    ],
    reperes: [
      { valeur: "25", label: "années de scène" },
      { valeur: "6", label: "albums enregistrés" },
      { valeur: "Europe", label: "& tournées internationales" },
    ],
  },

  /* Section GALERIE (photos) ------------------------------------------------- */
  galerie: {
    titre: "Galerie",
    intro: "Instants de scène et de studio.",
    // Ajoutez autant de photos que souhaité (photo4.jpg, photo5.jpg, ...).
    photos: [
      { src: `${MEDIA}/photo1.jpg`, alt: "Claude Tedesco au piano, en tenue de concert" },
      { src: `${MEDIA}/photo2.jpg`, alt: "Les mains de Claude Tedesco sur le clavier" },
      { src: `${MEDIA}/photo3.jpg`, alt: "Claude Tedesco au piano, de profil" },
    ],
  },

  /* Section MÉDIAS (écouter & regarder) ------------------------------------- */
  medias: {
    titre: "Médias",
    intro: "Écoutez la musique de Claude Tedesco et découvrez ses captations.",

    // Lecteur Spotify officiel (identifiant de l'artiste)
    spotifyArtistId: "5ChmyF1x4wCGdqsO8vzk6t",
    spotifyUrl:
      "https://open.spotify.com/intl-fr/artist/5ChmyF1x4wCGdqsO8vzk6t",

    // Chaîne YouTube officielle
    youtubeChannel: "https://www.youtube.com/@claudetedesco1496",

    // Extraits audio locaux — placez les .mp3 dans le dossier média.
    audio: [
      {
        titre: "Morceau 1",
        sousTitre: "Composition originale",
        src: `${MEDIA}/morceau1.mp3`,
      },
      {
        titre: "Morceau 2",
        sousTitre: "Jazz manouche · violon",
        src: `${MEDIA}/morceau2.mp3`,
      },
    ],

    // Vidéos locales — placez les .mp4 dans le dossier média.
    video: [
      {
        titre: "Captation",
        sousTitre: "En concert",
        src: `${MEDIA}/video1.mp4`,
        poster: `${MEDIA}/photo3.jpg`,
      },
    ],
  },

  /* Section CONTACT / pied de page ------------------------------------------ */
  contact: {
    titre: "Contact",
    intro: "Pour les concerts, la presse et les collaborations.",
    email: "claudetedesco06@gmail.com",
    reseaux: [
      {
        label: "Spotify",
        href: "https://open.spotify.com/intl-fr/artist/5ChmyF1x4wCGdqsO8vzk6t",
      },
      { label: "YouTube", href: "https://www.youtube.com/@claudetedesco1496" },
    ],
  },
};

export type Site = typeof site;
