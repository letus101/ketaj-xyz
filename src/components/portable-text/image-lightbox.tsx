'use client';

import * as React from 'react';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ImageLightboxProps {
  value: {
    image: any;
    caption?: string;
    alt: string;
  };
}

export function ImageLightbox({ value }: ImageLightboxProps) {
  const { image, caption, alt } = value;

  if (!image?.asset) return null;

  const thumbUrl = urlForImage(image).width(800).url();
  const fullUrl = urlForImage(image).width(1920).url();

  return (
    <figure className="my-8">
      <Dialog>
        <DialogTrigger asChild>
          <button className="relative w-full overflow-hidden border border-border hover:border-primary/50 transition-colors cursor-zoom-in">
            <div className="relative aspect-video w-full">
              <Image
                src={thumbUrl}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <span className="text-xs text-white/80 font-mono">Click to enlarge</span>
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-2 bg-black/95 border-border">
          <div className="relative w-full h-[85vh]">
            <Image
              src={fullUrl}
              alt={alt}
              fill
              sizes="95vw"
              className="object-contain"
              priority
            />
          </div>
          {caption && (
            <p className="text-center text-sm text-muted-foreground mt-2">{caption}</p>
          )}
        </DialogContent>
      </Dialog>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
