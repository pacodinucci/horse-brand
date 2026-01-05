import Link from "next/link";
import { MdWhatsapp } from "react-icons/md";

type WhatsAppButtonProps = {
  phoneE164: string;
  message?: string;
};

function buildWhatsAppUrl(phoneE164: string, message?: string) {
  const base = `https://wa.me/${phoneE164}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppButton({
  phoneE164,
  message = "Hola! Quería hacer una consulta.",
}: WhatsAppButtonProps) {
  const href = buildWhatsAppUrl(phoneE164, message);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Enviar mensaje por WhatsApp"
        className="
          group
          flex items-center
          h-14 w-14
          overflow-hidden
          rounded-full
          bg-green-600 text-white
          shadow-lg
          transition-all duration-300 ease-out
          hover:w-48
          hover:bg-green-700
          hover:px-5
        "
      >
        {/* Icono: siempre visible */}
        <MdWhatsapp className="ml-3 hover:ml-0 h-8 w-8 shrink-0 text-white" />

        {/* Texto: no ocupa ancho hasta hover */}
        <span
          className="
            ml-0
            max-w-0 overflow-hidden
            whitespace-nowrap
            opacity-0
            transition-all duration-300 ease-out
            group-hover:ml-3
            group-hover:max-w-[160px]
            group-hover:opacity-100
            text-sm font-medium
          "
        >
          Enviar mensaje
        </span>
      </Link>
    </div>
  );
}
