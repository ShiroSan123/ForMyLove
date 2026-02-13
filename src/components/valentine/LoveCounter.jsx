import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Sparkles } from "lucide-react";

const messageStats = [
  {
    title: "💋 Поцелуи",
    fromYou: 1461,
    fromHer: 355,
  },
  {
    title: "❤️ Сердца",
    fromYou: 2518,
    fromHer: 1071,
  },
  {
    title: "💋 + ❤️ вместе",
    fromYou: 3979,
    fromHer: 1426,
  },
  {
    title: "Я люблю тебя",
    subtitle: "Признания (1 сообщение = 1 признание)",
    fromYou: 444,
    fromHer: 237,
  },
];

function TimeBlock({ value, label, delay, valueWidthClass = "w-[2ch]" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", bounce: 0.4 }}
      className="flex flex-col items-center"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-8 lg:p-10 shadow-lg shadow-rose-200/50 border border-rose-100 w-[90px] md:w-[150px] lg:w-[180px]">
        <motion.span
          key={value}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`text-3xl md:text-6xl lg:text-7xl font-light text-rose-600 block text-center tabular-nums mx-auto ${valueWidthClass}`}
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </div>
      <span className="mt-3 text-xs md:text-base lg:text-lg text-rose-400 uppercase tracking-widest font-medium">
        {label}
      </span>
    </motion.div>
  );
}

export default function LoveCounter({ startDate }) {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(startDate);
      const now = new Date();
      const diff = now - start;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeElapsed({ days, hours, minutes, seconds, totalDays: days });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 mb-6"
      >
        <Calendar className="w-5 h-5 text-rose-400" />
        <p className="text-rose-500 text-sm md:text-base tracking-wide">
          Together since December 12, 2024
        </p>
      </motion.div>

      <div className="flex items-center justify-center gap-3 md:gap-8 lg:gap-12">
        <TimeBlock
          value={timeElapsed.days}
          label="Days"
          delay={0.1}
          valueWidthClass="w-[4ch]"
        />
        <span className="text-3xl text-rose-300 font-light mt-[-20px]">:</span>
        <TimeBlock value={timeElapsed.hours} label="Hours" delay={0.2} />
        <span className="text-3xl text-rose-300 font-light mt-[-20px]">:</span>
        <TimeBlock value={timeElapsed.minutes} label="Minutes" delay={0.3} />
        <span className="text-3xl text-rose-300 font-light mt-[-20px] hidden sm:block">
          :
        </span>
        <div className="hidden sm:block">
          <TimeBlock value={timeElapsed.seconds} label="Seconds" delay={0.4} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-amber-400" />
        <p className="text-rose-600 font-medium">
          {timeElapsed.totalDays} days of love and counting...
        </p>
        <Sparkles className="w-4 h-4 text-amber-400" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-10 max-w-5xl mx-auto"
      >
        <h3 className="text-rose-700 text-lg md:text-xl font-medium mb-4">
          Статистика сообщений
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {messageStats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white/75 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-rose-100 shadow-md"
            >
              <p className="text-rose-800 font-semibold">{stat.title}</p>
              {stat.subtitle && (
                <p className="text-xs text-rose-500 mt-1">{stat.subtitle}</p>
              )}
              <div className="mt-3 space-y-1 text-sm md:text-base">
                <p className="text-rose-700">
                  Я тебе: <span className="font-semibold">{stat.fromYou}</span>
                </p>
                <p className="text-rose-600">
                  Ты мне: <span className="font-semibold">{stat.fromHer}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
