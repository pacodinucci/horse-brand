export default function LandingSkeleton() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Top Promo Bar */}
      <div className="w-full bg-neutral-900 text-white text-xs md:text-sm py-2 px-4 text-center">
        INFO SOBRE CUOTAS, PROMOCIONES, ENVIOS, ETC
      </div>

      {/* Header / Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="font-semibold tracking-wide">LOGO</div>
          <nav className="hidden md:flex gap-6 text-sm">
            <button className="hover:opacity-70">CUEROS</button>
            <button className="hover:opacity-70">DECO</button>
            <button className="hover:opacity-70">LIVING</button>
            <button className="hover:opacity-70">BOLSOS &amp; CARTERAS</button>
            <button className="hover:opacity-70">ACCESORIOS</button>
            <button className="text-red-600">SALE</button>
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <button className="hover:opacity-70">Buscar</button>
            <button className="hover:opacity-70">Cuenta</button>
            <button className="hover:opacity-70">Carrito (0)</button>
          </div>
        </div>
      </header>

      {/* Mega Categories (grid of category tiles) */}
      <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          "DECO",
          "Accesorios",
          "Bolsos y Carteras",
          "Cueros",
          "Living",
          "Mates y Materas",
        ].map((cat) => (
          <div
            key={cat}
            className="aspect-square rounded-xl border flex items-end p-4 bg-neutral-50"
          >
            <span className="text-sm font-medium">{cat}</span>
          </div>
        ))}
      </section>

      {/* Feature Strips (category spotlight links) */}
      <section className="max-w-7xl mx-auto px-4 pb-2 grid md:grid-cols-4 gap-4">
        {["Mates y materas", "Marroquinería", "BKF", "Alfombras"].map(
          (label) => (
            <a
              key={label}
              className="h-40 rounded-xl border bg-neutral-50 flex items-center justify-center text-center text-sm font-medium"
            >
              {label} · Ver más
            </a>
          )
        )}
      </section>

      {/* New Launches / Featured Products grid */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold">
            Nuevos lanzamientos
          </h2>
          <button className="text-sm underline">Ver todo</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="group">
              <div className="aspect-[3/4] rounded-xl border bg-neutral-50 mb-3" />
              <div className="text-sm font-medium truncate">
                Producto {i + 1}
              </div>
              <div className="text-sm text-neutral-600">$ 0.000</div>
              <button className="mt-2 text-sm underline">
                Seleccionar opciones
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Brand / Factory blurb */}
      <section className="bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div className="h-64 rounded-xl border bg-white" />
          <div>
            <h3 className="text-2xl font-semibold mb-2">
              Nuestra Fábrica · HORSE BRAND
            </h3>
            <p className="text-sm leading-6 text-neutral-700">
              Descubrí nuestra amplia gama de productos de cuero natural, desde
              marroquinería hasta decoración, ideales para quienes buscan
              durabilidad y estilo.
            </p>
          </div>
        </div>
      </section>

      {/* Locations / Showrooms */}
      <section className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
        <div>
          <h4 className="text-lg font-semibold mb-3">Showrooms</h4>
          <ul className="space-y-2 text-sm">
            <li>Dirección Showroom</li>
          </ul>
        </div>
      </section>

      {/* Contact / Lead form */}
      <section className="bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h3 className="text-xl font-semibold mb-6">Contáctanos</h3>
          <form className="grid gap-4">
            <input
              className="h-10 rounded-md border px-3 text-sm"
              placeholder="Tu nombre"
            />
            <input
              className="h-10 rounded-md border px-3 text-sm"
              placeholder="Tu correo electrónico"
            />
            <textarea
              className="min-h-28 rounded-md border px-3 py-2 text-sm"
              placeholder="Tu mensaje (opcional)"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="h-10 px-5 rounded-md bg-neutral-900 text-white text-sm"
              >
                Enviar
              </button>
              <p className="text-xs text-neutral-600">
                Respondemos dentro del día.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-4 gap-6 text-sm">
          <div>
            <div className="font-semibold mb-2">Horse Brand</div>
            <p className="text-neutral-600">
              Gama de productos de cuero natural. Durabilidad y estilo.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-2">Redes</div>
            <ul className="space-y-1 text-neutral-600">
              <li>Instagram</li>
              <li>Facebook</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Ayuda</div>
            <ul className="space-y-1 text-neutral-600">
              <li>Contacto</li>
              <li>Preguntas frecuentes</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Newsletter</div>
            <div className="flex gap-2">
              <input
                className="h-10 flex-1 rounded-md border px-3 text-sm"
                placeholder="Tu email"
              />
              <button className="h-10 px-4 rounded-md border text-sm">
                Suscribirme
              </button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
