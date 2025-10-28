"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface ConceptCardProps {
  title: string;
  imageUrl: string;
}

export const ConceptCard = ({ title, imageUrl }: ConceptCardProps) => {
  const router = useRouter();

  return (
    <div
      className="flex flex-col items-start group cursor-pointer transition-all duration-300"
      onClick={() => router.push("/structure-hermes/category")}
    >
      <div className="relative w-full aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover object-center transition-transform duration-500"
        />
      </div>
      <p className="mt-3 text-sm font-extralight uppercase tracking-wide text-neutral-800 group-hover:text-neutral-600">
        {title}
      </p>
    </div>
  );
};
