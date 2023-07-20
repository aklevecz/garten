import db from "$lib/db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, locals }) => {
  const { code } = params;
  const marker = await db.getMarkerByCode(code);
  if (!marker) {
    throw error(404, "the code does not exist");
  }
  return {
    code,
    marker,
    hunter: locals.hunter,
    isCracker: locals.hunter === marker.finder,
    markers: db.getMarkers(db.getActiveHunt().name),
  };
}) satisfies PageServerLoad;
