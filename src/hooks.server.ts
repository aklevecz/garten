import { cookieKeys } from "$lib/constants";
import type { Handle } from "@sveltejs/kit";
import Iron from "@hapi/iron";
import { SESSION_SECRET } from "$env/static/private";
export const handle = (async ({ event, resolve }) => {
  const cookie = event.cookies.get(cookieKeys.hunter) as string;
  if (!cookie) {
    event.locals.hunter = "";
    return resolve(event);
  }
  try {
    const { hunter } = await Iron.unseal(cookie, SESSION_SECRET, Iron.defaults);
    console.log("hooks.server.ts, hunter:", hunter);
    event.locals.hunter = hunter;
  } catch (e) {
    console.log(e);
    event.locals.hunter = "";
  }
  return resolve(event);
}) satisfies Handle;
