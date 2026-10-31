import { Navbar } from "@/components/shared/Navbar";
import { HeroSlider } from "@/components/home/HeroSlider";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF9FC]">
        <HeroSlider />
      </main>
    </>
  );
}
