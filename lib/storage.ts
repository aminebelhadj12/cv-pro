export type StorageFailure = "unavailable" | "quota" | "error";
export type StorageResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: StorageFailure };

let cached: Storage | null | undefined;

/** Returns localStorage, or null when it is blocked or disabled (private mode, policies...). */
function getStorage(): Storage | null {
  if (cached !== undefined) return cached;
  try {
    const storage = window.localStorage;
    const probe = "__cvpro_probe__";
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    cached = storage;
  } catch {
    cached = null;
  }
  return cached;
}

function isQuotaError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "QuotaExceededError" ||
      error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
      error.code === 22 ||
      error.code === 1014)
  );
}

export function storageGet(key: string): StorageResult<string | null> {
  const storage = getStorage();
  if (!storage) return { ok: false, reason: "unavailable" };
  try {
    return { ok: true, value: storage.getItem(key) };
  } catch {
    return { ok: false, reason: "error" };
  }
}

export function storageSet(key: string, value: string): StorageResult<true> {
  const storage = getStorage();
  if (!storage) return { ok: false, reason: "unavailable" };
  try {
    storage.setItem(key, value);
    return { ok: true, value: true };
  } catch (error) {
    return { ok: false, reason: isQuotaError(error) ? "quota" : "error" };
  }
}

export function storageRemove(key: string): StorageResult<true> {
  const storage = getStorage();
  if (!storage) return { ok: false, reason: "unavailable" };
  try {
    storage.removeItem(key);
    return { ok: true, value: true };
  } catch {
    return { ok: false, reason: "error" };
  }
}
