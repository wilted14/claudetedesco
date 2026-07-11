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
    portrait: `${MEDIA}/claude-profil.jpg`,
    // Cadrage de la photo (object-position) — ici centré sur le visage à droite
    portraitPosition: "72% 38%",
    paragraphes: [
      "Premier prix du Conservatoire National de Nice, Claude Tedesco est à la fois pianiste, violoniste, chanteur de talent et compositeur, il navigue avec une immense fluidité entre les genres musicaux.",
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
    // Ajoutez autant de photos que souhaité. `position` = cadrage (object-position).
    photos: [
      { src: `${MEDIA}/photo1.jpg`, alt: "Claude Tedesco au piano, en tenue de concert", position: "center" },
      { src: `${MEDIA}/up2five.jpg`, alt: "Le groupe Up2Five en studio", position: "center 40%" },
      { src: `${MEDIA}/claude-piano-rouge.jpg`, alt: "Claude Tedesco devant son piano à queue", position: "center 30%" },
      { src: `${MEDIA}/claude-violon.jpg`, alt: "Claude Tedesco au violon", position: "center" },
      { src: `${MEDIA}/photo2.jpg`, alt: "Les mains de Claude Tedesco sur le clavier", position: "center" },
      { src: `${MEDIA}/studio-enregistrement.jpg`, alt: "Claude Tedesco dirigeant une session d'enregistrement", position: "center 30%" },
      { src: `${MEDIA}/mains-clavier-rouge.jpg`, alt: "Mains sur le clavier en lumière rouge", position: "center" },
      { src: `${MEDIA}/photo3.jpg`, alt: "Claude Tedesco au piano, de profil", position: "center" },
      { src: `${MEDIA}/claude-profil.jpg`, alt: "Portrait de Claude Tedesco en contre-jour", position: "72% 38%" },
    ],
  },

  /* Section ALBUMS (pochettes recto/verso) ---------------------------------- */
  albums: {
    titre: "Albums",
    intro: "Cliquez sur une pochette pour la retourner.",
    items: [
      {
        titre: "Orange Time",
        sousTitre: "Claude Tedesco",
        recto: `${MEDIA}/album-orange-time-recto.jpg`,
      },
      {
        titre: "Tine et le Chevalier de Lumière",
        sousTitre: "Claude Tedesco · Conte musical",
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

    // Enregistrements, organisés en collections (l'ordre des pistes compte)
    collections: [
      {
        titre: "New Sympho",
        sousTitre: "Œuvre symphonique",
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
        sousTitre: "Compositions pour piano seul",
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
        sousTitre: "Conte musical · extraits",
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

    // Vidéos (captations & clips)
    video: [
      {
        titre: "Minor Swing",
        sousTitre: "Jazz manouche · violon",
        src: `${MEDIA}/minor-swing.mp4`,
        poster: `${MEDIA}/minor-swing.jpg`,
      },
      {
        titre: "Hommage à Nat King Cole",
        sousTitre: "En concert",
        src: `${MEDIA}/hommage-nat-king-cole.mp4`,
        poster: `${MEDIA}/hommage-nat-king-cole.jpg`,
      },
      {
        titre: "Color the World",
        sousTitre: "Clip",
        src: `${MEDIA}/color-the-world.mp4`,
        poster: `${MEDIA}/color-the-world.jpg`,
      },
      {
        titre: "Flotter",
        sousTitre: "Clip",
        src: `${MEDIA}/flotter.mp4`,
        poster: `${MEDIA}/flotter.jpg`,
      },
      {
        titre: "Retour à la normale",
        sousTitre: "Clip",
        src: `${MEDIA}/retour-a-la-normale.mp4`,
        poster: `${MEDIA}/retour-a-la-normale.jpg`,
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
