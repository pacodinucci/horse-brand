import { PiUserLight } from "react-icons/pi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { authClient } from "@/lib/auth-client";

export function AccountCart() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const itemsCount = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  return (
    <div className="flex items-center gap-10 text-neutral-700">
      {session ? (
        <button
          className="flex items-center gap-2 text-sm bg-transparent px-0 py-1
                   border-0 outline-none ring-0 shadow-none
                   focus:outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer"
        >
          <PiUserLight className="size-5 opacity-70 mb-1" />
          <span className="leading-none">Hola, {session.user.name}</span>
        </button>
      ) : (
        <button
          className="flex items-center gap-2 text-sm bg-transparent px-0 py-1
                   border-0 outline-none ring-0 shadow-none
                   focus:outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer"
        >
          <PiUserLight className="size-5 opacity-70 mb-1" />
          <span className="leading-none">Iniciar Sesión</span>
        </button>
      )}

      <button
        className="flex items-center gap-2 text-sm bg-transparent px-0 py-1
                   border-0 outline-none ring-0 shadow-none
                   focus:outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer"
        onClick={() => router.push("/cart")}
      >
        <div className="relative flex items-center">
          <HiOutlineShoppingBag className="size-5 opacity-70 mb-1" />

          {itemsCount > 0 && (
            <span
              className="
                absolute -top-2 -right-2
                min-w-[18px] h-[18px]
                rounded-full
                bg-neutral-900 text-white
                text-[10px] leading-none
                flex items-center justify-center
                font-medium
                tabular-nums
                shadow-sm
              "
            >
              {itemsCount}
            </span>
          )}
        </div>
        <span className="leading-none">Carrito</span>
      </button>
    </div>
  );
}
