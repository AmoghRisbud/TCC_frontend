'use client';

import React, { useState, useRef } from 'react';

interface ImageUploadMultiProps {
  currentImages: string[];
  category: string;
  onImagesChange: (images: string[]) => void;
  label?: string;
  maxFiles?: number;
}

export default function ImageUploadMulti({
  currentImages,
  category,
  onImagesChange,
  label = 'Images',
  maxFiles = 10,
}: ImageUploadMultiProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uniqueId = useRef(
    `image-upload-multi-${category}-${Math.random().toString(36).substring(7)}`
  ).current;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setError(null);

    if (currentImages.length + files.length > maxFiles) {
      setError(`You can upload a maximum of ${maxFiles} images`);
      return;
    }

    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        if (!validTypes.includes(file.type)) {
          throw new Error('Invalid file type detected');
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Each image must be under 5MB');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        uploadedUrls.push(data.url);
      }

      onImagesChange([...currentImages, ...uploadedUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (url: string) => {
    onImagesChange(currentImages.filter(img => img !== url));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Upload Button */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        id={uniqueId}
      />

      <label
        htmlFor={uniqueId}
        className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm cursor-pointer bg-white hover:bg-gray-50 ${
          uploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload Images'}
      </label>

      <p className="text-xs text-gray-500">
        Up to {maxFiles} images · JPEG, PNG, GIF, WebP · Max 5MB each
      </p>

      {/* Preview Grid */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-3">
          {currentImages.map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={img}
                alt=""
                className="w-full h-24 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => removeImage(img)}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
