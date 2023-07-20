import db from "$lib/db";
import type { HuntMarker } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  return json({ markers: await db.getMarkers("fwb-fest") });
};

export const POST = async ({ request, locals }) => {
  const data = await request.json();
  const { code } = data;
  const marker = (await db.getMarkerByCode(code)) as HuntMarker;
  if (marker && locals.hunter) {
    db.claimMarker(marker, locals.hunter);
  }
  return json({ marker });
};
