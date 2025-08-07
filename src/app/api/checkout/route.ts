import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { CartItem } from "@/store/cart";

export const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cart: CartItem[] = body.cart;

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: "Sin items en el carrito" },
        { status: 400 }
      );
    }

    // Armar items para MP
    const mpItems = cart.map((item) => ({
      id: item.id,
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "ARS",
      // picture_url: item.image, // Opcional, si querés mostrar imagen en MP
    }));

    // Crear preferencia
    const preference = await new Preference(mercadopago).create({
      body: {
        items: mpItems,
        back_urls: {
          success:
            process.env.MP_SUCCESS_URL ||
            "https://4c71c05ac111.ngrok-free.app/success",
          failure:
            process.env.MP_FAILURE_URL ||
            "https://4c71c05ac111.ngrok-free.app/failure",
          pending:
            process.env.MP_PENDING_URL ||
            "https://4c71c05ac111.ngrok-free.app/pending",
        },
        auto_return: "approved",
        // notification_url: "https://tusitio.com/api/webhook/mp", // Si ya querés el webhook
      },
    });

    return NextResponse.json({ init_point: preference.init_point });
  } catch (err) {
    console.error("MP ERROR:", err);
    return NextResponse.json(
      { error: "Error procesando el pago" },
      { status: 500 }
    );
  }
}
