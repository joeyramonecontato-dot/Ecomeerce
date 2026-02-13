import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { Product } from "@/types/product";
import { getUniqueProducts } from "@/utils/productUtils";
import { MotionSection } from "@/components/ui/MotionSection";
import { getProducts } from "@/lib/db";

export const dynamic = 'force-dynamic';

// Mapa de slugs para títulos e descrições
const categoryMap: Record<string, { title: string; subtitle: string; color: string }> = {
    'tech': {
        title: "Tech & Gadgets",
        subtitle: "A tecnologia a favor da sua performance.",
        color: "text-blue-400"
    },
    'supplements': {
        title: "Suplementação",
        subtitle: "Combustível de alta qualidade para o seu corpo.",
        color: "text-green-400"
    },
    'equipment': {
        title: "Musculação & Equipamentos",
        subtitle: "Monte seu templo de treino em casa.",
        color: "text-orange-400"
    },
    'apparel': {
        title: "Moda Fitness",
        subtitle: "Estilo e conforto para superar seus limites.",
        color: "text-purple-400"
    }
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    // Await params in Next.js 15+ (if applicable, but safe pattern generally)
    const resolvedParams = await params;
    const slug = resolvedParams.category;
    const config = categoryMap[slug];

    // Se categoria não existe, mostra fallback genérico
    if (!config) {
        return (
            <main className="min-h-screen flex flex-col bg-background">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <h1 className="text-2xl font-bold">Categoria não encontrada</h1>
                </div>
                <Footer />
            </main>
        );
    }

    const allProducts = await getProducts();
    const uniqueProducts = getUniqueProducts(allProducts);

    // Filtra produtos pela categoria
    // Normaliza comparações para garantir match (ex: 'tech' vs 'Tech')
    const categoryProducts = uniqueProducts.filter(p =>
        p.category?.toLowerCase() === slug.toLowerCase() ||
        (slug === 'apparel' && (p.name.toLowerCase().includes('camisa') || p.name.toLowerCase().includes('short') || p.name.toLowerCase().includes('legging'))) // Fallback inteligente se cateoria falhar no scraper antigo
    );

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Header />

            <section className="pt-32 pb-10 bg-secondary/5">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                        <span className={config.color}>{config.title.split(" ")[0]} </span>
                        {config.title.split(" ").slice(1).join(" ")}
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        {config.subtitle}
                    </p>
                </div>
            </section>

            <MotionSection className="container mx-auto px-4 py-10" delay={0.2}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categoryProducts.length > 0 ? (
                        categoryProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 flex flex-col items-center">
                            <p className="text-xl text-gray-500 mb-4">Nenhum produto encontrado nesta categoria ainda.</p>
                            <p className="text-sm text-gray-600">Nosso sistema está buscando ofertas... Volte em breve!</p>
                        </div>
                    )}
                </div>
            </MotionSection>

            <Footer />
        </main>
    );
}
