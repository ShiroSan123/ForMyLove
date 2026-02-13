import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, Pencil, Trash2, Save, X, Download } from "lucide-react";
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
import { memoryLocationStore } from "@/lib/localMemories";
import { toast } from "sonner";

const emptyDraft = {
  title: "",
  description: "",
  date: "",
  location_name: "",
  latitude: "",
  longitude: "",
  icon_color: "rose",
};

export default function MemoryAdminPanel({ memories, onChanged }) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [saving, setSaving] = useState(false);

  const beginEdit = (memory) => {
    setEditingId(memory.id);
    setDraft({
      title: memory.title || "",
      description: memory.description || "",
      date: memory.date || "",
      location_name: memory.location_name || "",
      latitude: String(memory.latitude ?? ""),
      longitude: String(memory.longitude ?? ""),
      icon_color: memory.icon_color || "rose",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(emptyDraft);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await memoryLocationStore.update(editingId, {
        ...draft,
        latitude: parseFloat(draft.latitude),
        longitude: parseFloat(draft.longitude),
      });
      toast.success("Memory updated");
      cancelEdit();
      onChanged?.();
    } catch (error) {
      toast.error(error?.message || "Failed to update memory");
    } finally {
      setSaving(false);
    }
  };

  const removeMemory = async (id) => {
    if (!window.confirm("Delete this memory?")) return;
    try {
      await memoryLocationStore.remove(id);
      toast.success("Memory deleted");
      if (editingId === id) cancelEdit();
      onChanged?.();
    } catch {
      toast.error("Failed to delete memory");
    }
  };

  const clearAllMemories = async () => {
    if (!window.confirm("Delete all memories from local storage?")) return;
    try {
      await memoryLocationStore.clear();
      toast.success("All memories removed");
      cancelEdit();
      onChanged?.();
    } catch {
      toast.error("Failed to clear memories");
    }
  };

  const exportForDeploy = async () => {
    try {
      const items = await memoryLocationStore.exportForDeploy();
      const blob = new Blob([JSON.stringify(items, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "memories.json";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      toast.success("Exported memories.json for deploy");
    } catch {
      toast.error("Failed to export memories");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen((prev) => !prev)}
        className="border-rose-200 text-rose-700 hover:bg-rose-50"
      >
        <Settings2 className="w-4 h-4 mr-2" />
        {open ? "Hide Admin Panel" : "Open Admin Panel"}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 bg-white/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-rose-100 shadow-lg"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <p className="text-sm text-rose-700">
                Memories in local storage: <strong>{memories.length}</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={exportForDeploy}
                  disabled={memories.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export for Deploy
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={clearAllMemories}
                  disabled={memories.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
            <p className="text-xs text-rose-500 mb-4">
              Deploy flow: export and replace{" "}
              <code className="font-mono">src/data/memories.json</code> with the
              downloaded file, then redeploy.
            </p>

            {memories.length === 0 && (
              <p className="text-sm text-rose-500">No memories yet.</p>
            )}

            <div className="space-y-4">
              {memories.map((memory) => {
                const isEditing = editingId === memory.id;
                return (
                  <div
                    key={memory.id}
                    className="rounded-xl border border-rose-100 bg-white/80 p-4"
                  >
                    {!isEditing ? (
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-rose-800">
                            {memory.title || "Untitled"}
                          </p>
                          <p className="text-xs text-rose-500">
                            {memory.location_name || "No location"} |{" "}
                            {memory.latitude}, {memory.longitude}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => beginEdit(memory)}
                          >
                            <Pencil className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeMemory(memory.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={draft.title}
                            onChange={(e) =>
                              setDraft({ ...draft, title: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={draft.description}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                description: e.target.value,
                              })
                            }
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Date</Label>
                            <Input
                              type="date"
                              value={draft.date}
                              onChange={(e) =>
                                setDraft({ ...draft, date: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label>Color</Label>
                            <Select
                              value={draft.icon_color}
                              onValueChange={(value) =>
                                setDraft({ ...draft, icon_color: value })
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
                          <Label>Location Name</Label>
                          <Input
                            value={draft.location_name}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                location_name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Latitude</Label>
                            <Input
                              value={draft.latitude}
                              onChange={(e) =>
                                setDraft({
                                  ...draft,
                                  latitude: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label>Longitude</Label>
                            <Input
                              value={draft.longitude}
                              onChange={(e) =>
                                setDraft({
                                  ...draft,
                                  longitude: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={saveEdit}
                            disabled={saving}
                            className="bg-rose-500 hover:bg-rose-600"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={cancelEdit}
                            disabled={saving}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
