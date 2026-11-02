"use client";

import "swiper/css";
import "swiper/css/autoplay";
import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

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
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const swiperRef = useRef<SwiperType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isMounted) {
    return (
      <section className="booknook-hero-swiper relative mx-auto w-full overflow-hidden bg-[#17302A]">
        <div className="h-[340px] w-full sm:h-[550px] lg:h-[570px]" />
      </section>
    );
  }

  return (
    <section className="booknook-hero-swiper relative mx-auto w-full overflow-hidden bg-[#17302A]">
      <Swiper
        preventInteractionOnTransition={false}
        modules={[Autoplay]}
        slidesPerView={1}
        loop
        speed={700}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          waitForTransition: false,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setCurrentIndex(swiper.realIndex);
        }}
        className="h-[340px] w-full sm:h-[550px] lg:h-[570px]"
      >
        {slidesData.map((slide) => (
          <SwiperSlide key={slide.id}>
            {({ isActive }) => (
              <div className="relative h-full w-full overflow-hidden">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[4000ms] ease-out"
                  style={{
                    backgroundImage: `url("${slide.image}")`,
                    transform: isActive ? "scale(1.04)" : "scale(1)",
                  }}
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F211C]/90 via-[#0F211C]/70 to-[#0F211C]/30" />

                {/* Slide Content */}
                <div className="relative z-20 flex h-full items-center px-6 pt-5 sm:px-10 sm:pt-0 md:px-[8%] lg:px-[10%]">
                  <div
                    className={`max-w-2xl transition-all duration-1000 delay-200 ${
                      isActive
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    <p className="text-xs font-medium text-[#D9A441] sm:text-base">
                      {slide.brand}
                    </p>

                    <h1 className="mt-2 max-w-xl font-serif text-[26px] font-bold leading-[1.15] tracking-tight text-[#F3EFE3] sm:mt-4 sm:text-5xl md:text-6xl lg:text-[64px]">
                      {slide.title}
                    </h1>

                    <p className="mt-2 line-clamp-2 max-w-lg text-xs leading-5 text-[#D5DED7] sm:mt-6 sm:line-clamp-none sm:text-base sm:leading-8">
                      {slide.description}
                    </p>

                    <div className="mt-4 sm:mt-9">
                      <Link
                        href={slide.link}
                        tabIndex={isActive ? 0 : -1}
                        className="group inline-flex items-center gap-2 rounded-md bg-[#D9A441] px-5 py-2.5 text-sm font-semibold text-[#17302A] transition-colors duration-300 hover:bg-[#E5B755] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3EFE3] sm:gap-3 sm:px-7 sm:py-3.5"
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
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Slider Navigation */}
      <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 sm:bottom-9">
        {slidesData.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => swiperRef.current?.slideToLoop(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? "true" : undefined}
            className={`h-1 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F3EFE3] ${
              index === currentIndex
                ? "w-5 bg-[#D9A441] sm:w-6"
                : "w-2 bg-[#F3EFE3]/40 hover:bg-[#F3EFE3]/80 sm:w-3"
            }`}
          />
        ))}
      </div>

      {/* Bottom Progress Line */}
      <div className="absolute bottom-0 left-0 z-20 h-0.5 w-full bg-[#F3EFE3]/10">
        <div
          key={currentIndex}
          className="h-full bg-[#D9A441]"
          style={{
            animation: "heroProgress 4s linear",
          }}
        />
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
