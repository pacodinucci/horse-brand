// app/api/products/export/route.ts
import ExcelJS from "exceljs";
import db from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toTitleCase(s?: string | null) {
  if (!s) return "";
  return s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}
function toUpper(s?: string | null) {
  return (s ?? "").toString().trim().toUpperCase();
}
const joinArr = (arr?: string[] | null) =>
  Array.isArray(arr) && arr.length ? arr.join(", ") : "";

export async function GET() {
  // 1) Traer TODOS los productos (no variantes)
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      subCategory: true,
      // Sólo para poblar "SKU" con alguna referencia si existe
      ProductVariant: {
        select: { sku: true },
        take: 1, // primer SKU si hay
      },
    },
  });

  // 2) Armar workbook
  const wb = new ExcelJS.Workbook();
  wb.creator = "Backoffice";
  wb.created = new Date();

  // -------- Hoja principal: Sheet1 (formato EXACTO, sin 'Cantidad') --------
  const ws = wb.addWorksheet("Sheet1", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  ws.columns = [
    { header: "SKU", key: "SKU", width: 16 },
    { header: "Categoria", key: "Categoria", width: 24 },
    { header: "Subcategoria", key: "Subcategoria", width: 24 },
    { header: "Producto", key: "Producto", width: 40 }, // UPPER
    { header: "Nombre Base", key: "NombreBase", width: 32 }, // Title Case
    { header: "Material", key: "Material", width: 24 }, // join de materials
    { header: "Color", key: "Color", width: 24 }, // join de colors
    { header: "Medidas", key: "Medidas", width: 24 }, // join de measures
    { header: "Precio", key: "Precio", width: 12 },
    { header: "Proveedor", key: "Proveedor", width: 20 },
  ];
  ws.getRow(1).font = { bold: true };

  for (const p of products) {
    const sku = p.ProductVariant?.[0]?.sku ?? ""; // puede quedar vacío
    ws.addRow({
      SKU: sku,
      Categoria: p.category?.name ?? "",
      Subcategoria: p.subCategory?.name ?? "",
      Producto: toUpper(p.name),
      NombreBase: toTitleCase(p.name),
      Material: joinArr(p.materials)?.toUpperCase(),
      Color: joinArr(p.colors)?.toUpperCase(),
      Medidas: joinArr(p.measures), // medidas suelen tener "2x3", no forzamos mayúscula
      Precio: p.price ?? 0,
      Proveedor: p.supplier ?? "",
    });
  }

  // -------- (Opcional) Hoja Categorias --------
  const wsCat = wb.addWorksheet("Categorias", {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  wsCat.columns = [
    { header: "Categoria", key: "Categoria", width: 24 },
    { header: "Subcategoria", key: "Subcategoria", width: 24 },
  ];
  wsCat.getRow(1).font = { bold: true };
  const subs = await db.subcategory.findMany({
    include: { category: true },
    orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
  });
  for (const s of subs) {
    wsCat.addRow({
      Categoria: s.category?.name ?? "",
      Subcategoria: s.name,
    });
  }

  // -------- (Opcional) Hoja Listas --------
  const wsList = wb.addWorksheet("Listas", {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  wsList.columns = [
    { header: "Materiales", key: "Materiales", width: 24 },
    { header: "Colores", key: "Colores", width: 24 },
    { header: "Medidas", key: "Medidas", width: 24 },
  ];
  wsList.getRow(1).font = { bold: true };

  // Listas únicas desde PRODUCTS
  const mats = new Set<string>();
  const cols = new Set<string>();
  const meas = new Set<string>();
  for (const p of products) {
    (p.materials ?? []).forEach((m) => mats.add(toUpper(m)));
    (p.colors ?? []).forEach((c) => cols.add(toUpper(c)));
    (p.measures ?? []).forEach((m) => meas.add(m));
  }
  const matsArr = Array.from(mats).sort();
  const colsArr = Array.from(cols).sort();
  const measArr = Array.from(meas).sort();
  const maxLen = Math.max(matsArr.length, colsArr.length, measArr.length, 1);
  for (let i = 0; i < maxLen; i++) {
    wsList.addRow({
      Materiales: matsArr[i] ?? "",
      Colores: colsArr[i] ?? "",
      Medidas: measArr[i] ?? "",
    });
  }

  // 3) Enviar archivo
  const buf = await wb.xlsx.writeBuffer();
  const filename = `Productos_HB_${new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, "-")}.xlsx`;

  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
