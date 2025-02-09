import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import { Screenshot } from '../model/types';

interface ImageViewerProps {
  images: Screenshot[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev
}) => {
  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors"
      >
        <XIcon size={24} />
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors"
      >
        <ChevronLeftIcon size={24} />
      </button>

      <img
        src={images[currentIndex].image}
        alt={images[currentIndex].title}
        className="max-w-[90vw] max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors"
      >
        <ChevronRightIcon size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800/50 px-4 py-2 rounded-full text-white">
        {images[currentIndex].title} ({currentIndex + 1}/{images.length})
      </div>
    </div>
  );
};