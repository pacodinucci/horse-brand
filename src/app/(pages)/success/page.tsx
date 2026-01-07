"use client";

import React, { useEffect } from "react";
import { useCartStore } from "@/store/cart";

const SuccessPage = () => {
  const { clearCart, items } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  console.log("CART --> ", items);

  return <div>Gracias por tu compra!</div>;
};

export default SuccessPage;
