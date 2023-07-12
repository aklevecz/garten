import db from "$lib/db";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  return json({ markers: db.getMarkers("fwb-fest") });
};
