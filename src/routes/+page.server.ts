import { SESSION_SECRET } from "$env/static/private";
import { cookieKeys, requestErrors } from "$lib/constants";
import db from "$lib/db";
import Iron from "@hapi/iron";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ cookies, locals }) => {
  // this could come from the cookie if hooks.server is not used
  const hunter = locals.hunter;
  const markers = db.getMarkers("fwb-fest");
  console.log("+page.server.ts load :", locals.hunter);
  return {
    markers,
    hunter,
    eggsCollected: locals.hunter ? db.getHuntersCollected(db.getActiveHunt().name, locals.hunter) : [],
  };
}) satisfies PageServerLoad;

export const actions = {
  login: async ({ request, cookies, locals }) => {
    const data = await request.formData();
    const hunter = data.get("hunter") as string;
    // return fail(400, { problem: "Bio must be less than 260 characters" });
    try {
      const sealed = await Iron.seal({ hunter }, SESSION_SECRET, Iron.defaults);
      cookies.set(cookieKeys.hunter, sealed);
      locals.hunter = hunter;
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
