import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, MapPin, X, Image, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { memoryLocationStore } from "@/lib/localMemories";

export default function AddMemoryForm({ onMemoryAdded }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location_name: "",
    latitude: "",
    longitude: "",
    icon_color: "rose",
    photos: [],
  });
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const toDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read photo"));
      reader.readAsDataURL(file);
    });

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingPhotos(true);
    try {
      const photoUrls = await Promise.all(files.map((file) => toDataUrl(file)));

      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...photoUrls],
      }));
      toast.success(`${files.length} photo(s) uploaded`);
    } catch (error) {
      toast.error("Failed to upload photos");
    } finally {
      setUploadingPhotos(false);
    }
  };

  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const memory = await memoryLocationStore.create({
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      });

      toast.success("Memory added successfully!");
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        date: "",
        location_name: "",
        latitude: "",
        longitude: "",
        icon_color: "rose",
        photos: [],
      });

      if (onMemoryAdded) onMemoryAdded(memory);
    } catch (error) {
      toast.error("Failed to add memory");
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <motion.button
        onClick={() => setShowForm(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-4 md:px-10 md:py-5 mx-auto bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full shadow-lg flex items-center gap-2 md:gap-3 font-medium text-base md:text-lg hover:shadow-xl transition-shadow"
      >
        <Plus className="w-5 h-5" />
        Add Memory Location
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border border-rose-100 max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-medium text-rose-800">Add New Memory</h3>
        <button
          onClick={() => setShowForm(false)}
          className="p-2 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Memory Title</Label>
          <Input
            id="title"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Our first date"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="The most wonderful evening..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="color">Color</Label>
            <Select
              value={formData.icon_color}
              onValueChange={(value) =>
                setFormData({ ...formData, icon_color: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rose">Rose</SelectItem>
                <SelectItem value="amber">Amber</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="teal">Teal</SelectItem>
                <SelectItem value="red">Red</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="location_name">Location Name</Label>
          <Input
            id="location_name"
            required
            value={formData.location_name}
            onChange={(e) =>
              setFormData({ ...formData, location_name: e.target.value })
            }
            placeholder="Central Park, NYC"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              required
              value={formData.latitude}
              onChange={(e) =>
                setFormData({ ...formData, latitude: e.target.value })
              }
              placeholder="40.7829"
            />
          </div>

          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              required
              value={formData.longitude}
              onChange={(e) =>
                setFormData({ ...formData, longitude: e.target.value })
              }
              placeholder="-73.9654"
            />
          </div>
        </div>

        <p className="text-xs text-rose-500">
          <MapPin className="w-3 h-3 inline mr-1" />
          Tip: Use Google Maps to find coordinates. Right-click on a location
          and select the coordinates.
        </p>

        {/* Photo Upload */}
        <div>
          <Label htmlFor="photos">Photos</Label>
          <div className="mt-2">
            <label
              htmlFor="photo-upload"
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-rose-300 rounded-lg cursor-pointer hover:border-rose-400 hover:bg-rose-50/50 transition-colors"
            >
              {uploadingPhotos ? (
                <>
                  <Loader2 className="w-5 h-5 text-rose-400 animate-spin" />
                  <span className="text-rose-600">Uploading...</span>
                </>
              ) : (
                <>
                  <Image className="w-5 h-5 text-rose-400" />
                  <span className="text-rose-600">Add Photos</span>
                </>
              )}
            </label>
            <input
              id="photo-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploadingPhotos}
              className="hidden"
            />
          </div>

          {/* Photo Preview */}
          {formData.photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {formData.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-lg overflow-hidden"
                >
                  <img
                    src={photo}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowForm(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600"
          >
            {loading ? "Adding..." : "Add Memory"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
