"use client";

import { Button } from '@/components/ui/Button';
import { ShoppingCart, ShieldCheck, Truck, Lock } from 'lucide-react';

interface BuyBoxProps {
    price: number;
    originalPrice?: number | null;
    onAddToCart: () => void;
    disabled?: boolean;
}

export function BuyBox({ price, originalPrice, onAddToCart, disabled }: BuyBoxProps) {
    return (
        <div className="bg-card border border-white/10 rounded-xl p-6 shadow-2xl sticky top-24">
            <div className="mb-4">
                <span className="text-3xl font-bold text-white block">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
                </span>
                {originalPrice && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500 line-through">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(originalPrice)}
                        </span>
                        <span className="text-red-400 font-medium">
                            -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
                        </span>
                    </div>
                )}
            </div>

            <div className="space-y-3 mb-6">
                <div className="text-sm text-gray-300">
                    Entrega GRÁTIS: <span className="font-bold text-white">Segunda-feira, 3 de Mar</span>
                </div>
                <div className="text-sm text-gray-300">
                    Enviar para: <span className="text-primary hover:underline cursor-pointer">São Paulo</span>
                </div>
                <div className="text-lg font-bold text-green-500">
                    Em Estoque
                </div>
            </div>

            <div className="space-y-3">
                <Button
                    size="lg"
                    className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black font-normal rounded-full shadow-sm"
                    onClick={onAddToCart}
                    disabled={disabled}
                >
                    Adicionar ao Carrinho
                </Button>
                <Button
                    size="lg"
                    className="w-full bg-[#FFA41C] hover:bg-[#FA8900] text-black font-normal rounded-full shadow-sm"
                    onClick={onAddToCart}
                    disabled={disabled}
                >
                    Comprar Agora
                </Button>
            </div>

            <div className="mt-6 space-y-2 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                    <Lock size={12} />
                    <span>Transação Segura</span>
                </div>
                <div className="grid grid-cols-[1fr_2fr] gap-x-2">
                    <span>Enviado por</span>
                    <span className="text-white">Amazon.com.br</span>
                    <span>Vendido por</span>
                    <span className="text-white">Impulso & Hype</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-blue-400 cursor-pointer hover:underline">
                <ShieldCheck size={14} />
                <span>Política de Devolução</span>
            </div>
        </div>
    );
}
