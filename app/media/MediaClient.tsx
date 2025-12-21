"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import SectionHeading from "../components/SectionHeading";

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image: string | string[];
}

export default function MediaClient({ items }: { items: GalleryItem[] }) {
  const [activeImages, setActiveImages] = useState<string[] | null>(null);

  // Close modal on ESC
  useEffect(() => {
    const esc = (e: KeyboardEvent) =>
      e.key === "Escape" && setActiveImages(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="section bg-brand-hero text-white">
        <div className="container text-center">
          <h1 className="h1 mb-6">In Pictures</h1>
          <p className="text-xl text-white/80">
            Explore moments from our events, workshops, and community gatherings.
          </p>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section bg-brand-light">
        <div className="container">
          <SectionHeading
            title="Our Gallery"
            subtitle="A glimpse into our journey and activities"
          />

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
            {items.map((i) => {
              const images = Array.isArray(i.image) ? i.image : [i.image];

              return (
                <div
                  key={i.id}
                  className="card group cursor-pointer"
                  onClick={() => setActiveImages(images)}
                  onMouseEnter={() => {
                    images.forEach((src) => {
                      const img = new window.Image();
                      img.src = src;
                    });
                  }}
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100">
                    <Image
                      src={images[0]}
                      alt={i.title}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                    />

                    {images.length > 1 && (
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        +{images.length - 1}
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-brand-dark">
                    {i.title}
                  </h3>

                  {i.description && (
                    <p className="text-sm text-brand-muted">
                      {i.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MODAL VIEWER */}
      {activeImages && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setActiveImages(null)}
            className="absolute top-5 right-6 text-white text-3xl"
          >
            ✕
          </button>

          <div className="max-w-6xl w-full px-4 max-h-[90vh] overflow-y-auto">
            <div className="space-y-8">
              {activeImages.map((img, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center bg-black"
                >
                  <Image
                    src={img}
                    alt=""
                    width={1400}
                    height={900}
                    priority={idx === 0}
                    className="max-h-[80vh] w-auto object-contain rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
