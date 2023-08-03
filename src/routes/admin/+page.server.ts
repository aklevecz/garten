import db from "$lib/db";
import type { Hunts } from "$lib/types";
import { error, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { cleanString } from "$lib/utils";

export const load = (async () => {
  const hunt = db.getActiveHunt().name;
  const markers = await db.getMarkers(hunt);

  if (!markers) {
    throw error(404, "no markers found");
  }
  return { hunt, markers };
}) satisfies PageServerLoad;

export const actions = {
  add: async ({ request }) => {
    const data = await request.formData();
    const name = data.get("name") as string;
    const code = data.get("code") as string;
    const customMarker = data.get("custom-marker") as string;
    const hunt = data.get("hunt") as Hunts;
    const lat = data.get("lat") as string;
    const lng = data.get("lng") as string;
    const res = await db.addMarker({
      name: cleanString(name),
      code: cleanString(code),
      customMarker: cleanString(customMarker),
      hunt: cleanString(hunt) as Hunts,
      position: { lat: parseFloat(lat), lng: parseFloat(lng) },
    });
    if (res?.success) {
      return res;
    }
    throw error(400, "failed to add marker");
  },
  addHunt: async ({ request }) => {
    const data = await request.formData();
    const name = data.get("name") as string;
    const markerPath = data.get("marker-path") as string;
    const lat = data.get("lat") as string;
    const lng = data.get("lng") as string;

    try {
      await db.addHunt({
        name: cleanString(name),
        markerPath,
        position: { lat: parseFloat(lat), lng: parseFloat(lng) },
      });
      return { success: true };
    } catch (e) {
      return null;
    }
  },
} satisfies Actions;
