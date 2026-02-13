export interface ProductVariant {
    name: string;
    image: string;
    asin?: string;
    price?: number;
    originalPrice?: number;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number | null;
    costPrice?: number;
    description: string;
    images: string[];
    category: string;
    rating?: number;
    reviews?: number;
    sizes?: string[];
    colors?: string[];
    variants?: ProductVariant[];
    featured?: boolean;
    video?: string;
    expiresAt?: string | null;
    reviewsImages?: string[];
    specifications?: Record<string, string>;
    createdAt?: string;
    salesCount?: number;
    selectedSize?: string;
}
