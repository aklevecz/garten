import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request }) => {
  const data = request.data();
  return new Response();
};
