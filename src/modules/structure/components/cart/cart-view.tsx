import { AdditionalInfo } from "./additional-info";
import { CartComponent } from "./cart-component";
import { CartHeader } from "./cart-header";
import { CheckoutSteps } from "./checkout-steps";

export const CartView = () => {
  return (
    <div className="bg-zinc-100 min-h-screen w-full px-32">
      <CartHeader />
      <CheckoutSteps />

      <div className="mt-4 flex gap-6 w-full">
        {/* columna principal (carrito) */}
        <div className="flex-[2]">
          <CartComponent />
        </div>

        {/* columna lateral (info adicional) */}
        <div className="flex-[1]">
          <AdditionalInfo />
        </div>
      </div>
    </div>
  );
};
