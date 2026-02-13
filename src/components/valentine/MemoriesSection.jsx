import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Star,
  Sparkles,
  Coffee,
  Music,
  Sunset,
  Camera,
  Gift,
  Map,
  MapPin,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import InteractiveMemoryMap from "./InteractiveMemoryMap";
import AddMemoryForm from "./AddMemoryForm";
import MemoryAdminPanel from "./MemoryAdminPanel";
import { memoryLocationStore } from "@/lib/localMemories";

const memories = [
  {
    icon: Heart,
    title: "13 декабря 2024",
    description:
      "День, когда всё началось. Тогда я ещё не понимал, что ты станешь самым важным человеком в моей жизни.",
    color: "from-rose-400 to-pink-500",
  },
  {
    icon: Coffee,
    title: "Каре и ожидание",
    description:
      "«Ты в каре?» — «Скоро буду». Автобусы, дорога, пост ГАИ, и это чувство, что меня ждут.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Sunset,
    title: "Ночные «люблю тебя»",
    description:
      "00:30. «Люблю тебя». «И я люблю тебя». И поцелуй в ответ. Самые тёплые моменты — когда весь мир спит.",
    color: "from-purple-400 to-pink-500",
  },
  {
    icon: Music,
    title: "Наш ритм",
    description:
      "Голосовые, смех, случайные фразы и даже тишина — всё звучит по-особенному, когда это ты.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: Camera,
    title: "Фото и видео",
    description:
      "Случайные кадры, кружочки, моменты без фильтров — живые доказательства того, что мы настоящие.",
    color: "from-teal-400 to-cyan-500",
  },
  {
    icon: Gift,
    title: "Мелочи, которые значат всё",
    description:
      "Сердца, поцелуи, «я тебя жду», «доехал?», «покушала?» — простые слова, за которыми стоит настоящее чувство.",
    color: "from-rose-400 to-red-500",
  },
];

export default function MemoriesSection() {
  const queryClient = useQueryClient();

  const { data: memoryLocations = [] } = useQuery({
    queryKey: ["memoryLocations"],
    queryFn: () => memoryLocationStore.list("-created_date"),
    initialData: [],
  });

  const handleMemoryAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["memoryLocations"] });
  };

  return (
    <section className="py-20 px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-amber-400" />
          <h2 className="text-3xl md:text-5xl font-light text-rose-800 tracking-tight">
            Our Memories
          </h2>
          <Sparkles className="w-6 h-6 text-amber-400" />
        </div>
        <p className="text-rose-500/80 font-light max-w-md mx-auto">
          Every moment with you becomes a cherished memory
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {memories.map((memory, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg shadow-rose-200/30 border border-rose-100/50 h-full hover:shadow-xl hover:shadow-rose-200/40 transition-shadow">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${memory.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}
              >
                <memory.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-medium text-rose-800 mb-2">
                {memory.title}
              </h3>

              <p className="text-rose-600/70 font-light leading-relaxed">
                {memory.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Interactive Memory Map */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-20"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Map className="w-6 h-6 text-rose-500" />
            <h2 className="text-3xl md:text-4xl font-light text-rose-800 tracking-tight">
              Our Journey Together
            </h2>
            <Map className="w-6 h-6 text-rose-500" />
          </div>
          <p className="text-rose-500/80 font-light max-w-md mx-auto mb-6">
            Special places that hold our precious memories
          </p>
          <AddMemoryForm onMemoryAdded={handleMemoryAdded} />
        </div>

        {memoryLocations.length > 0 ? (
          <div className="max-w-5xl mx-auto">
            <InteractiveMemoryMap memories={memoryLocations} />
          </div>
        ) : (
          <div className="text-center py-12 text-rose-400">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Add your first memory location to see it on the map!</p>
          </div>
        )}

        <MemoryAdminPanel
          memories={memoryLocations}
          onChanged={handleMemoryAdded}
        />
      </motion.div>

      {/* Love Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-20 text-center"
      >
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 max-w-2xl mx-auto border border-rose-100/50 shadow-lg">
          <Star className="w-8 h-8 text-amber-400 mx-auto mb-6" />
          <blockquote className="text-xl md:text-2xl font-light text-rose-700 italic leading-relaxed">
            "In a sea of people, my eyes will always search for you."
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-rose-300" />
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <div className="w-8 h-px bg-rose-300" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
