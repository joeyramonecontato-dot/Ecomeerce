"use client";

import Link from "next/link";
import { ShoppingCart, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/store/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Header() {
    const { getCartTotal, toggleCart } = useCart();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Evitar hydration mismatch no badge do carrinho
    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const total = mounted ? getCartTotal() : { count: 0 };

    return (
        <header
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-background/80 backdrop-blur-md border-white/10 py-3" : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-8 h-8 flex items-center justify-center bg-primary rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                        <span className="text-xl">🚀</span>
                    </div>
                    <span className="text-2xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:text-primary transition-colors">
                        Impulso<span className="text-primary">&</span>Hype
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {[
                        { label: "Home", href: "/" },
                        { label: "Moda Fit", href: "/shop/apparel" },
                        { label: "Tech", href: "/shop/tech" },
                        { label: "Suplementos", href: "/shop/supplements" },
                        { label: "Musculação", href: "/shop/equipment" },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="hidden md:flex">
                        <Search className="w-5 h-5" />
                    </Button>

                    <Button
                        variant="neon"
                        size="icon"
                        className="relative"
                        onClick={toggleCart}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {total.count > 0 && (
                            <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse">
                                {total.count}
                            </span>
                        )}
                    </Button>

                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
