import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CartDrawer } from "@/components/cart/CartDrawer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Impulso & Hype | O Melhor do Fitness e Tendências",
  description: "Encontre os produtos mais virais do momento com ofertas exclusivas.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={cn(inter.variable, outfit.variable, "font-sans bg-background text-foreground min-h-screen")}>
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
