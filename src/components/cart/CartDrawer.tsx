"use client";

import { useCart } from "@/store/useCart";
import { Button } from "@/components/ui/Button";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function CartDrawer() {
    const { items, isOpen, toggleCart, removeItem, updateQuantity, getCartTotal } = useCart();
    const [mounted, setMounted] = useState(false);
    const totals = mounted ? getCartTotal() : { total: 0, count: 0 };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-card border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                            <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-primary" />
                                Seu Carrinho
                                <span className="text-sm font-normal text-gray-400 ml-2">({totals.count} itens)</span>
                            </h2>
                            <Button variant="ghost" size="icon" onClick={toggleCart}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                                    <ShoppingBag className="w-16 h-16 text-gray-600" />
                                    <p className="text-lg font-medium">Seu carrinho está vazio</p>
                                    <Button variant="outline" onClick={toggleCart}>Começar a Comprar</Button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex gap-4 bg-white/5 p-3 rounded-lg border border-white/5 group"
                                    >
                                        <div className="relative w-20 h-20 bg-black/20 rounded-md overflow-hidden shrink-0">
                                            <Image
                                                src={item.images[0]}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-medium text-sm line-clamp-2 leading-tight">{item.name}</h3>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-500 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-1 bg-black/20 rounded-md p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded transition-colors text-sm"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded transition-colors text-sm"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span className="font-bold text-primary">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-4 border-t border-white/5 bg-background/50 backdrop-blur-sm space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>Subtotal</span>
                                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.total)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-white">
                                        <span>Total</span>
                                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.total)}</span>
                                    </div>
                                    <p className="text-xs text-center text-green-400 bg-green-500/10 py-1 rounded">
                                        Frete Grátis & 10% OFF no PIX
                                    </p>
                                </div>

                                <Link href="/checkout" onClick={toggleCart} className="block">
                                    <Button size="lg" className="w-full text-lg h-12" variant="neon">
                                        Finalizar Compra
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
