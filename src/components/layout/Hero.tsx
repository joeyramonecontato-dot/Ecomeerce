"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

export function Hero() {
    return (
        <section className="relative w-full h-[600px] md:h-[700px] flex items-center overflow-hidden">
            {/* Background Image com Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop"
                    alt="Hero Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-2xl"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <Sparkles size={14} className="text-primary animate-pulse" />
                        <span className="text-xs font-bold text-primary tracking-wide uppercase">Ofertas por Tempo Limitado</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-6">
                        Evolua seu <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">
                            Corpo & Mente
                        </span>
                    </h1>

                    <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-lg">
                        Descubra a melhor seleção de equipamentos e suplementos para levar seu treino ao próximo nível. Qualidade comprovada e resultados reais.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="h-14 px-8 text-base font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                            Comprar Agora <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button variant="outline" size="lg" className="h-14 px-8 text-base font-bold border-white/20 hover:bg-white/5">
                            Ver Catálogo
                        </Button>
                    </div>

                    <div className="mt-12 flex items-center gap-8 text-sm font-medium text-gray-500">
                        <div>
                            <span className="block text-2xl font-bold text-white">15k+</span>
                            Clientes Felizes
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div>
                            <span className="block text-2xl font-bold text-white">4.9</span>
                            Avaliação Média
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
