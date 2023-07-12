import { SESSION_SECRET } from "$env/static/private";
import { cookieKeys, requestErrors } from "$lib/constants";
import Iron from "@hapi/iron";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies }) => {
  const cookie = cookies.get(cookieKeys.hunter) as string;
  try {
    const address = await Iron.unseal(cookie, SESSION_SECRET, Iron.defaults);
    return json({ address });
  } catch (e) {
    console.log(e);
    throw error(401, requestErrors.signInFailed);
  }
};

export const POST: RequestHandler = async ({ cookies, request }) => {
  const data = await request.json();
  const { address } = data;

  try {
    const sealed = await Iron.seal({ address }, SESSION_SECRET, Iron.defaults);
    cookies.set(cookieKeys.hunter, sealed);
    return json({ address });
  } catch (e) {
    throw error(501, requestErrors.signInFailed);
  }
};
