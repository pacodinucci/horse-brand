"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const CartHeader = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center w-full relative">
      {/* Botón volver */}
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute top-10 left-0 flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-[13px] tracking-[0.08em] uppercase">Volver</span>
      </button>

      {/* Logo centrado */}
      <div>
        <Image
          src="/logos/HB main positivo.svg"
          alt="Horse Brand Logo"
          width={100}
          height={0}
        />
      </div>
    </div>
  );
};
