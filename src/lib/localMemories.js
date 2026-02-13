const MEMORY_STORAGE_KEY = "for_my_love_memory_locations";

const getStorage = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage;
};

const readAll = () => {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(MEMORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeAll = (items) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(items));
};

const sortByCreatedDateDesc = (items) =>
  [...items].sort((a, b) => {
    const aDate = new Date(a.created_date || 0).getTime();
    const bDate = new Date(b.created_date || 0).getTime();
    return bDate - aDate;
  });

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const memoryLocationStore = {
  storageKey: MEMORY_STORAGE_KEY,

  async list(orderBy) {
    const items = readAll();
    if (orderBy === "-created_date") {
      return sortByCreatedDateDesc(items);
    }
    return items;
  },

  async create(payload) {
    const now = new Date().toISOString();
    const latitude = toNumber(payload.latitude);
    const longitude = toNumber(payload.longitude);

    if (latitude === null || longitude === null) {
      throw new Error("Latitude and longitude must be valid numbers");
    }

    const item = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
      created_date: now,
      updated_date: now,
      title: payload.title || "",
      description: payload.description || "",
      date: payload.date || "",
      location_name: payload.location_name || "",
      latitude,
      longitude,
      icon_color: payload.icon_color || "rose",
      photos: Array.isArray(payload.photos) ? payload.photos : [],
    };

    const items = readAll();
    items.push(item);
    writeAll(items);
    return item;
  },

  async update(id, payload) {
    const items = readAll();
    const itemIndex = items.findIndex((item) => item.id === id);
    if (itemIndex < 0) {
      throw new Error("Memory not found");
    }

    const existing = items[itemIndex];
    const latitude =
      payload.latitude !== undefined ? toNumber(payload.latitude) : existing.latitude;
    const longitude =
      payload.longitude !== undefined
        ? toNumber(payload.longitude)
        : existing.longitude;

    if (latitude === null || longitude === null) {
      throw new Error("Latitude and longitude must be valid numbers");
    }

    const updated = {
      ...existing,
      ...payload,
      latitude,
      longitude,
      updated_date: new Date().toISOString(),
    };

    items[itemIndex] = updated;
    writeAll(items);
    return updated;
  },

  async remove(id) {
    const items = readAll();
    const next = items.filter((item) => item.id !== id);
    writeAll(next);
    return { success: true };
  },

  async clear() {
    writeAll([]);
    return { success: true };
  },
};
