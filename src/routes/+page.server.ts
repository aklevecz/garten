import { SESSION_SECRET } from "$env/static/private";
import { cookieKeys, requestErrors } from "$lib/constants";
import db from "$lib/db";
import Iron from "@hapi/iron";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ cookies, locals }) => {
  // this could come from the cookie if hooks.server is not used
  const hunter = locals.hunter;
  const markers = await db.getMarkers("fwb-fest");

  if (!markers) {
    throw error(404, "markers not found");
  }

  console.log("+page.server.ts load :", locals.hunter);
  return {
    markers: markers.map((m) => ({ ...m, isCracker: m.finder === hunter })),
    hunter,
    // client side?
    // eggsCollected: locals.hunter ? db.getHuntersCollected(db.getActiveHunt().name, locals.hunter) : [],
  };
}) satisfies PageServerLoad;

export const actions = {
  login: async ({ request, cookies, locals }) => {
    const data = await request.formData();
    const hunter = data.get("hunter") as string;
    // return fail(400, { problem: "Bio must be less than 260 characters" });
    try {
      const sealed = await Iron.seal({ hunter }, SESSION_SECRET, Iron.defaults);
      cookies.set(cookieKeys.hunter, sealed, { path: "/", httpOnly: true, secure: true });
      locals.hunter = hunter;
      await db.saveUserIP(hunter, locals.ip);
      console.log("+page.server.ts actions :", locals);
    } catch (e) {
      console.log(e);
      throw error(501, requestErrors.signInFailed);
    }
  },
  logout: async ({ cookies, locals }) => {
    locals.hunter = "";
    cookies.delete(cookieKeys.hunter);
    console.log("+page.server.ts actions  logout:", locals);
  },
};
