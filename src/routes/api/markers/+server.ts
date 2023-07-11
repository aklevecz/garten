import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import db from "$lib/db";

export const GET: RequestHandler = async () => {
  return json({ markers: db.getMarkers("fwb-fest") });
};
