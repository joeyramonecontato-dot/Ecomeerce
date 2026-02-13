"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/store/useCart";
import { Product } from "@/types/product";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const [timeLeft, setTimeLeft] = useState<string>("");

    // Lógica do Cronômetro
    useEffect(() => {
        if (!product.expiresAt) return;

        const calculateTimeLeft = () => {
            const difference = +new Date(product.expiresAt!) - +new Date();
            if (difference > 0) {
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            } else {
                setTimeLeft("EXPIRADO");
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [product.expiresAt]);

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`group relative bg-card border rounded-xl overflow-hidden transition-all duration-300 ${product.expiresAt ? 'border-red-500/30 ring-1 ring-red-500/20' : 'border-white/5 hover:border-primary/30'}`}
        >
            {/* Badge de Oferta */}
            {product.expiresAt && (
                <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                    <span>🔥 OFERTA</span>
                    {timeLeft && <span className="font-mono bg-black/20 px-1 rounded">{timeLeft}</span>}
                </div>
            )}

            <div className="relative aspect-square overflow-hidden bg-white/5">
                <Link href={`/product/${product.id}`}>
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </Link>
                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center bg-gradient-to-t from-black/80 to-transparent">
                    <Button
                        size="sm"
                        className="w-full rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white border-0"
                        onClick={() => addItem(product)}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Adicionar
                    </Button>
                </div>
            </div>

            <div className="p-4">
                <Link href={`/product/${product.id}`}>
                    <h3 className="font-heading font-medium text-lg leading-tight mb-2 truncate group-hover:text-primary transition-colors cursor-pointer">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 line-through">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price * 1.4)}
                        </span>
                        <span className={`text-xl font-bold ${product.expiresAt ? 'text-red-500' : 'text-white'}`}>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </span>
                    </div>
                    {product.rating && (
                        <div className="text-xs text-yellow-500 flex items-center">
                            ★ {product.rating.toFixed(1)}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
