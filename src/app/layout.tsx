import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "One Conversion Checkout",
  description: "Finalize sua compra com segurança.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Carrega a fonte General Sans diretamente da Fontshare */}
        <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      {/* A classe font-sans agora aplica a General Sans em todo o site */}
      <body className="font-sans">{children}</body>
    </html>
  );
}
