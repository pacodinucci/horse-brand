"use client";

import { usePathname } from "next/navigation";
import { WhatsAppButton } from "./whatsapp-button";

type Props = {
  phoneE164: string;
  message?: string;
  /** prefijo(s) de rutas donde NO se muestra */
  hiddenPrefixes?: string[];
};

export function WhatsAppButtonGuard({
  phoneE164,
  message,
  hiddenPrefixes = ["/backoffice"],
}: Props) {
  const pathname = usePathname();

  const isHidden = hiddenPrefixes.some((prefix) =>
    pathname?.startsWith(prefix)
  );

  if (isHidden) return null;

  return <WhatsAppButton phoneE164={phoneE164} message={message} />;
}
