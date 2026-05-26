"use client"
import { create } from 'zustand'

type CartItem = { id: string; title: string; price: number; image: string; quantity: number }

type CartState = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clear: () => void
}

const useCart = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => {
    const exists = state.items.find(i => i.id === item.id)
    if (exists) {
      return { items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i) }
    }
    return { items: [...state.items, item] }
  }),
  updateQuantity: (id, quantity) => set((state) => ({ items: state.items.map(i => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i) })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  clear: () => set({ items: [] })
}))

export default useCart
