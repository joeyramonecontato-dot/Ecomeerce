import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

    console.log(`Migrando ${productsData.length} produtos...`);

    for (const item of productsData) {
        console.log(`Migrando: ${item.name}`);

        try {
            await prisma.product.upsert({
                where: { externalId: item.id },
                update: {},
                create: {
                    externalId: item.id,
                    name: item.name,
                    price: item.price,
                    costPrice: item.costPrice,
                    originalPrice: item.originalPrice,
                    description: item.description,
                    images: JSON.stringify(item.images),
                    category: item.category,
                    rating: item.rating || 0,
                    reviews: item.reviews || 0,
                    featured: item.featured || false,
                    salesCount: item.salesCount || 0,
                    video: item.video,
                    expiresAt: item.expiresAt ? new Date(item.expiresAt) : null,
                    variants: {
                        create: (item.variants || []).map((v: any) => ({
                            name: v.name,
                            image: v.image,
                            price: v.price,
                            originalPrice: v.originalPrice
                        }))
                    },
                    specifications: {
                        create: Object.entries(item.specifications || {}).map(([key, value]) => ({
                            key,
                            value: String(value)
                        }))
                    }
                }
            });
        } catch (error: any) {
            console.error(`Erro ao migrar ${item.name}:`, error.message || error);
        }
    }

    console.log('Migração concluída!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
