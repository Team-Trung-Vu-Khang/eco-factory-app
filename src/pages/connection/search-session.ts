/**
 * Keeps the search form + last results query for this tab, so going to a
 * factory detail page and back doesn't wipe what the user entered.
 */
export const searchSession = {
  read<T>(key: string): T | undefined {
    try {
      const raw = sessionStorage.getItem(`connection-search:${key}`);
      return raw ? (JSON.parse(raw) as T) : undefined;
    } catch {
      return undefined;
    }
  },
  write(key: string, value: unknown) {
    try {
      if (value === undefined) sessionStorage.removeItem(`connection-search:${key}`);
      else sessionStorage.setItem(`connection-search:${key}`, JSON.stringify(value));
    } catch {
      // storage unavailable — just don't persist
    }
  },
};
