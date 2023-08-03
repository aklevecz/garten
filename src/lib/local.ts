type localStorageKeys = "has-seen-info" | "email" | "address";
const local = () => {
  const get = (key: localStorageKeys) => localStorage.getItem(key);
  const set = (key: localStorageKeys, value: string) => {
    localStorage.setItem(key, value);
  };
  return {
    get,
    set,
    hasSeenInfo: JSON.parse(get("has-seen-info") || "false"),
  };
};

export default local;
