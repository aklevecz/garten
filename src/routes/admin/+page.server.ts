import db from "$lib/db";
import type { Hunts } from "$lib/types";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const hunt = db.getActiveHunt().name;
  console.log(hunt);
  return { hunt, markers: db.getMarkers(hunt) };
}) satisfies PageServerLoad;

export const actions = {
  add: async ({ request }) => {
    const data = await request.formData();
    const name = data.get("name") as string;
    const code = data.get("code") as string;
    const hunt = data.get("hunt") as Hunts;
    const lat = data.get("lat") as string;
    const lng = data.get("lng") as string;
    db.addMarker({
      name,
      code,
      hunt: hunt,
      position: { lat: parseFloat(lat), lng: parseFloat(lng) },
    });
  },
} satisfies Actions;
