export function createAuthRevision(
  key: string,
  getStorage: () => Pick<Storage, "getItem" | "setItem">,
) {
  let localRevision = "";
  let storageAvailable = true;

  return {
    getRevision: () => {
      if (storageAvailable) {
        try {
          localRevision = getStorage().getItem(key) ?? localRevision;
        } catch {
          // Preserve the last known revision if browser storage becomes unavailable.
          storageAvailable = false;
        }
      }
      return localRevision;
    },
    advanceRevision: (revision: string) => {
      localRevision = revision;
      if (storageAvailable) {
        try {
          getStorage().setItem(key, revision);
        } catch {
          // An older stored value must never override this tab's newer revision.
          storageAvailable = false;
        }
      }
    },
  };
}
