import { PiMagnifyingGlassThin } from "react-icons/pi";

export const NavbarSearch = () => {
  return (
    <div className="flex items-center gap-2 text-neutral-700">
      <PiMagnifyingGlassThin className="size-5 opacity-90 cursor-pointer" />
      <input
        type="text"
        placeholder="Buscar"
        className="
                        w-40
                        text-sm
                        bg-transparent
                        px-0 py-0
                        border-0 border-b border-neutral-800/60
                        outline-none ring-0 shadow-none
                        focus:outline-none focus:ring-0 focus:ring-offset-0
                        focus:shadow-none focus:border-neutral-800/60
                        placeholder:text-neutral-500
                        "
        style={{ WebkitTapHighlightColor: "transparent" }}
      />
    </div>
  );
};
