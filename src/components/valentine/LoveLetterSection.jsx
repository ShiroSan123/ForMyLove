import React from "react";
import { motion } from "framer-motion";
import { X, Heart, PenLine } from "lucide-react";

export default function LoveLetterSection({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.8, opacity: 0, rotateX: -20 }}
        transition={{ type: "spring", duration: 0.6 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 md:p-12 lg:p-16 max-w-lg md:max-w-2xl w-full shadow-2xl relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-rose-200/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-200/30 rounded-full translate-x-1/2 translate-y-1/2" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 text-rose-400 hover:text-rose-600 hover:bg-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <PenLine className="w-5 h-5 text-rose-400" />
            <h2 className="text-2xl md:text-3xl font-light text-rose-800 tracking-wide">
              Письмо моей навеки
            </h2>
          </div>

          <div className="space-y-4 md:space-y-6 text-rose-700/90 font-light leading-relaxed text-center md:text-left text-base text-base">
            <p className="text-lg italic">Солнышко,</p>

            <p>
              С 13 декабря 2024 года моя жизнь стала совсем другой. Я тогда ещё
              не понимал, насколько сильно ты изменишь меня и всё вокруг, но
              сейчас понимаю — это лучшее, что со мной случалось
            </p>

            <p>
              Я много раз говорил тебе, что люблю тебя. И буду говорить ещё.
              Потому что это не просто слова для меня. Это то, что я чувствую
              каждый день — когда просыпаюсь, когда еду куда-то, когда занят,
              когда уставший, когда счастлив. Ты постоянно у меня в мыслях
            </p>

            <p>
              С тобой даже обычные моменты становятся особенными. Даже если это
              просто переписка ночью, короткое “люблю тебя”, поцелуй или сердце
              — для меня это всегда по-настоящему
            </p>

            <p>
              Я люблю тебя такой, какая ты есть. Со всем твоим настроением,
              характером, смехом, переживаниями. Мне не хочется никого другого и
              ничего другого — просто быть рядом с тобой
            </p>

            <p>
              Спасибо тебе за тепло, за нежность, за то, что ты есть в моей
              жизни. Я правда хочу пройти с тобой ещё очень много — радостей,
              приключений, обычных дней, всего
            </p>

            <p className="text-lg pt-4">
              Я люблю тебя. Очень сильно. И буду любить дальше
              <br />
              <span className="italic">Твой Ренат</span>
            </p>
          </div>

          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center mt-8"
          >
            <Heart className="w-12 h-12 text-rose-500 fill-rose-500" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
