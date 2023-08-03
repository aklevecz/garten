import db from "$lib/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals }) => {
  const data = await request.json();
  const { email, markerName } = data;
  const res = await db.addScan(email, locals.ip, markerName);
  if (res?.success) {
    return json(
      { success: true },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
  throw error(404);
};
