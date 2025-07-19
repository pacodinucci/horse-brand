import { CartView } from "@/modules/cart/ui/views/cart-view";
import { Navbar } from "@/modules/landing/ui/components/navbar";

const CartPage = () => {
  return (
    <>
      <Navbar />
      <div className="px-6">
        <CartView />
      </div>
    </>
  );
};

export default CartPage;
