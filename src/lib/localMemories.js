import bundledMemories from "@/data/memories.json";

const MEMORY_STORAGE_KEY = "for_my_love_memory_locations";
const MEMORY_SEED_VERSION_KEY = "for_my_love_memory_seed_version";

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

const getBundledSeedVersion = () => JSON.stringify(bundledMemories || []);

const normalizeMemory = (item, index = 0) => {
  const now = new Date().toISOString();
  const latitude = toNumber(item?.latitude);
  const longitude = toNumber(item?.longitude);

  return {
    id: item?.id || `seed-${index}-${Date.now()}`,
    created_date: item?.created_date || now,
    updated_date: item?.updated_date || item?.created_date || now,
    title: item?.title || "",
    description: item?.description || "",
    date: item?.date || "",
    location_name: item?.location_name || "",
    latitude: latitude ?? 0,
    longitude: longitude ?? 0,
    icon_color: item?.icon_color || "rose",
    photos: Array.isArray(item?.photos) ? item.photos : [],
  };
};

const getBundledMemories = () =>
  (Array.isArray(bundledMemories) ? bundledMemories : []).map((item, index) =>
    normalizeMemory(item, index),
  );

const ensureInitialized = () => {
  const storage = getStorage();
  if (!storage) return [];

  const seeded = getBundledMemories();
  const currentSeedVersion = getBundledSeedVersion();
  const storedSeedVersion = storage.getItem(MEMORY_SEED_VERSION_KEY);

  // If memories.json changed, force local data to match it.
  if (seeded.length > 0 && storedSeedVersion !== currentSeedVersion) {
    writeAll(seeded);
    storage.setItem(MEMORY_SEED_VERSION_KEY, currentSeedVersion);
    return seeded;
  }

  const existing = readAll();
  if (existing.length > 0) return existing;

  if (seeded.length > 0) {
    writeAll(seeded);
    storage.setItem(MEMORY_SEED_VERSION_KEY, currentSeedVersion);
    return seeded;
  }

  return [];
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
    const items = ensureInitialized();
    if (orderBy === "-created_date") {
      return sortByCreatedDateDesc(items);
    }
    return items;
  },

  async create(payload) {
    const baseItems = ensureInitialized();
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

    const items = [...baseItems];
    items.push(item);
    writeAll(items);
    return item;
  },

  async update(id, payload) {
    const items = ensureInitialized();
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
    const items = ensureInitialized();
    const next = items.filter((item) => item.id !== id);
    writeAll(next);
    return { success: true };
  },

  async clear() {
    writeAll([]);
    return { success: true };
  },

  async exportForDeploy() {
    const items = await this.list("-created_date");
    return items.map((item) => ({
      id: item.id,
      created_date: item.created_date,
      updated_date: item.updated_date,
      title: item.title || "",
      description: item.description || "",
      date: item.date || "",
      location_name: item.location_name || "",
      latitude: Number(item.latitude),
      longitude: Number(item.longitude),
      icon_color: item.icon_color || "rose",
      photos: Array.isArray(item.photos) ? item.photos : [],
    }));
  },
};
