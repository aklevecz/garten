import db from "$lib/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import Iron from "@hapi/iron";
import { cookieKeys } from "$lib/constants";
import { SESSION_SECRET } from "$env/static/private";
export const POST: RequestHandler = async ({ request, locals, cookies }) => {
  if (!locals.hunter) {
    throw error(401);
  }
  const data = await request.json();
  const { info } = data;
  const res = await db.rsvp(locals.hunter, info);
  if (res?.success) {
    const sealed = await Iron.seal({ hunter: locals.hunter, info }, SESSION_SECRET, Iron.defaults);
    cookies.set(cookieKeys.hunter, sealed, { path: "/", httpOnly: true, secure: true });
    return json({ success: true });
  }
  throw error(404);
};
