import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Biographie } from "@/components/Biographie";
import { Galerie } from "@/components/Galerie";
import { Medias } from "@/components/Medias";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Biographie />
        <Galerie />
        <Medias />
      </main>
      <Footer />
    </>
  );
}
