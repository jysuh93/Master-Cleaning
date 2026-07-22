import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowLeftRight } from 'lucide-react';

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const onMouseUp = () => handleMouseUp();
    const onTouchMove = (e: TouchEvent) => handleTouchMove(e);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, []);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDragging.current = true;
  };

  // High-quality image representing a premium modern living space
  const imageUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  return (
    <div id="before-after-section" className="py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Before & After Comparison
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          눈으로 확인하는 마스터 클리닝의 차이
        </h2>
        <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
          보이지 않는 구석진 곳의 미세먼지부터 주방의 찌든 때까지, 
          손길이 닿는 모든 곳이 완벽해집니다. 마우스나 터치로 좌우 슬라이드를 움직여보세요!
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Interactive Slider Container */}
        <div 
          id="slider-container"
          ref={containerRef}
          className="relative h-[450px] rounded-2xl overflow-hidden shadow-xl select-none cursor-ew-resize border border-slate-200"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          {/* AFTER IMAGE (Background - Bright, clean, premium) */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={imageUrl} 
              alt="Clean After Master Cleaning" 
              className="absolute inset-0 w-full h-full object-cover"
              draggable="false"
            />
            {/* After Tag */}
            <div className="absolute right-6 bottom-6 bg-blue-600 text-white font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded shadow-md z-10">
              After (청소 후)
            </div>
          </div>

          {/* BEFORE IMAGE (Overlay - Dark, dusty, grayer via CSS filters) */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img 
              src={imageUrl} 
              alt="Dirty Before Cleaning" 
              className="absolute inset-0 h-full object-cover filter brightness-[0.65] contrast-[1.1] sepia-[0.3] saturate-[0.7] grayscale-[0.4] blur-[1px]"
              style={{ width: containerRef.current?.offsetWidth || '100vw', maxWidth: 'none' }}
              draggable="false"
            />
            {/* Before Tag */}
            <div className="absolute left-6 bottom-6 bg-slate-800 text-white font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded shadow-md z-10 whitespace-nowrap">
              Before (청소 전)
            </div>
          </div>

          {/* Divider Line */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Handle Button */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-50 active:scale-95 transition-transform z-30">
              <ArrowLeftRight className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
