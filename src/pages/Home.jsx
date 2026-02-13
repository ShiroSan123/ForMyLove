import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Calendar, MessageCircleHeart } from "lucide-react";
import LoveCounter from "@/components/valentine/LoveCounter";
import FloatingHearts from "@/components/valentine/FloatingHearts";
import LoveLetterSection from "@/components/valentine/LoveLetterSection";
import MemoriesSection from "@/components/valentine/MemoriesSection";

export default function Home() {
  const [showLetter, setShowLetter] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 overflow-hidden relative">
      <FloatingHearts />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-12 lg:px-16 relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1.5, bounce: 0.4 }}
          className="mb-8"
        >
          <div className="relative">
            <Heart className="w-24 h-24 md:w-40 md:h-40 lg:w-48 lg:h-48 text-rose-500 fill-rose-500" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-amber-400" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-light text-rose-900 text-center mb-6 tracking-tight"
        >
          To My Love
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-xl md:text-2xl lg:text-3xl text-rose-600/80 text-center max-w-2xl font-light italic"
        >
          Every moment with you is a treasure I hold close to my heart
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-12"
        >
          <LoveCounter startDate="2024-12-12" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-16"
        >
          <motion.button
            onClick={() => setShowLetter(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full shadow-lg shadow-rose-300/50 flex items-center gap-3 font-medium tracking-wide hover:shadow-xl hover:shadow-rose-300/60 transition-shadow"
          >
            <MessageCircleHeart className="w-5 h-5" />
            Read My Love Letter
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-rose-300"
          >
            <p className="text-sm tracking-widest uppercase">Scroll for more</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Memories Section */}
      <MemoriesSection />

      {/* Love Letter Modal */}
      <AnimatePresence>
        {showLetter && (
          <LoveLetterSection onClose={() => setShowLetter(false)} />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 text-rose-400"
        >
          <span className="text-sm tracking-wider">Made with</span>
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span className="text-sm tracking-wider">for you</span>
        </motion.div>
      </footer>
    </div>
  );
}
