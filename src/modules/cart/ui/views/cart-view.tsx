"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { CustomerFormModal } from "../components/customer-form-modal";

export const CartView = () => {
  const { data: user } = authClient.useSession();
  const email = user?.user.email ?? "";

  const trpc = useTRPC();
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const { data: customer } = useQuery(
    trpc.customers.findByEmail.queryOptions({ email })
  );

  console.log({ email, customer });

  // Suma de subtotales
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!customer || !customer.email) {
      setShowCustomerModal(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: cartItems,
          customerId: customer.id,
        }),
      });
      clearCart();
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point; // Redirige a MercadoPago
      } else {
        alert(data.error || "No se pudo iniciar el pago.");
      }
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-10 max-w-7xl mx-auto py-12">
      {/* Carrito */}
      <div className="flex-1">
        <h1 className="text-4xl font-black mb-8 text-[var(--var-brown)]">
          CARRITO
        </h1>
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b">
              <th className="text-left pb-3 text-lg">Producto</th>
              <th className="text-center pb-3 text-lg">Cantidad</th>
              <th className="text-right pb-3 text-lg">Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-neutral-500">
                  El carrito está vacío.
                </td>
              </tr>
            )}
            {cartItems.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-6 flex items-center gap-4">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    width={54}
                    height={54}
                    className="rounded"
                  />
                  <span className="text-base font-medium">{item.name}</span>
                </td>
                <td className="py-6">
                  <div className="flex items-center justify-center border border-[var(--var-brown)] rounded px-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="px-2 text-[var(--var-brown)]"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 text-[var(--var-brown)]"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </td>
                <td className="py-6 text-right text-xl font-semibold">
                  $
                  {item.price.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="py-6 text-center">
                  <button
                    className="text-neutral-400 hover:text-[var(--var-brown)]"
                    title="Eliminar"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Cupón */}
        <div className="flex gap-3 mt-6">
          <input
            type="text"
            placeholder="Código del cupón"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="border rounded px-4 py-2 flex-1 max-w-[250px] text-base"
          />
          <Button
            className="bg-[var(--var-brown)] text-white font-bold px-7"
            // onClick={} // lógica de cupón si la agregás
          >
            Aplicar el cupón
          </Button>
        </div>
      </div>
      {/* Totales */}
      <aside className="w-[380px] min-w-[310px] bg-white border rounded-xl shadow p-7 flex flex-col gap-6">
        <span className="text-xl font-bold mb-2 text-[var(--var-brown)]">
          Totales del carrito
        </span>
        <div className="flex justify-between text-base border-b pb-2">
          <span>Subtotal</span>
          <span className="font-bold">
            ${subtotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between text-base border-b pb-2 text-neutral-500">
          <span>Envío</span>
          <span className="font-semibold">Calcular envío</span>
        </div>
        <div className="flex justify-between text-lg font-extrabold py-2">
          <span>Total</span>
          <span>
            ${subtotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <Button
          className="bg-[var(--var-brown)] text-white text-lg py-3 rounded mt-2"
          onClick={handleCheckout}
          disabled={loading || cartItems.length === 0}
        >
          Finalizar compra
        </Button>
      </aside>
      {showCustomerModal && (
        <CustomerFormModal
          email={email}
          onClose={() => setShowCustomerModal(false)}
        />
      )}
    </div>
  );
};
