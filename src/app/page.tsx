import { Navbar } from "@/components/shared/Navbar";
import { HeroSlider } from "@/components/home/HeroSlider";
import { LatestBooks } from "@/components/home/LatestBooks";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF6F0]">
        <HeroSlider />
        <LatestBooks />
      </main>
    </>
  );
}
