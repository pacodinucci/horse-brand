import Image from "next/image";
import { NavbarCategories } from "./navbar-categories";
import { NavbarButtons } from "./navbar-buttons";

export const Navbar = () => {
  return (
    <nav>
      <div className="w-full text-center py-1 text-white text-sm uppercase tracking-wide bg-slate-950">
        Esta página es provisoria hasta tener diseño
      </div>
      <div className="bg-[var(--var-brown)] flex justify-between items-center px-6">
        <Image
          src={"/logos/HB lite negativo fondo trasperante.svg"}
          alt="Brand Horse Logo"
          width={100}
          height={100}
        />
        <NavbarCategories />
        <NavbarButtons />
      </div>
    </nav>
  );
};
