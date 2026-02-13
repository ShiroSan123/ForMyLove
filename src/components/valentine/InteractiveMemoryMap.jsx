import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { MapPin, Calendar, X, Heart } from "lucide-react";
import { format } from "date-fns";
import PhotoCarousel from "./PhotoCarousel";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const colorMap = {
  rose: "from-rose-400 to-pink-500",
  amber: "from-amber-400 to-orange-500",
  purple: "from-purple-400 to-pink-500",
  blue: "from-blue-400 to-indigo-500",
  teal: "from-teal-400 to-cyan-500",
  red: "from-rose-400 to-red-500",
};

export default function InteractiveMemoryMap({ memories }) {
  const [selectedMemory, setSelectedMemory] = useState(null);

  // Default center (will be overridden if there are memories)
  const defaultCenter =
    memories.length > 0
      ? [memories[0].latitude, memories[0].longitude]
      : [40.7128, -74.006]; // Default to NYC

  const createCustomIcon = (color) => {
    const colorClass = color || "rose";
    return L.divIcon({
      className: "custom-marker",
      html: `<div class="relative">
        <div class="w-8 h-8 bg-gradient-to-br ${colorMap[colorClass]} rounded-full shadow-lg flex items-center justify-center border-2 border-white transform hover:scale-110 transition-transform cursor-pointer">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  return (
    <div className="relative">
      <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 h-[500px] md:h-[600px] lg:h-[700px]">
        <MapContainer
          center={defaultCenter}
          zoom={memories.length > 1 ? 4 : 12}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          touchZoom={true}
          dragging={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {memories.map((memory) => (
            <Marker
              key={memory.id}
              position={[memory.latitude, memory.longitude]}
              icon={createCustomIcon(memory.icon_color)}
              eventHandlers={{
                click: () => setSelectedMemory(memory),
              }}
            >
              <Popup>
                <div className="text-center p-2">
                  <p className="font-semibold text-rose-800">{memory.title}</p>
                  <p className="text-sm text-rose-600">
                    {memory.location_name}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Memory Detail Modal */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {selectedMemory && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                onClick={() => setSelectedMemory(null)}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-3xl p-8 max-w-md md:max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
                >
                  <button
                    onClick={() => setSelectedMemory(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Photos */}
                  {selectedMemory.photos && selectedMemory.photos.length > 0 && (
                    <div className="mb-6">
                      <PhotoCarousel photos={selectedMemory.photos} />
                    </div>
                  )}

                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorMap[selectedMemory.icon_color]} flex items-center justify-center mb-4 shadow-lg mx-auto`}
                  >
                    <Heart className="w-8 h-8 text-white fill-white" />
                  </div>

                  <h3 className="text-2xl font-medium text-rose-800 mb-2 text-center">
                    {selectedMemory.title}
                  </h3>

                  {selectedMemory.date && (
                    <div className="flex items-center justify-center gap-2 text-rose-500 mb-4">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {format(new Date(selectedMemory.date), "MMMM d, yyyy")}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 text-rose-400 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{selectedMemory.location_name}</span>
                  </div>

                  <p className="text-rose-700/80 leading-relaxed text-center">
                    {selectedMemory.description}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
