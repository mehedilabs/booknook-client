import { Navbar } from "@/components/shared/Navbar";
import { HeroSlider } from "@/components/home/HeroSlider";
import { LatestBooks } from "@/components/home/LatestBooks";
import { ShareBooksSection } from "@/components/home/ShareBooksSection";
import { ReadingCommunitySection } from "@/components/home/ReadingCommunitySection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BookNook | Home",
};
export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#EEF1EA]">
        <HeroSlider />
        <LatestBooks />
        <ShareBooksSection />
        <ReadingCommunitySection />
      </main>
    </>
  );
}
