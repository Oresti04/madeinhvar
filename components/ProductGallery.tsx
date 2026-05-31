"use client"

import { useState } from 'react'
import Image from 'next/image'

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState(0)
  const selectedImage = images[selected] ?? images[0]

  if (!selectedImage) {
    return <div className="rounded overflow-hidden bg-stone h-96" />
  }

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="relative rounded overflow-hidden bg-stone h-96">
        <Image
          src={selectedImage}
          alt={`${title} – image ${selected + 1}`}
          fill
          className="object-cover transition-opacity duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelected(index)}
              className={`relative h-20 w-20 flex-shrink-0 rounded overflow-hidden border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-terracotta ${
                selected === index ? 'border-terracotta' : 'border-stone'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
