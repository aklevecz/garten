import { mapCenters } from "$lib/constants";
import db from "$lib/db";
import type { Actions } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async () => {
  return { markers: db.getMarkers(db.getActiveHunt().name) };
}) satisfies PageLoad;

export const actions = {
  add: async ({ request }) => {
    const data = await request.formData();
    const name = data.get("name") as string;
    db.addMarker({ name, code: "frog", hunt: db.getActiveHunt().name, position: mapCenters.laColombe });
  },
} satisfies Actions;
