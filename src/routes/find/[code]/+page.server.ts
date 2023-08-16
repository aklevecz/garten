import db from "$lib/db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Hunts } from "$lib/types";
let renders = 0;

// move db calls to cached api calls? or does that get more messy than needed?

// this load should do auth-- like fetching the info because it is essentially the auth endpoint
// and then seal it in the cookie
// or maybe it facilities that and then the cookie trickles back down to it
export const load = (async ({ depends, params, locals }) => {
  depends("find");
  const { code } = params;
  const marker = await db.getMarkerByCode(code);
  if (!marker) {
    throw error(404, "the code does not exist");
  }
  renders++;
  console.log("find/+page.server.ts:", renders);
  console.log("find/+page.server.ts, hunter: ", locals.hunter);
  return {
    code,
    marker,
    hunter: locals.hunter,
    info: locals.info,
    isCracker: locals.hunter && locals.hunter === marker.finder,
    // markers: db.getMarkers(db.getActiveHunt().name as Hunts),
  };
}) satisfies PageServerLoad;
