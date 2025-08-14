import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, action, data } = body;

    if (type === "payment" && action === "payment.created") {
      const paymentId = data.id;

      // 1. Traer info del pago de MercadoPago
      const resp = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          },
        }
      );
      const payment = await resp.json();

      const orderId = payment.external_reference;

      if (payment.status === "approved") {
        // 2. Traer los items de la orden
        const order = await db.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });

        if (!order) throw new Error("Order not found");

        // 3. Actualizar estado y descontar stock por cada item
        await db.$transaction([
          db.order.update({
            where: { id: orderId },
            data: { status: "PAID" },
          }),
          ...order.items.map((item) =>
            db.stock.updateMany({
              where: { productVariantId: item.productVariantId },
              data: { quantity: { decrement: item.quantity } },
            })
          ),
        ]);
      } else if (payment.status === "rejected") {
        await db.order.update({
          where: { id: orderId },
          data: { status: "CANCELLED" },
        });
      }

      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error en webhook MP:", err);
    return NextResponse.json(
      { error: "Error procesando webhook" },
      { status: 500 }
    );
  }
}
