"use client"
import useCart from '../store/useCart'
import { Product } from '../types/product'

export default function AddToCartButton({ product }: { product: Product }){
  const { addItem } = useCart()
  return (
    <div className="mt-6">
      <button onClick={() => addItem({ id: product.id, title: product.title, price: product.price, image: product.images[0], quantity: 1 })} className="px-4 py-2 bg-terracotta text-white rounded">Add to cart</button>
    </div>
  )
}
