import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductDetails } from '@/components/product/ProductDetails';
import { getProductById } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    // Normalização de dados para o componente (null -> undefined)
    const normalizedProduct = {
        ...product,
        costPrice: product.costPrice ?? undefined,
        originalPrice: product.originalPrice ?? undefined,
        variants: product.variants.map((v: any) => ({
            ...v,
            costPrice: v.costPrice ?? undefined,
            originalPrice: v.originalPrice ?? undefined,
        })),
    } as any;

    return (
        <main className="min-h-screen flex flex-col">
            <Header />

            <section className="flex-grow container mx-auto px-4 py-20 relative z-20">
                <ProductDetails product={normalizedProduct} />
            </section>

            <Footer />
        </main>
    );
}
