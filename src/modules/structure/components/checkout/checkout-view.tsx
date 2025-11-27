import { AdditionalInfo } from "../cart/additional-info";
import { CartHeader } from "../cart/cart-header";
import { CheckoutSteps } from "../cart/checkout-steps";
import { CheckoutForm } from "./checkout-form";
import { CheckoutSummary } from "./checkout-summary";

export const CheckoutView = () => {
  return (
    <div className="bg-zinc-100 min-h-screen w-full px-32 pb-24">
      <CartHeader />
      <CheckoutSteps />
      <div className="flex gap-8">
        <div className="w-[60%]">
          <CheckoutForm />
        </div>
        <div className="w-[35%]">
          <CheckoutSummary />
          <AdditionalInfo />
        </div>
      </div>
    </div>
  );
};
