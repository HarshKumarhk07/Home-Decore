"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[350px] sm:h-[450px] rounded-2xl overflow-hidden shadow-2xl select-none cursor-ew-resize"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onTouchEnd={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      {/* Before Image (Background) */}
      <Image
        src={beforeImage}
        alt="Before Work"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 800px"
        priority
      />
      <div className="absolute left-4 bottom-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 text-xs font-semibold rounded-lg">
        {beforeLabel}
      </div>

      {/* After Image (Foreground, clipped based on slider position) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <Image
          src={afterImage}
          alt="After Work"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />
        <div className="absolute right-4 bottom-4 bg-primary/80 backdrop-blur-sm text-white px-3 py-1 text-xs font-semibold rounded-lg border border-accent/20">
          {afterLabel}
        </div>
      </div>

      {/* Slider Bar & Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-accent cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white border-2 border-accent rounded-full flex items-center justify-center shadow-lg pointer-events-none">
          <div className="flex space-x-1 text-accent font-bold text-xs select-none">
            <span>&lsaquo;</span>
            <span>&rsaquo;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
