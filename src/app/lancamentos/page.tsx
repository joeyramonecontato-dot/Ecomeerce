import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { Product } from "@/types/product";
import { getUniqueProducts } from "@/utils/productUtils";
import { MotionSection } from "@/components/ui/MotionSection";
import { getProducts } from "@/lib/db";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function LancamentosPage() {
    const allProducts = await getProducts();
    const uniqueProducts = getUniqueProducts(allProducts);

    // Ordena por data de criação (mais recente primeiro)
    const lancamentos = uniqueProducts.sort((a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Header />

            <section className="pt-32 pb-10 bg-secondary/5">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                        <span className="text-blue-400">🚀 Novos</span> Lançamentos
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Confira as últimas novidades que acabaram de chegar em nossa loja.
                    </p>
                </div>
            </section>

            <MotionSection className="container mx-auto px-4 py-10" delay={0.2}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {lancamentos.length > 0 ? (
                        lancamentos.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-xl text-gray-500">Nenhum lançamento no momento.</p>
                        </div>
                    )}
                </div>
            </MotionSection>

            <Footer />
        </main>
    );
}
