import type { HuntMarker } from "$lib/types";
import { get, writable } from "svelte/store";

type GameStore = {
  eggsCollected: HuntMarker[];
};

function createStore() {
  const gameStore = writable<GameStore>({ eggsCollected: [] });
  const { subscribe, update } = gameStore;

  return {
    subscribe,
    init: (eggsCollected: HuntMarker[]) => {
      update((g) => ({ ...g, eggsCollected }));
    },
    eggsCollectedCount: get(gameStore).eggsCollected.length,
  };
}

const gameStore = createStore();

export default gameStore;
