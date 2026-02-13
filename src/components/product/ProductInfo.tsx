import { Star, Share2 } from 'lucide-react';
import { Product } from '@/types/product';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ProductInfoProps {
    product: Product;
    selectedVariantName?: string;
}

export function ProductInfo({ product, selectedVariantName }: ProductInfoProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start gap-4">
                <h1 className="text-xl md:text-2xl font-medium text-white leading-tight">
                    {product.name}
                </h1>
                <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                    <Share2 size={20} />
                </button>
            </div>

            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="flex text-[#FFA41C]">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            fill={i < Math.round(product.rating || 0) ? "currentColor" : "none"}
                            className={i >= Math.round(product.rating || 0) ? "text-[#FFA41C]/30" : ""}
                        />
                    ))}
                </div>
                <span className="text-sm font-medium text-primary hover:text-primary/80 hover:underline cursor-pointer">
                    {product.reviews} avaliações
                </span>
            </div>

            {/* SELETOR DE CORES (Movido para ProductVariants) */}

            {/* TAMANHOS (Apenas se houver e for relevante) */}
            {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-300">Tamanho:</span>
                        <button className="text-xs text-primary hover:underline">Tabela de medidas</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                            <button
                                key={size}
                                className={cn(
                                    "px-4 py-2 text-xs font-medium border rounded-md transition-all",
                                    "border-white/10 text-gray-300 hover:border-primary hover:text-primary"
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="border-t border-white/5 pt-4">
                <h3 className="font-bold text-sm text-white mb-3">Sobre este item</h3>
                <div className="text-sm text-gray-300 leading-relaxed">
                    <ul className="list-disc pl-5 space-y-2">
                        {product.description.split('\n').filter(line => line.trim()).map((line, i) => (
                            <li key={i}>{line.replace(/^[-•] /, '')}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
