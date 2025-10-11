export default function CategorySkeleton() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Promo Bar */}
      <div className="w-full bg-neutral-900 text-white text-xs md:text-sm py-2 px-4 text-center">
        INFO SOBRE CUOTAS, PROMOCIONES, ENVIOS, ETC
      </div>

      {/* Header / Minimal Nav (placeholder) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="font-semibold tracking-wide">LOGO</div>
          <nav className="hidden md:flex gap-4 text-sm">
            <button>CUEROS</button>
            <button>DECO</button>
            <button>LIVING</button>
            <button>BOLSOS &amp; CARTERAS</button>
            <button>MATES Y MATERAS</button>
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

      {/* Page Title + Controls */}
      <section className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-4">
        <h1 className="text-2xl font-semibold">Cueros</h1>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <button className="md:hidden h-9 px-3 rounded-md border">
            Mostrar Filtros
          </button>
          <div className="hidden md:flex items-center gap-2">
            <label className="text-neutral-600">Mostrar</label>
            <select className="h-9 rounded-md border px-2 text-sm">
              <option>9</option>
              <option>12</option>
              <option>18</option>
              <option>24</option>
            </select>
          </div>
          <select className="h-9 rounded-md border px-2 text-sm">
            <option>Orden predeterminado</option>
            <option>Popularidad</option>
            <option>Puntuación media</option>
            <option>Más recientes</option>
            <option>Precio: bajo a alto</option>
            <option>Precio: alto a bajo</option>
          </select>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-14 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden md:block">
          <div className="space-y-6 text-sm">
            <div>
              <div className="font-medium mb-2">Filtrar por Familia</div>
              <ul className="space-y-1">
                <li>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Cabra
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Lanar
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Vacuno
                  </label>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-medium mb-2">
                Filtrar por Tipo de Producto
              </div>
              <ul className="space-y-1">
                <li>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Cuero Tapicería
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Cueros
                  </label>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-medium mb-2">Filtrar por Color</div>
              <select className="w-full h-9 rounded-md border px-2 text-sm">
                <option>- Seleccionar -</option>
                <option>Vintage Claro</option>
                <option>Vintage Oscuro</option>
                <option>Blanco</option>
                <option>Negro</option>
                <option>Marrón</option>
                <option>Blanco - Negro</option>
                <option>Cebra</option>
                <option>Atigrado</option>
                <option>Exótico</option>
              </select>
            </div>

            <div>
              <div className="font-medium mb-2">Filtrar por Medida</div>
              <ul className="space-y-1">
                <li>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Small (Aprox 140x160 cm)
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Medium (Aprox 160x180 cm)
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Large (Aprox 180x200 cm)
                  </label>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <button className="w-full h-9 rounded-md border text-sm">
                Mostrar (186)
              </button>
              <button className="w-full h-9 rounded-md text-sm mt-2">
                Cancelar
              </button>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div>
          <div className="text-sm text-neutral-600 mb-3">
            Mostrando 1–12 de 186 resultados
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <article key={i} className="group">
                <div className="relative">
                  <div className="aspect-[3/4] rounded-xl border bg-neutral-50 mb-3" />
                  <button className="absolute top-2 right-2 h-8 px-2 rounded-md bg-white/90 border text-xs">
                    ♡
                  </button>
                </div>
                <h3 className="text-sm font-medium leading-snug">
                  Título de producto {i + 1}
                </h3>
                <div className="text-sm text-neutral-600">$ 0.000</div>

                {/* Variant swatches / selector placeholder */}
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex h-6 px-2 items-center rounded border text-xs">
                    Atigrado
                  </span>
                  <span className="inline-flex h-6 px-2 items-center rounded border text-xs">
                    Cebra
                  </span>
                  <span className="inline-flex h-6 px-2 items-center rounded border text-xs">
                    Marrón
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button className="h-9 px-3 rounded-md border text-sm">
                    Seleccionar opciones
                  </button>
                  <button className="h-9 px-3 rounded-md bg-neutral-900 text-white text-sm">
                    Añadir al carrito
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-2 text-sm">
            <button className="h-9 w-9 rounded-md border">1</button>
            <button className="h-9 w-9 rounded-md border">2</button>
            <button className="h-9 w-9 rounded-md border">3</button>
            <button className="h-9 w-9 rounded-md border">›</button>
          </div>
        </div>
      </section>
    </main>
  );
}
