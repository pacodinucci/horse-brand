import { PiUserLight } from "react-icons/pi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useRouter } from "next/navigation";

export function AccountCart() {
  const router = useRouter();
  return (
    <div className="flex items-center gap-10 text-neutral-700">
      <button
        className="flex items-center gap-2 text-sm bg-transparent px-0 py-1
                   border-0 outline-none ring-0 shadow-none
                   focus:outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer"
      >
        <PiUserLight className="size-5 opacity-70 mb-1" />
        <span className="leading-none">Mi cuenta</span>
      </button>

      <button
        className="flex items-center gap-2 text-sm bg-transparent px-0 py-1
                   border-0 outline-none ring-0 shadow-none
                   focus:outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer"
        onClick={() => router.push("/cart")}
      >
        <HiOutlineShoppingBag className="size-5 opacity-70 mb-1" />
        <span className="leading-none">Carrito</span>
      </button>
    </div>
  );
}
