"use client";

import Image from "next/image";

type EditorialSectionProps = {
  image: {
    src: string;
    alt?: string;
    priority?: boolean;
  };
  title: string;
  subtitle?: string;
  className?: string;
};

export function EditorialSection({
  image,
  title,
  subtitle,
  className,
}: EditorialSectionProps) {
  return (
    <section className={["w-full", className || ""].join(" ")}>
      {/* Imagen centrada */}
      <figure className="relative w-[75%] mt-8 md:mt-28 mx-auto overflow-hidden bg-neutral-100">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
          <Image
            src={image.src}
            alt={image.alt ?? title}
            fill
            priority={image.priority}
            className="object-cover object-center"
          />
        </div>
      </figure>

      {/* Texto centrado */}
      <div className="py-8 md:py-10 text-center">
        <h2 className="text-[18px] md:text-[22px] tracking-[0.18em] uppercase">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-[13px] md:text-sm text-neutral-600 max-w-3xl mx-auto px-4 md:px-0">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
