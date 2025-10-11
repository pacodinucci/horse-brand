export default function ProductSkeleton() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Promo Bar */}
      <div className="w-full bg-neutral-900 text-white text-xs md:text-sm py-2 px-4 text-center">
        INFO SOBRE CUOTAS, PROMOCIONES, ENVIOS, ETC
      </div>

      {/* Header (placeholder) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="font-semibold tracking-wide">LOGO</div>
          <nav className="hidden md:flex gap-4 text-sm">
            <button>CUEROS</button>
            <button>DECO</button>
            <button>LIVING</button>
            <button>BOLSOS &amp; CARTERAS</button>
            <button>INDUMENTARIA</button>
            <button>ACCESORIOS</button>
            <button className="text-red-600">SALE</button>
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <button>Buscar</button>
            <button>Cuenta</button>
            <button>Carrito (0)</button>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 pt-4 text-xs md:text-sm text-neutral-600">
        Inicio / Cueros /{" "}
        <span className="text-neutral-900">
          Cuero vacuno para tapicería y marroquinería
        </span>
      </div>

      {/* Product Main */}
      <section className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10">
        {/* Gallery */}
        <div>
          <div className="aspect-[4/5] rounded-xl border bg-neutral-50 mb-3" />
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg border bg-neutral-50"
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight mb-2">
            Cuero vacuno para tapicería y marroquinería
          </h1>

          {/* Meta (SKU / categoría) */}
          <div className="text-sm text-neutral-600 mb-3">
            SKU: CU-VAC-001 · Categoría: Cueros
          </div>

          {/* Price */}
          <div className="text-2xl font-semibold mb-4">$ 0.000</div>

          {/* Variant selectors */}
          <div className="space-y-4 mb-5">
            <div>
              <div className="text-sm font-medium mb-2">Color</div>
              <div className="flex flex-wrap gap-2">
                {["Vintage Claro", "Vintage Oscuro", "Natural", "Negro"].map(
                  (opt) => (
                    <button
                      key={opt}
                      className="h-8 px-3 rounded-md border text-xs"
                    >
                      {opt}
                    </button>
                  )
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Medida</div>
              <div className="flex flex-wrap gap-2">
                {["Small", "Medium", "Large"].map((opt) => (
                  <button
                    key={opt}
                    className="h-8 px-3 rounded-md border text-xs"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity + CTA */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center border rounded-md">
              <button className="h-10 w-10">−</button>
              <input className="h-10 w-12 text-center" defaultValue={1} />
              <button className="h-10 w-10">＋</button>
            </div>
            <button className="h-10 px-5 rounded-md bg-neutral-900 text-white text-sm">
              Añadir al carrito
            </button>
            <button className="h-10 px-5 rounded-md border text-sm">
              Comprar ahora
            </button>
          </div>

          {/* Trust / badges */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-neutral-700 mb-6">
            <li className="rounded-md border p-3">6 cuotas sin interés</li>
            <li className="rounded-md border p-3">15% OFF transferencia</li>
            <li className="rounded-md border p-3">Envíos a todo el país</li>
            <li className="rounded-md border p-3">AMBA en el día</li>
          </ul>

          {/* Accordion / Tabs (Descripción, Información adicional, Cuidados, Envíos) */}
          <div className="divide-y border rounded-xl overflow-hidden">
            <details open>
              <summary className="cursor-pointer select-none p-4 text-sm font-medium">
                Descripción
              </summary>
              <div className="p-4 text-sm text-neutral-700">
                Descripción breve del cuero vacuno, usos sugeridos,
                terminaciones y características.
              </div>
            </details>
            <details>
              <summary className="cursor-pointer select-none p-4 text-sm font-medium">
                Información adicional
              </summary>
              <div className="p-4 text-sm text-neutral-700">
                Composición, espesor aprox., origen, terminación.
              </div>
            </details>
            <details>
              <summary className="cursor-pointer select-none p-4 text-sm font-medium">
                Cuidados
              </summary>
              <div className="p-4 text-sm text-neutral-700">
                Indicaciones de limpieza y mantenimiento.
              </div>
            </details>
            <details>
              <summary className="cursor-pointer select-none p-4 text-sm font-medium">
                Envíos &amp; cambios
              </summary>
              <div className="p-4 text-sm text-neutral-700">
                Políticas de envío, devoluciones y cambios.
              </div>
            </details>
          </div>

          {/* Share / Tags */}
          <div className="mt-6 flex items-center gap-3 text-sm">
            <button className="underline">Compartir</button>
            <span className="text-neutral-400">·</span>
            <span>Etiquetas: cuero, vacuno, tapicería</span>
          </div>
        </div>
      </section>

      {/* Related products */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold">
            Productos relacionados
          </h2>
          <button className="text-sm underline">Ver todos</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="group">
              <div className="aspect-[3/4] rounded-xl border bg-neutral-50 mb-3" />
              <div className="text-sm font-medium truncate">
                Producto {i + 1}
              </div>
              <div className="text-sm text-neutral-600">$ 0.000</div>
              <button className="mt-2 text-sm underline">Ver detalle</button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer (placeholder corto) */}
      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-neutral-600">
          © 2025 · Marca de referencia · Todos los derechos reservados
        </div>
      </footer>
    </main>
  );
}
