"use client";

import Image from 'next/image';
import { ProductVariant } from '@/types/product';

interface ProductVariantsProps {
    variants: ProductVariant[];
    sizes?: string[];
    currentImage: string;
    selectedSize: string;
    onImageSelect: (img: string) => void;
    onSizeSelect: (size: string) => void;
}

export function ProductVariants({
    variants,
    sizes,
    currentImage,
    selectedSize,
    onImageSelect,
    onSizeSelect
}: ProductVariantsProps) {

    // Encontra o nome da variante selecionada baseada na imagem atual
    const selectedVariantName = variants?.find(v => v.image === currentImage)?.name;

    return (
        <div className="space-y-6">
            {/* Cores / Modelos */}
            {variants && variants.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-gray-300 mb-2">
                        Cor: <span className="text-white font-bold">{selectedVariantName || "Selecione"}</span>
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {variants.map((variant, index) => (
                            <button
                                key={index}
                                onClick={() => onImageSelect(variant.image)}
                                className={`flex flex-col items-center p-1.5 rounded-md border-2 transition-all bg-white shadow-sm h-full ${currentImage === variant.image
                                    ? 'border-[#007185] ring-1 ring-[#007185]'
                                    : 'border-gray-200 hover:border-gray-400'
                                    }`}
                                title={variant.name}
                            >
                                <div className="relative w-full aspect-square rounded-sm overflow-hidden mb-1">
                                    <Image
                                        src={variant.image}
                                        alt={variant.name}
                                        fill
                                        className="object-contain p-1"
                                        sizes="80px"
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    {variant.price && (
                                        <span className="text-[11px] font-bold text-gray-900 leading-tight">
                                            R${variant.price.toFixed(2).replace('.', ',')}
                                        </span>
                                    )}
                                    {variant.originalPrice && (
                                        <span className="text-[9px] text-gray-500 line-through leading-tight">
                                            R${variant.originalPrice.toFixed(2).replace('.', ',')}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Tamanhos */}
            {sizes && sizes.length > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-bold text-gray-300">
                            Tamanho: <span className="text-white font-normal">{selectedSize || 'Selecione'}</span>
                        </h3>
                        <span className="text-xs text-primary cursor-pointer hover:underline">Tabela de medidas</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => onSizeSelect(size)}
                                className={`min-w-[3rem] px-3 h-10 rounded-lg flex items-center justify-center transition-all text-sm border ${selectedSize === size
                                    ? 'bg-primary/10 border-primary text-primary font-bold ring-1 ring-primary/50'
                                    : 'bg-transparent border-white/20 text-gray-300 hover:border-white/50'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
