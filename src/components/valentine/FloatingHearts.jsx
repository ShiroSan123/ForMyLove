import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function FloatingHearts() {
  const hearts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
    size: 12 + Math.random() * 24,
    opacity: 0.1 + Math.random() * 0.3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{
            x: `${heart.x}vw`,
            y: "110vh",
            rotate: 0,
          }}
          animate={{
            y: "-10vh",
            rotate: [0, 15, -15, 0],
            x: [
              `${heart.x}vw`,
              `${heart.x + (Math.random() * 10 - 5)}vw`,
              `${heart.x}vw`,
            ],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ opacity: heart.opacity }}
          className="absolute"
        >
          <Heart
            style={{ width: heart.size, height: heart.size }}
            className="text-rose-400 fill-rose-300"
          />
        </motion.div>
      ))}
    </div>
  );
}
