import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { Product } from "@/types/product";
import { getUniqueProducts } from "@/utils/productUtils";
import { MotionSection } from "@/components/ui/MotionSection";
import { getProducts } from "@/lib/db";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function OfertasPage() {
    const allProducts = await getProducts();
    const uniqueProducts = getUniqueProducts(allProducts);

    // Filtra apenas produtos com oferta válida (expiresAt no futuro)
    const offers = uniqueProducts.filter(p => {
        if (!p.expiresAt) return false;
        return new Date(p.expiresAt) > new Date();
    });

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Header />

            <section className="pt-32 pb-10 bg-secondary/5">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                        <span className="text-red-500">🔥 Ofertas</span> Relâmpago
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Aproveite descontos imperdíveis por tempo limitado. O relógio está correndo!
                    </p>
                </div>
            </section>

            <MotionSection className="container mx-auto px-4 py-10" delay={0.2}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {offers.length > 0 ? (
                        offers.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-xl text-gray-500">Nenhuma oferta relâmpago disponível no momento.</p>
                        </div>
                    )}
                </div>
            </MotionSection>

            <Footer />
        </main>
    );
}
