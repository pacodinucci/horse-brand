import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

export const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // body debe contener: items (array), payer (opcional), etc.
    // shape sugerido: { items: [{ title, quantity, unit_price, currency_id, picture_url }], ... }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Sin items en el carrito" },
        { status: 400 }
      );
    }

    // Armá la preferencia
    const preference = await new Preference(mercadopago).create({
      body: {
        items: body.items.map((item: any) => ({
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: item.currency_id || "ARS",
          picture_url: item.picture_url,
        })),
        back_urls: {
          success: process.env.MP_SUCCESS_URL || "https://tusitio.com/success",
          failure: process.env.MP_FAILURE_URL || "https://tusitio.com/failure",
          pending: process.env.MP_PENDING_URL || "https://tusitio.com/pending",
        },
        auto_return: "approved",
        // ... podés agregar payer, notification_url, etc.
      },
    });

    // Devuelve el init_point de MercadoPago (URL para redirigir al checkout)
    return NextResponse.json({ init_point: preference.init_point });
  } catch (err: any) {
    console.error("MP ERROR:", err);
    return NextResponse.json(
      { error: "Error procesando el pago" },
      { status: 500 }
    );
  }
}
