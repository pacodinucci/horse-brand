import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next";
import { WhatsAppButtonGuard } from "@/modules/structure/components/whatsapp/whatsapp-button-guard";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Horse Brand",
  description: "Life&Deco E-commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NuqsAdapter>
      <TRPCReactProvider>
        <html lang="en">
          <body className={`${lato.className}  antialiased`}>
            <Toaster />
            {children}
            <WhatsAppButtonGuard
              phoneE164="5491140851990"
              message="Hola! Estoy en la tienda de Horse Brand y quiero consultar por un producto."
              hiddenPrefixes={["/backoffice"]}
            />
          </body>
        </html>
      </TRPCReactProvider>
    </NuqsAdapter>
  );
}
