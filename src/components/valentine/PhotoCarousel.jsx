import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function PhotoCarousel({ photos }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenPhoto, setFullscreenPhoto] = useState(null);

  if (!photos || photos.length === 0) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="relative w-full">
        {/* Main Photo */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-rose-50">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={photos[currentIndex]}
              alt={`Memory photo ${currentIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setFullscreenPhoto(photos[currentIndex])}
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-rose-600 hover:bg-white shadow-lg transition-all hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-rose-600 hover:bg-white shadow-lg transition-all hover:scale-110"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Counter */}
          {photos.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-sm">
              {currentIndex + 1} / {photos.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-rose-500 scale-105"
                    : "border-rose-200 opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={photo}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {fullscreenPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setFullscreenPhoto(null)}
          >
            <button
              onClick={() => setFullscreenPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={fullscreenPhoto}
              alt="Fullscreen photo"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
