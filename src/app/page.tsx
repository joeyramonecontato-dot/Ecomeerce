import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { FeaturesStrip } from "@/components/layout/FeaturesStrip";
import { PromoBanners } from "@/components/layout/PromoBanners";
import { Product } from "@/types/product";
import { getUniqueProducts } from "@/utils/productUtils";
import { MotionSection } from "@/components/ui/MotionSection";
import { getProducts } from "@/lib/db";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function Home() {
  const allProducts = await getProducts();
  const uniqueProducts = getUniqueProducts(allProducts);

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />

      <Hero />

      <MotionSection delay={0.1}>
        <FeaturesStrip />
      </MotionSection>

      <MotionSection delay={0.2}>
        <PromoBanners />
      </MotionSection>

      {/* SEÇÃO 1: OFERTAS RELÂMPAGO */}
      {uniqueProducts.some(p => p.expiresAt) && (
        <MotionSection className="container mx-auto px-4 py-8" delay={0.3}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-heading font-bold flex items-center gap-2">
              <span className="text-red-500">🔥 Ofertas</span> Relâmpago
            </h2>
            <a href="/ofertas" className="text-sm text-primary hover:text-white transition-colors">
              Ver todas &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {uniqueProducts.filter(p => p.expiresAt).slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </MotionSection>
      )}

      {/* SEÇÃO 2: MAIS BARATOS (Solicitado pelo usuário) */}
      <MotionSection className="container mx-auto px-4 py-8" delay={0.2}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-heading font-bold flex items-center gap-2">
            <span className="text-green-500">💰 Mais</span> Baratos
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {uniqueProducts
            .filter(p => p.price > 0) // Garante que não pega erro de preço zerado
            .sort((a, b) => a.price - b.price)
            .slice(0, 4)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </MotionSection>

      {/* SEÇÃO 3: MAIS VENDIDOS */}
      <MotionSection className="bg-secondary/5 py-16 border-y border-white/5" delay={0.2}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-heading font-bold">
              <span className="text-gradient">Mais</span> Vendidos
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {uniqueProducts
              .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      </MotionSection>

      {/* SEÇÃO 3: LANÇAMENTOS */}
      <MotionSection className="container mx-auto px-4 py-16" delay={0.2}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-heading font-bold">
            <span className="text-blue-400">Novos</span> Lançamentos
          </h2>
          <a href="/lancamentos" className="text-sm text-primary hover:text-white transition-colors">
            Ver tudo &rarr;
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {uniqueProducts
            .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
            .slice(0, 8)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </MotionSection>

      <Footer />
    </main>
  );
}
