import Image from "next/image";

export const Navbar = () => {
  return (
    <nav>
      <div className="w-full text-center py-1 text-white text-xs bg-slate-950">
        Esta página es provisoria hasta tener diseño
      </div>
      <div className="bg-[var(--var-brown)] flex justify-center">
        <Image
          src={"/logos/HB lite negativo fondo trasperante.svg"}
          alt="Brand Horse Logo"
          width={100}
          height={100}
        />
      </div>
    </nav>
  );
};
