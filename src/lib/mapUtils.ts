const createMarker = (
  map: google.maps.Map,
  position: google.maps.LatLngLiteral | google.maps.LatLng,
  title: string,
  icon: any = null
) => {
  const newMarker = new google.maps.Marker({
    position,
    map,
    title,
    icon,
    zIndex: title === "user" ? 0 : 1,
    draggable: true,
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

const eggIcon = () => {
  const brokenEggYours = "/egg-broken-smoll-map-icon-yours.svg";
  const brokeEggTheirs = "/egg-broken-smoll-map-icon-others.svg";
  const eggIcon = "/egg-smoll-map-icon.svg";
  return {
    // url: `data:image/svg+xml;base64,${svg}`,
    url: eggIcon,
    scaledSize: new google.maps.Size(45, 45),
  };
};

const smilerIcon = () => {
  const url = "/smiler.svg";

  return {
    url,
    scaledSize: new google.maps.Size(30, 30),
  };
};

export default { createMarker, svgMarker, eggIcon, smilerIcon };
