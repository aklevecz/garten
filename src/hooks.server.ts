import { SESSION_SECRET } from "$env/static/private";
import { cookieKeys } from "$lib/constants";
import Iron from "@hapi/iron";
import type { Handle } from "@sveltejs/kit";
export const handle = (async ({ event, resolve }) => {
  const cookie = event.cookies.get(cookieKeys.hunter) as string;
  const ip = event.getClientAddress();
  event.locals.ip = ip;
  if (!cookie) {
    event.locals.hunter = "";
    return resolve(event);
  }
  try {
    const { hunter, email, address } = await Iron.unseal(cookie, SESSION_SECRET, Iron.defaults);
    console.log("hooks.server.ts, hunter:", hunter, ip);
    event.locals.hunter = hunter;
    event.locals.email = email;
    event.locals.address = address;
  } catch (e) {
    console.log("error unseal");
    event.locals.hunter = "";
    event.locals.ip = "";
  }
  return resolve(event);
}) satisfies Handle;
