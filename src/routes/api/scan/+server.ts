import db from "$lib/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, locals }) => {
  const email = url.searchParams.get("email") ?? "";
  const markerName = url.searchParams.get("markerName") ?? "";
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
