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
    brand: "WELCOME TO BOOKNOOK",
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
    brand: "BORROW · READ · RETURN",
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
    brand: "A COMMUNITY OF READERS",
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
    <section className="relative mx-auto w-full overflow-hidden bg-[#59483D]">
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

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#211A16]/90 via-[#211A16]/65 to-[#211A16]/25" />

            <div className="absolute inset-0 bg-black/10" />

            {/* Slide Content */}
            <div className="relative z-20 flex h-full items-center px-6 sm:px-10 md:px-[8%] lg:px-[10%]">
              <div
                className={`max-w-2xl transition-all duration-1000 delay-200 ${
                  index === currentIndex
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                <div className="mb-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E4B49A] sm:text-sm">
                    {slide.brand}
                  </span>
                </div>

                <h1 className="max-w-xl font-serif text-[40px] font-semibold leading-[1.15] tracking-tight text-[#FAF6F0] sm:text-5xl md:text-6xl lg:text-[68px]">
                  {slide.title}
                </h1>

                <p className="mt-6 max-w-lg text-sm leading-7 text-white/75 sm:text-base sm:leading-8 md:text-lg">
                  {slide.description}
                </p>

                <div className="mt-9">
                  <Link
                    href={slide.link}
                    tabIndex={index === currentIndex ? 0 : -1}
                    className="group inline-flex items-center gap-3 rounded-md bg-[#C18469] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#AD7057] hover:shadow-xl"
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

        {/* Slider Navigation */}
        <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3">
          {slidesData.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-10 bg-[#C18469]"
                  : "w-5 bg-white/55 hover:bg-white/90"
              }`}
            />
          ))}
        </div>

        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 z-20 h-1 w-full bg-white/10">
          <div
            key={currentIndex}
            className="h-full bg-[#C18469]"
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
