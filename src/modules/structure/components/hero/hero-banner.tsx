"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["100", "200", "400", "500"],
  subsets: ["latin"],
});

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonLabel?: string;
  buttonLink?: string;
}

export const HeroBanner = ({
  title,
  subtitle,
  imageUrl,
  buttonLabel,
  buttonLink,
}: HeroBannerProps) => {
  return (
    <section
      className="relative w-full h-[95vh] min-h-[480px] max-h-[820px] overflow-hidden"
      aria-label="Hero banner"
    >
      {/* Imagen de fondo */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Overlay para contraste de texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Contenido */}
      <div className="relative z-10 h-full">
        <div className="mx-auto h-full px-6 md:px-8">
          <div className="flex h-full flex-col justify-end pb-10 md:pb-16">
            <h1
              className={`${montserrat.className} text-3xl leading-tight font-light uppercase tracking-wide text-white md:text-5xl drop-shadow`}
            >
              {title}
            </h1>

            {subtitle ? (
              <p className="mt-3 max-w-3xl text-sm md:text-base text-white/90">
                {subtitle}
              </p>
            ) : null}

            {buttonLabel && buttonLink ? (
              <div className="mt-6">
                <Button asChild size="lg" className="shadow-lg">
                  <Link href={buttonLink} aria-label={buttonLabel}>
                    {buttonLabel}
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
