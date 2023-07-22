import { mapCenters } from "$lib/constants";
import type { HuntMarker, Hunts } from "./types";

import { AWS_S3_ACCESS_KEY, AWS_S3_SECRET_KEY } from "$env/static/private";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { cleanString } from "./utils";

// Possible indexes
// by hunter?
const client = new DynamoDBClient({
  region: "us-east-1",
  credentials: { accessKeyId: AWS_S3_ACCESS_KEY, secretAccessKey: AWS_S3_SECRET_KEY },
});
const docClient = DynamoDBDocumentClient.from(client);

const table = "eggs";

// HUNT#<hunt_name> HUNT#<hunt_name>
const hunts: { [hunt in Hunts]: any } = {
  "fwb-fest": {
    name: "fwb-fest",
    center: mapCenters.laColombe,
  },
  "fwb-flower": {
    name: "fwb-flower",
    center: mapCenters.fwbFest,
  },
};

// @todo make more dynamic
const getActiveHunt = () => {
  return hunts["fwb-fest"];
};

const getMarkers = async (hunt: Hunts): Promise<HuntMarker[] | null> => {
  const huntString = `HUNT#${hunt}`;
  const command = new QueryCommand({
    TableName: table,
    KeyConditionExpression: "#pk = :pk and begins_with(#sk, :sk)",
    ExpressionAttributeValues: {
      ":pk": huntString,
      ":sk": "MARKER#",
    },
    ExpressionAttributeNames: {
      "#pk": "pk",
      "#sk": "sk",
    },
  });
  // testing
  // const m = markers.filter((m) => m.hunt === hunt);
  try {
    const res = await docClient.send(command);
    return res.Items as HuntMarker[];
  } catch (e) {
    console.error("there was an error fetching the markers for the hunt");
    return null;
  }
};

const addMarker = async (marker: HuntMarker) => {
  // markers.push(marker);
  const command = new PutCommand({
    TableName: table,
    Item: {
      pk: `HUNT#${getActiveHunt().name}`,
      sk: `MARKER#${marker.code}`,
      ...marker,
    },
  });
  try {
    await docClient.send(command);
    return { success: true };
  } catch (e) {
    return null;
  }
};

const checkMarker = (name: string) => markers.find((m) => m.name === name)?.found;

const getMarkerByCode = async (code: string) => {
  //testing
  // markers.find((m) => m.code === code);
  const command = new GetCommand({
    TableName: table,
    Key: {
      pk: `HUNT#${getActiveHunt().name}`,
      sk: `MARKER#${cleanString(code)}`,
    },
  });
  try {
    const res = await docClient.send(command);
    return res.Item;
  } catch (e) {
    console.error("error while checking marker by code");
    return null;
  }
};

const claimMarker = async (marker: HuntMarker, finder: string) => {
  // testing
  // const filteredMarkers = markers.filter((marker) => marker.name !== claimedMarker.name);
  // markers = [...filteredMarkers, { ...claimedMarker, found: true, finder }];

  const command = new UpdateCommand({
    TableName: table,
    Key: {
      pk: `HUNT#${getActiveHunt().name}`,
      sk: `MARKER#${marker.code}`,
    },
    UpdateExpression: `SET #found = :found, #finder = :finder`,
    ExpressionAttributeNames: {
      "#found": "found",
      "#finder": "finder",
    },
    ExpressionAttributeValues: {
      ":finder": finder,
      ":found": true,
    },
  });

  try {
    await docClient.send(command);
    return { success: true };
  } catch (e) {
    console.error("error claiming marker:", marker.name, marker.code, finder);
    return null;
  }
};

const saveUserIP = async (hunter: string, ip: string) => {
  const command = new PutCommand({
    TableName: table,
    Item: {
      pk: `USER#${hunter}`,
      sk: `IP#${ip}`,
    },
  });

  try {
    await docClient.send(command);

    return { success: true };
  } catch (e) {
    console.error("error while saving user ip", e);
    return null;
  }
};

// deprecated?
const getHuntersCollected = (hunt: Hunts, hunter: string) => {
  const huntedMarkers = markers.filter((marker) => marker.hunt === hunt && marker.finder === hunter);
  return huntedMarkers;
};

export default {
  getMarkers,
  addMarker,
  checkMarker,
  getActiveHunt,
  getMarkerByCode,
  claimMarker,
  getHuntersCollected,
  saveUserIP,
};

// DEPRECATED
// @todo markers hunt mapping
// @todo marker groups?
// MARKER#marker_name/id HUNT#<hunt_name>
// BY ID
// BY HUNTER
let markers: HuntMarker[] = [
  { name: "fwb-fest-1", hunt: "fwb-fest", position: { ...mapCenters.laColombe }, code: "shrimp" },
  {
    name: "fwb-fest-2",
    hunt: "fwb-fest",
    position: { lat: mapCenters.laColombe.lat + 0.0001, lng: mapCenters.laColombe.lng + 0.0001 },
    code: "pimp",
  },
];

function genRandomLoc(center: { lat: number; lng: number }): HuntMarker {
  const radius = 0.05;
  const lat = center.lat + radius * (Math.random() - 0.5);
  const lng = center.lng + radius * (Math.random() - 0.5);
  return { position: { lat, lng }, name: "fuck", hunt: "fwb-fest", code: "code", found: false };
}

const randomLocs = [];

for (let i = 0; i < 20; i++) {
  randomLocs.push(genRandomLoc(mapCenters.laColombe));
}
