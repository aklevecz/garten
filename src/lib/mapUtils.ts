import type { HuntMarker } from "./types";

const createMarker = (map: google.maps.Map, position: google.maps.LatLngLiteral, title: string) => {
  const newMarker = new google.maps.Marker({
    position,
    map,
    title,
  });
  return newMarker;
};

const svgMarker = () => {
  let path = "M5 0C5 2.76 2.76 5 0 5C-2.76 5 -5 2.76 -5 0C-5 -2.76 -2.76 -5 0 -5C2.76 -5 5 -2.76 5 0Z";
  const svgMarker = {
    path,
    fillOpacity: 0.1,
    fillColor: "#000",
    strokeColor: "#ff0000",
    strokeWeight: 2,
    rotation: 0,
    scale: 2,
    // half the width and height to anchor in the center
    anchor: new google.maps.Point(0, 0),
  };
  return svgMarker;
};

export default { createMarker, svgMarker };
