import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { CartItem } from "@/store/cart";
import db from "@/lib/db";

export const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cart: CartItem[] = body.cart;
    const customerId = body.customerId;

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: "Sin items en el carrito" },
        { status: 400 }
      );
    }

    if (!customerId) {
      return NextResponse.json({ error: "No hay customerId" }, { status: 400 });
    }

    const order = await db.order.create({
      data: {
        customerId,
        status: "pending",
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        items: {
          create: cart.map((item) => ({
            productVariantId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: { items: true },
    });

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
            // "https://horse-brand.vercel.app/success",
            "https://f24d331ffe77.ngrok-free.app/success",
          failure:
            process.env.MP_FAILURE_URL ||
            "https://horse-brand.vercel.app/failure",
          pending:
            process.env.MP_PENDING_URL ||
            "https://horse-brand.vercel.app/pending",
        },
        auto_return: "approved",
        external_reference: order.id,
        notification_url: "https://horse-brand.vercel.app/api/webhook",
      },
    });

    return NextResponse.json({ init_point: preference.init_point });
  } catch (err) {
    console.error("MP ERROR:", err);
    // console.error("MP ERROR message:", err?.message);
    // console.error("MP ERROR status:", err?.status ?? err?.response?.status);
    // console.error("MP ERROR data:", err?.response?.data ?? err?.cause);

    return NextResponse.json(
      { error: "Error procesando el pago" },
      { status: 500 }
    );
  }
}
