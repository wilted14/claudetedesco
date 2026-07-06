import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { PianoBackdrop } from "@/components/PianoBackdrop";
import { Biographie } from "@/components/Biographie";
import { Galerie } from "@/components/Galerie";
import { Medias } from "@/components/Medias";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      {/* Piano en fond de site, animé par le défilement global */}
      <PianoBackdrop />
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
