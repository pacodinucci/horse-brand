import Link from "next/link";

export const CheckoutFooter = () => {
  return (
    <footer className="border-t border-[#f0e6d8] bg-zinc-50">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between text-[11px] text-neutral-700">
        <nav className="flex flex-wrap gap-x-8 gap-y-2">
          <Link href="#" className="hover:underline tracking-[0.08em]">
            Condiciones Generales de Venta
          </Link>
          <Link href="#" className="hover:underline tracking-[0.08em]">
            Términos y Condiciones Generales de Uso
          </Link>
          <Link href="#" className="hover:underline tracking-[0.08em]">
            Política de privacidad
          </Link>
          <Link href="#" className="hover:underline tracking-[0.08em]">
            Aviso legal
          </Link>
        </nav>

        <p className="whitespace-nowrap tracking-[0.08em] text-right">
          © Horse Brand {new Date().getFullYear()}. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
};
