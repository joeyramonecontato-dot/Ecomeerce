"use client";

import { useState } from 'react';
import { useCart } from '@/store/useCart';
import { Product } from '@/types/product';
import { ChevronDown, Star, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reviews, faq } from '@/data/conversionElements';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

// Novos Componentes
import { ProductGallery } from './ProductGallery';
import { ProductInfo } from './ProductInfo';
import { ProductVariants } from './ProductVariants';
import { BuyBox } from './BuyBox';

export function ProductDetails({ product }: { product: Product }) {
    const { addItem } = useCart();
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [currentImage, setCurrentImage] = useState(product.variants?.[0]?.image || product.images[0]);
    const [currentPrice, setCurrentPrice] = useState(product.variants?.[0]?.price || product.price);
    const [currentOriginalPrice, setCurrentOriginalPrice] = useState(product.variants?.[0]?.originalPrice || product.originalPrice);
    const [selectedVariantName, setSelectedVariantName] = useState(product.variants?.[0]?.name || '');
    const [showingVideo, setShowingVideo] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const handleAddToCart = () => {
        if (product.sizes?.length && !selectedSize) return;
        // Usa o preço e imagem atualizados (da variante) para o carrinho
        addItem({
            ...product,
            images: [currentImage, ...product.images.filter(img => img !== currentImage)],
            price: currentPrice,
            originalPrice: currentOriginalPrice,
            selectedSize: selectedSize || undefined
        });
    };

    const handleImageSelect = (img: string) => {
        setCurrentImage(img);
        setShowingVideo(false);

        // Se a imagem selecionada pertence a uma variante, atualiza o preço
        const variant = product.variants?.find(v => v.image === img);
        if (variant) {
            setSelectedVariantName(variant.name);
            if (variant.price) {
                setCurrentPrice(variant.price);

                // Se a variante tem um originalPrice próprio, usa ele. 
                // Caso contrário, calcula proporcionalmente baseado no produto base.
                if (variant.originalPrice) {
                    setCurrentOriginalPrice(variant.originalPrice);
                } else if (product.originalPrice && product.price) {
                    const ratio = product.originalPrice / product.price;
                    setCurrentOriginalPrice(parseFloat((variant.price * ratio).toFixed(2)));
                } else {
                    setCurrentOriginalPrice(null);
                }
            }
        }
    };

    const handleVideoSelect = () => {
        setShowingVideo(true);
    };

    return (
        <div className="pb-24 lg:pb-0 font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 pb-16">

                {/* 1. Galeria (Esquerda) */}
                <div className="lg:col-span-4 xl:col-span-5">
                    <ProductGallery
                        images={product.images}
                        video={product.video}
                        currentImage={currentImage}
                        onImageSelect={handleImageSelect}
                        onVideoSelect={handleVideoSelect}
                        showingVideo={showingVideo}
                    />
                </div>

                {/* 2. Informações e Variantes (Meio) */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-10">
                    <ProductVariants
                        variants={product.variants || []}
                        sizes={product.sizes}
                        currentImage={currentImage}
                        selectedSize={selectedSize}
                        onImageSelect={handleImageSelect}
                        onSizeSelect={setSelectedSize}
                    />

                    <ProductInfo product={product} selectedVariantName={selectedVariantName} />
                </div>

                {/* 3. Buy Box (Direita) - Sticky */}
                <div className="lg:col-span-3 xl:col-span-3">
                    <BuyBox
                        price={currentPrice}
                        originalPrice={currentOriginalPrice}
                        onAddToCart={handleAddToCart}
                        disabled={!!product.sizes?.length && !selectedSize}
                    />
                </div>
            </div>

            {/* Seções Inferiores (Reviews e FAQ) */}
            <div className="border-t border-white/10 pt-16 max-w-7xl mx-auto">
                {/* Reviews Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">Avaliações de Clientes</h2>
                    <div className="flex items-center gap-2">
                        <div className="flex text-[#FFA41C]">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={20} fill={i < Math.round(product.rating || 0) ? "currentColor" : "none"} className={i >= Math.round(product.rating || 0) ? "text-[#FFA41C]/30" : ""} />
                            ))}
                        </div>
                        <span className="text-lg font-medium text-white">{product.rating?.toFixed(1)} de 5</span>
                    </div>
                </div>

                {/* Galeria de Clientes */}
                {product.reviewsImages && product.reviewsImages.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-sm font-bold text-white mb-4">Fotos com imagens</h3>
                        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                            {product.reviewsImages.map((img, idx) => (
                                <div key={idx} className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10 cursor-pointer hover:border-primary transition-colors flex-shrink-0">
                                    <Image
                                        src={img}
                                        alt={`Foto de cliente ${idx}`}
                                        fill
                                        className="object-cover"
                                        sizes="128px"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Lista de Reviews */}
                    <div className="md:col-span-2 space-y-8">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b border-white/5 pb-8 last:border-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                        <User size={16} className="text-gray-300" />
                                    </div>
                                    <span className="font-medium text-sm text-white">{review.author}</span>
                                </div>
                                <div className="flex text-[#FFA41C] mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-600" : ""} />
                                    ))}
                                    <span className="text-xs text-gray-400 ml-2 font-medium">Compra Verificada</span>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                                    {review.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* FAQ Lateral */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6">Perguntas Frequentes</h3>
                        <div className="space-y-4">
                            {faq.map((item, index) => (
                                <div key={index}>
                                    <button
                                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                        className="w-full flex justify-between items-start text-left hover:text-primary transition-colors gap-2"
                                    >
                                        <span className="font-medium text-sm text-gray-200 leading-snug">{item.question}</span>
                                        <ChevronDown size={16} className={`text-gray-500 transform transition-transform flex-shrink-0 h-5 w-5 mt-0.5 ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {openFaqIndex === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="text-gray-400 text-sm py-2 pl-0 leading-relaxed">
                                                    {item.answer}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile CTA (Para garantir conversão no mobile) */}
            <div className="fixed bottom-0 inset-x-0 p-3 bg-background/80 backdrop-blur-xl border-t border-white/10 lg:hidden z-50 pb-6 safe-area-pb">
                <div className="flex gap-3 items-center">
                    <div className="flex-1 min-w-0">
                        <p className="text-lg font-bold text-white leading-none truncate">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </p>
                        <p className="text-[10px] text-green-400">Em 12x sem juros</p>
                    </div>
                    <Button
                        size="default"
                        className="flex-[2] bg-[#FFD814] text-black hover:bg-[#F7CA00] font-normal shadow-lg h-12 rounded-full"
                        onClick={handleAddToCart}
                        disabled={!!product.sizes?.length && !selectedSize}
                    >
                        Comprar Agora
                    </Button>
                </div>
            </div>
        </div>
    );
}
