import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { NotesBackdrop } from "@/components/NotesBackdrop";
import { Biographie } from "@/components/Biographie";
import { Galerie } from "@/components/Galerie";
import { Medias } from "@/components/Medias";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      {/* Notes de musique en fond de site, animées par le défilement */}
      <NotesBackdrop />
      {/* Contenu au-dessus du fond ; sections translucides */}
      <div className="relative z-10">
        <main>
          <Hero />
          <Biographie />
          <Galerie />
          <Medias />
        </main>
        <Footer />
      </div>
    </>
  );
}
