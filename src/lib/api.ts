const endpoints = {
  claim: "/api/claim",
  rsvp: "/api/rsvp",
};

type Endpoint = keyof typeof endpoints;

const fetcher = async (endpoint: Endpoint, method: "POST" | "GET", params: any) => {
  const res = await fetch(endpoints[endpoint], { method, body: JSON.stringify({ ...params }) });
  const data = await res.json();
  if (res.status !== 200) {
    throw Error(data.message);
  }
  return data;
};

const claimEgg = async (code: string, name: string) => fetcher("claim", "POST", { code, name });

const rsvp = async (info: string, favoriteArtist: string) => fetcher("rsvp", "POST", { info, favoriteArtist });

export default { claimEgg, rsvp };
