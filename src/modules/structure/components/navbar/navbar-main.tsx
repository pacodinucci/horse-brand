import Image from "next/image";
import { NavbarSearch } from "./navbar-search";
import { AccountCart } from "./account-cart";

export const NavbarMain = () => {
  return (
    <div className="w-full">
      <div className="w-full flex items-center gap-4 text-sm justify-between px-8">
        <NavbarSearch />

        <div className="font-semibold">
          <Image
            alt="Horse Brand Logo"
            src={"/logos/HB lite positivo.svg"}
            width={80}
            height={0}
            //   className="border border-red-500"
          />
        </div>
        <AccountCart />
      </div>
    </div>
  );
};
