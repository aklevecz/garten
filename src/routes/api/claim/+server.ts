import { SESSION_SECRET } from "$env/static/private";
import { cookieKeys } from "$lib/constants";
import db from "$lib/db";
import type { HuntMarker } from "$lib/types";
import Iron from "@hapi/iron";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

// your first egg becomes your username/userid
// your next eggs are found by that username/userid
// what if you want to change? does it matter? blockchain style? you could start a new character? you can mint your character and sell it to someeone else?

// add a pin to each card that they can't reveal? or a set of symbols? and they always take that no matter what

// some sort of egg portal that allows you to change the pin to the new person

// or there is a nfc chip in it that holds the pin

// something comes out of the egg

// you have to come to the gallery to crack it

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
  const data = await request.json();
  const { code, name } = data;
  let hunter = locals.hunter;
  // no hunter means no user session
  if (!hunter) {
    hunter = name as string;
    const info = await db.getHunterInfo(hunter);
    console.log(info);
    const sealed = await Iron.seal({ hunter, info }, SESSION_SECRET, Iron.defaults);
    cookies.set(cookieKeys.hunter, sealed, { path: "/", httpOnly: true, secure: true });
    // throw error(401, requestErrors.notSignedIn);
  }

  // always save their ip with the code they found -- or the marker could hold this info
  await db.saveUserIP(hunter, locals.ip);

  const marker = (await db.getMarkerByCode(code)) as HuntMarker;
  if (marker && hunter) {
    db.claimMarker(marker, hunter);
  }
  return json({ marker });
};
