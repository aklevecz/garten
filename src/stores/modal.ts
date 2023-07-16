import type { EggModal } from "$lib/types";
import { writable } from "svelte/store";

export const eggModal: EggModal = writable({
  showModal: false,
  data: {
    title: "EGG",
    found: false,
    finder: "",
  },
});
