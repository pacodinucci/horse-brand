import Image from "next/image";
import { NavbarSearch } from "./navbar-search";
import { AccountCart } from "./account-cart";
import { useRouter } from "next/navigation";

export const NavbarMain = () => {
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="w-full flex items-center gap-4 text-sm justify-between px-8">
        <NavbarSearch />

        <div className="font-semibold cursor-pointer">
          <Image
            alt="Horse Brand Logo"
            src={"/logos/HB lite positivo.svg"}
            width={80}
            height={0}
            onClick={() => router.push("/structure-hermes")}
          />
        </div>
        <AccountCart />
      </div>
    </div>
  );
};
