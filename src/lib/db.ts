import { prisma } from './prisma';

export interface Order {
    id?: string;
    orderNumber: string;
    customer: any;
    items: any[];
    payment: string;
    totals: any;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export async function saveOrder(order: any) {
    return await prisma.order.create({
        data: {
            orderNumber: order.orderNumber,
            customerName: order.customer.name,
            customerEmail: order.customer.email,
            items: JSON.stringify(order.items),
            paymentStatus: order.status || 'pending',
            total: order.totals.total
        }
    });
}

export async function getOrders() {
    return await prisma.order.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export async function getProducts() {
    const products = await prisma.product.findMany({
        include: {
            variants: true,
            specifications: true
        },
        orderBy: { createdAt: 'desc' }
    });

    return products.map((p: any) => ({
        ...p,
        id: p.externalId || p.id,
        images: JSON.parse(p.images),
        specifications: p.specifications.reduce((acc: any, spec: any) => {
            acc[spec.key] = spec.value;
            return acc;
        }, {})
    }));
}

export async function getProductById(id: string) {
    const p = await prisma.product.findFirst({
        where: {
            OR: [
                { id: id },
                { externalId: id }
            ]
        },
        include: {
            variants: true,
            specifications: true
        }
    });

    if (!p) return null;

    return {
        ...p,
        id: p.externalId || p.id,
        images: JSON.parse(p.images),
        specifications: p.specifications.reduce((acc: any, spec: any) => {
            acc[spec.key] = spec.value;
            return acc;
        }, {})
    };
}
