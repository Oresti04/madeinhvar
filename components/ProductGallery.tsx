"use client"

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const selectedImage = images[selected] ?? images[0]

  const closeLightbox = useCallback(() => setLightbox(false), [])

  const prev = useCallback(() => setSelected(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setSelected(i => (i + 1) % images.length), [images.length])

  useEffect(() => {
    if (!lightbox) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, closeLightbox, prev, next])

  if (!selectedImage) {
    return <div className="rounded-2xl overflow-hidden bg-stone h-96" />
  }

  return (
    <>
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="relative w-full rounded-2xl overflow-hidden bg-stone h-96 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta group"
          aria-label="View fullscreen"
        >
          <Image
            src={selectedImage}
            alt={`${title} – image ${selected + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <span className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm">
            View fullscreen
          </span>
        </button>

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelected(index)}
                className={`relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                  selected === index ? 'border-terracotta' : 'border-stone hover:border-terracotta/50'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image src={image} alt={`${title} thumbnail ${index + 1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none p-2 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-4 text-white/70 hover:text-white text-4xl leading-none p-2 transition-colors select-none"
              aria-label="Previous image"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-4xl max-h-[85vh] w-full mx-16"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt={`${title} – image ${selected + 1}`}
              width={1200}
              height={900}
              className="object-contain w-full h-full max-h-[85vh] rounded-xl"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            {images.length > 1 && (
              <p className="text-center text-white/40 text-sm mt-3">{selected + 1} / {images.length}</p>
            )}
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-4 text-white/70 hover:text-white text-4xl leading-none p-2 transition-colors select-none"
              aria-label="Next image"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  )
}
