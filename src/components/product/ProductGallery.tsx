"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductGalleryProps {
    images: string[];
    video?: string;
    currentImage: string;
    onImageSelect: (img: string) => void;
    onVideoSelect: () => void;
    showingVideo: boolean;
}

export function ProductGallery({
    images,
    video,
    currentImage,
    onImageSelect,
    onVideoSelect,
    showingVideo
}: ProductGalleryProps) {
    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 sticky top-24">
            {/* Thumbnails (Vertical on Desktop, Horizontal on Mobile) */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => onImageSelect(img)}
                        className={`relative w-16 h-16 md:w-14 md:h-14 rounded-lg overflow-hidden border transition-all flex-shrink-0 ${!showingVideo && currentImage === img
                                ? 'border-primary ring-2 ring-primary/20 opacity-100 shadow-md'
                                : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`View ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                        />
                    </button>
                ))}
                {video && (
                    <button
                        onClick={onVideoSelect}
                        className={`relative w-16 h-16 md:w-14 md:h-14 rounded-lg overflow-hidden border transition-all flex-shrink-0 bg-black/50 flex items-center justify-center ${showingVideo
                                ? 'border-primary ring-2 ring-primary/20 opacity-100'
                                : 'border-white/10 opacity-60 hover:opacity-100'
                            }`}
                    >
                        <div className="absolute inset-0 bg-black/40 z-0"></div>
                        <Play className="w-6 h-6 text-white z-10 fill-white" />
                    </button>
                )}
            </div>

            {/* Main Image */}
            <div className="flex-1">
                <motion.div
                    key={showingVideo ? 'video' : currentImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative aspect-[4/5] md:aspect-square w-full rounded-xl overflow-hidden bg-white/5 border border-white/10"
                >
                    {showingVideo && video ? (
                        <video
                            src={video}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <Image
                            src={currentImage}
                            alt="Product Image"
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    )}
                </motion.div>
            </div>
        </div>
    );
}
