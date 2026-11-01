"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SlideData {
  id: number;
  brand: string;
  title: string;
  description: string;
  buttonText: string;
  link: string;
  image: string;
}

const slidesData: SlideData[] = [
  {
    id: 1,
    brand: "Welcome to BookNook",
    title: "Share the books on your shelf.",
    description:
      "Add the books you have finished and let other readers enjoy them too. Discover new stories and share the joy of reading.",
    buttonText: "Browse Books",
    link: "/books",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1920&q=85",
  },
  {
    id: 2,
    brand: "Borrow, read, return",
    title: "Your next favorite book is waiting.",
    description:
      "Explore books shared by fellow readers. Borrow a book, enjoy every page, and return it when you are done.",
    buttonText: "Explore Library",
    link: "/books",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&q=85",
  },
  {
    id: 3,
    brand: "A community of readers",
    title: "Good books deserve to be shared.",
    description:
      "Be part of a growing reading community. Share your collection, discover interesting books, and inspire others to read.",
    buttonText: "Join BookNook",
    link: "/register",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1920&q=85",
  },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % slidesData.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="booknook-hero-swiper relative mx-auto w-full overflow-hidden bg-[#17302A]">
      <div className="relative h-[500px] min-h-[460px] max-h-[580px] w-full sm:h-[550px] lg:h-[570px]">
        {slidesData.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
            aria-hidden={index !== currentIndex}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out"
              style={{
                backgroundImage: `url("${slide.image}")`,
                transform: index === currentIndex ? "scale(1.04)" : "scale(1)",
              }}
            />

            {/* Dark green overlay for readable text */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F211C]/90 via-[#0F211C]/70 to-[#0F211C]/30" />

            {/* Slide Content */}
            <div className="relative z-20 flex h-full items-center px-6 sm:px-10 md:px-[8%] lg:px-[10%]">
              <div
                className={`max-w-2xl transition-all duration-1000 delay-200 ${
                  index === currentIndex
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                <p className="text-sm font-medium text-[#D9A441] sm:text-base">
                  {slide.brand}
                </p>

                <h1 className="mt-4 max-w-xl font-serif text-[40px] font-bold leading-[1.15] tracking-tight text-[#F3EFE3] sm:text-5xl md:text-6xl lg:text-[64px]">
                  {slide.title}
                </h1>

                <p className="mt-6 max-w-lg text-sm leading-7 text-[#D5DED7] sm:text-base sm:leading-8">
                  {slide.description}
                </p>

                <div className="mt-9">
                  <Link
                    href={slide.link}
                    tabIndex={index === currentIndex ? 0 : -1}
                    className="group inline-flex items-center gap-3 rounded-md bg-[#D9A441] px-7 py-3.5 text-sm font-semibold text-[#17302A] transition-colors duration-300 hover:bg-[#E5B755] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3EFE3]"
                  >
                    {slide.buttonText}
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Navigation (aligned with the text) */}
        <div className="absolute bottom-9 left-6 z-30 flex items-center gap-2.5 sm:left-10 md:left-[8%] lg:left-[10%]">
          {slidesData.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? "true" : undefined}
              className={`h-1 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F3EFE3] ${
                index === currentIndex
                  ? "w-10 bg-[#D9A441]"
                  : "w-5 bg-[#F3EFE3]/40 hover:bg-[#F3EFE3]/80"
              }`}
            />
          ))}
        </div>

        {/* Bottom progress line */}
        <div className="absolute bottom-0 left-0 z-20 h-0.5 w-full bg-[#F3EFE3]/10">
          <div
            key={currentIndex}
            className="h-full bg-[#D9A441]"
            style={{
              animation: "heroProgress 5.5s linear",
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes heroProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .booknook-hero-swiper,
          .booknook-hero-swiper * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}
