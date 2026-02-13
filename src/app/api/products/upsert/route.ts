import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        const productData = await request.json();

        if (!productData || !productData.name || !productData.price) {
            return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
        }

        const product = await prisma.product.upsert({
            where: { externalId: productData.id },
            update: {
                name: productData.name,
                price: productData.price,
                costPrice: productData.costPrice,
                originalPrice: productData.originalPrice,
                description: productData.description || '',
                images: JSON.stringify(productData.images || []),
                category: productData.category || 'fitness',
                video: productData.video,
                expiresAt: productData.expiresAt ? new Date(productData.expiresAt) : null,
                salesCount: productData.salesCount || 0,
                // Nota: Por simplicidade, não estamos atualizando variantes/especificações via API aqui, 
                // mas poderíamos expandir se necessário.
            },
            create: {
                externalId: productData.id,
                name: productData.name,
                price: productData.price,
                costPrice: productData.costPrice,
                originalPrice: productData.originalPrice,
                description: productData.description || '',
                images: JSON.stringify(productData.images || []),
                category: productData.category || 'fitness',
                video: productData.video,
                expiresAt: productData.expiresAt ? new Date(productData.expiresAt) : null,
                salesCount: productData.salesCount || 0,
                variants: {
                    create: (productData.variants || []).map((v: any) => ({
                        name: v.name,
                        image: v.image,
                        price: v.price,
                        originalPrice: v.originalPrice
                    }))
                }
            }
        });

        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        console.error('Erro ao salvar produto:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
