import { CartView } from "@/modules/structure/components/cart/cart-view";
import { CheckoutFooter } from "@/modules/structure/components/footer/checkout-footer";

const CartPage = () => {
  return (
    <div>
      <CartView />
      <CheckoutFooter />
    </div>
  );
};

export default CartPage;
