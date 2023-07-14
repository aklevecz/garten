const endpoints = {
  markers: "/api/markers",
};

const findMarker = (code: string) => {
  return fetch(endpoints.markers, { method: "POST", body: JSON.stringify({ code }) }).then((r) => r.json());
};

export default { findMarker };
