import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Product } from '@/types/product';

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    getCartTotal: () => { total: number; count: number };
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            addItem: (product) => {
                const items = get().items;
                const existingItem = items.find((item) => item.id === product.id);

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                        isOpen: true,
                    });
                } else {
                    set({ items: [...items, { ...product, quantity: 1 }], isOpen: true });
                }
            },
            removeItem: (productId) => {
                set({ items: get().items.filter((item) => item.id !== productId) });
            },
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                } else {
                    set({
                        items: get().items.map((item) =>
                            item.id === productId ? { ...item, quantity } : item
                        ),
                    });
                }
            },
            clearCart: () => set({ items: [] }),
            toggleCart: () => set({ isOpen: !get().isOpen }),
            getCartTotal: () => {
                const items = get().items;
                const total = items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );
                const count = items.reduce((sum, item) => sum + item.quantity, 0);
                return { total, count };
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
