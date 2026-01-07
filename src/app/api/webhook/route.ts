import { NextResponse } from "next/server";
import db from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const INTERNAL_SALES_EMAIL = process.env.INTERNAL_SALES_EMAIL!;
const RESEND_FROM = process.env.RESEND_FROM!; // ej: "Tienda <ventas@tudominio.com>"

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, action, data } = body;

    // Aceptá también payment.updated si querés mayor confiabilidad
    if (
      type !== "payment" ||
      (action !== "payment.created" && action !== "payment.updated")
    ) {
      return NextResponse.json({ received: true });
    }

    const paymentId = data?.id;
    if (!paymentId) return NextResponse.json({ received: true });

    // 1) Traer pago en MP
    const resp = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    );

    if (!resp.ok) {
      console.error("MP fetch error:", resp.status, await resp.text());
      return NextResponse.json({ received: true });
    }

    const payment = await resp.json();
    const orderId: string | null = payment?.external_reference ?? null;
    if (!orderId) return NextResponse.json({ received: true });

    // 2) Traer orden + customer + items
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        Customer: true,
      },
    });

    if (!order) {
      console.error("Order not found:", orderId);
      return NextResponse.json({ received: true });
    }

    // 3) Estados
    if (payment.status === "approved") {
      // ✅ Idempotencia: si ya se procesó, no repetir (ni stock ni emails)
      if (order.status === "PAID") {
        return NextResponse.json({ received: true });
      }

      // 4) Transacción: marcar PAID + descontar stock
      await db.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: orderId },
          data: { status: "PAID" },
        });

        for (const item of order.items) {
          await tx.stock.updateMany({
            where: { productVariantId: item.productVariantId },
            data: { quantity: { decrement: item.quantity } },
          });
        }
      });

      // 5) Emails (afuera de la transacción)
      const customerEmail = order.Customer?.email;
      if (customerEmail) {
        await resend.emails.send({
          from: RESEND_FROM,
          to: customerEmail,
          cc: "francisco@dinucci.com.ar",
          subject: "Compra confirmada",
          html: `<p>Tu compra fue confirmada. Orden: <b>${orderId}</b></p>`,
        });
      } else {
        console.error("Customer email missing for order:", orderId);
      }

      await resend.emails.send({
        from: RESEND_FROM,
        to: INTERNAL_SALES_EMAIL,
        subject: `Nueva venta • Orden ${orderId}`,
        html: `<p>Nueva venta confirmada. Orden: <b>${orderId}</b></p>`,
      });

      return NextResponse.json({ received: true });
    }

    if (payment.status === "rejected") {
      if (order.status !== "CANCELLED") {
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
    // Recomendación: evitar 500 para no generar reintentos agresivos
    return NextResponse.json({ received: true });
  }
}
