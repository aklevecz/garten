import db from "$lib/db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, locals }) => {
  const { code } = params;
  const marker = db.getMarkerByCode(code);
  if (!marker) {
    throw error(404, "the code does not exist");
  }
  return {
    code,
    marker,
    hunter: locals.hunter,
    eggsCollected: locals.hunter ? db.getHuntersCollected(db.getActiveHunt().name, locals.hunter) : [],
  };
}) satisfies PageServerLoad;
