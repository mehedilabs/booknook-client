import { BookOpen, Heart, Users } from "lucide-react";

const features = [
  {
    number: "01",
    title: "Discover Stories",
    description:
      "Explore a growing collection of books and discover stories that inspire, educate, and entertain.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Share Knowledge",
    description:
      "Give your books a new journey by sharing them with readers who are looking for their next favorite.",
    icon: Heart,
  },
  {
    number: "03",
    title: "Connect Readers",
    description:
      "Bring readers together through a shared love of books, ideas, and the joy of reading.",
    icon: Users,
  },
];

export function ReadingCommunitySection() {
  return (
    <section className="bg-[#EEF1EA] px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D9A441]" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A6414] sm:text-sm">
              The BookNook Experience
            </p>
            <span className="h-px w-8 bg-[#D9A441]" />
          </div>

          <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-[#17302A] sm:text-4xl lg:text-5xl">
            More Than Just a Library.
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#5B6B61] sm:mt-5 sm:text-base sm:leading-8">
            We believe books are meant to be discovered, shared, and enjoyed.
            BookNook brings these simple joys together in one place.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6 lg:mt-14">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.number}
                className="group relative overflow-hidden rounded-md border border-[#D3DACD] bg-white p-5 transition-all duration-300 hover:border-[#D9A441] hover:shadow-[0_12px_30px_rgba(23,48,42,0.08)] motion-safe:hover:-translate-y-1 sm:p-6 lg:p-8"
              >
                {/* Large faded number */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-3 select-none font-serif text-5xl font-bold leading-none text-[#D9A441]/25 transition-colors duration-300 group-hover:text-[#D9A441]/60 lg:right-6 lg:top-5 lg:text-6xl"
                >
                  {feature.number}
                </span>

                <div className="relative flex items-start gap-4 md:flex-col md:gap-0">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-[#17302A] md:size-14">
                    <Icon
                      aria-hidden="true"
                      className="size-5 text-[#D9A441] md:size-6"
                    />
                  </div>

                  <div className="min-w-0 pr-10 md:pr-0">
                    <h3 className="font-serif text-xl font-bold text-[#17302A] md:mt-7 lg:text-2xl">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-[#5B6B61] md:mt-3">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 hidden h-0.5 w-12 bg-[#D9A441] transition-all duration-300 group-hover:w-24 md:block" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
