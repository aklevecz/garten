import db from "$lib/db";
import { json } from "@sveltejs/kit";
import type { RequestEvent, RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  return json({ markers: db.getMarkers("fwb-fest") });
};

export const POST = async ({ request, locals }) => {
  const data = await request.json();
  const { code } = data;
  const marker = db.getMarkerByCode(code);
  if (marker && locals.hunter) {
    db.claimMarker(marker, locals.hunter);
  }
  return json({ marker });
};
