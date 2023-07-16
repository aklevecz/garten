import { writable } from "svelte/store";

type UserStore = {
  hunter: string;
};

function createStore() {
  const userStore = writable<UserStore>({ hunter: "" });
  const { subscribe, update } = userStore;

  return {
    subscribe,
    init: (hunter: string) => {
      update((u) => ({ ...u, hunter }));
    },
  };
}

const userStore = createStore();
export default userStore;
