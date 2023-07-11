import db from "$lib/db";
import type { PageServerLoad } from "./$types";

export const load = (async ({ cookies }) => {
  const markers = db.getMarkers("fwb-fest");
  return { markers };
}) satisfies PageServerLoad;
