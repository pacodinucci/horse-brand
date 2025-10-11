import Image from "next/image";
import { NavbarCategories } from "./navbar-categories";
import { NavbarButtons } from "./navbar-buttons";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav>
      <div className="w-full flex justify-center gap-6 text-center py-1 text-white text-sm uppercase tracking-wide bg-slate-950">
        <p>Links a skeletons &gt; </p>
        <div>
          <Link href={"/structure"} className="underline">
            Landing
          </Link>{" "}
          &gt;{" "}
          <Link href={"/structure/category"} className="underline">
            Category
          </Link>{" "}
          &gt;{" "}
          <Link href={"/structure/product"} className="underline">
            Product
          </Link>
        </div>
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
