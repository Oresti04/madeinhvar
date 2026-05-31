"use client"
import { useState } from 'react'
import useCart from '../store/useCart'
import { Product } from '../types/product'

export default function AddToCartButton({ product }: { product: Product }){
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAdd = () => {
    addItem({ id: product.id, title: product.title, price: product.price, image: product.images[0], quantity: 1 })
    setIsAdded(true)
    window.setTimeout(() => setIsAdded(false), 900)
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleAdd}
        className={`btn btn-primary ${isAdded ? 'btn-pop' : ''}`}
      >
        <span className="min-w-[140px] text-center">
          {isAdded ? 'Added to cart' : 'Add to cart'}
        </span>
      </button>
    </div>
  )
}
