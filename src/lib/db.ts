import { mapCenters } from "$lib/constants";
import type { Hunt, HuntMarker, Hunts } from "./types";

import { AWS_S3_ACCESS_KEY, AWS_S3_SECRET_KEY } from "$env/static/private";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
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
  "bao-eggs": {
    name: "bao-eggs",
    center: mapCenters.laColombe,
  },
};

const getHunterInfo = async (hunter: string) => {
  console.log(hunter);
  const command = new GetCommand({
    TableName: table,
    Key: {
      pk: `HUNTER#${hunter}`,
      sk: `HUNTER#${hunter}`,
    },
  });

  try {
    const res = await docClient.send(command);
    const { info, favoriteArtist } = res.Item!;
    return { info, favoriteArtist };
  } catch (e) {
    console.log(e);
    console.log("error getting hunt");
    return null;
  }
};

// @todo make more dynamic
const getActiveHunt = (): { name: string; center: google.maps.LatLngLiteral } => {
  return hunts["bao-eggs"];
};

const getHunt = async (huntName: string) => {
  const command = new GetCommand({
    TableName: table,
    Key: {
      pk: `HUNT#${huntName}`,
      sk: `HUNT#${huntName}`,
    },
  });
  try {
    const res = await docClient.send(command);
    const { pk, position, markerPath } = res.Item!;
    return { name: pk.replace("HUNT#", ""), position, markerPath };
  } catch (e) {
    console.log("error getting hunt");
    return null;
  }
};

const getHunts = async () => {
  const command = new ScanCommand({
    TableName: table,
    FilterExpression: "begins_with(#DYNOBASE_sk, :sk)",
    ExpressionAttributeNames: {
      "#DYNOBASE_sk": "sk",
    },
    ExpressionAttributeValues: {
      ":sk": { S: "HUNT#" },
    },
  });

  try {
    const res = await docClient.send(command);

    return res.Items?.map((item) => {
      return {
        name: item.sk.S?.replace("HUNT#", ""),
        position: { lat: item.position.M?.lat.N, lng: item.position.M?.lng.N },
      };
    });
  } catch (e) {
    return null;
  }
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

const addHunt = async (hunt: { name: string; position: google.maps.LatLngLiteral; markerPath: string }) => {
  const command = new PutCommand({
    TableName: table,
    Item: {
      pk: `HUNT#${hunt.name}`,
      sk: `HUNT#${hunt.name}`,
      position: hunt.position,
      markerPath: hunt.markerPath,
    },
  });
  try {
    await docClient.send(command);
    return { success: true };
  } catch (e) {
    return null;
  }
};

const addMarker = async (marker: HuntMarker) => {
  const command = new PutCommand({
    TableName: table,
    Item: {
      pk: `HUNT#${marker.hunt}`,
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

const updateMarker = async (marker: HuntMarker) => {
  const command = new UpdateCommand({
    TableName: table,
    Key: {
      pk: `HUNT#${marker.hunt}`,
      sk: `MARKER#${marker.code}`,
    },
    UpdateExpression: `SET #name = :name, #hunt = :hunt, #position = :position, #code = :code, #customMarker = :customMarker`,
    ExpressionAttributeNames: {
      "#name": "name",
      "#hunt": "hunt",
      "#position": "position",
      "#code": "code",
      "#customMarker": "customMarker",
    },
    ExpressionAttributeValues: {
      ":name": marker.name,
      ":hunt": marker.hunt,
      ":position": marker.position,
      ":code": marker.code,
      ":customMarker": marker.customMarker,
    },
  });

  try {
    await docClient.send(command);
    return { success: true };
  } catch (e) {
    return null;
  }
};

const deleteMarker = async (huntName: string, code: string) => {
  const command = new DeleteCommand({
    TableName: table,
    Key: {
      pk: `HUNT#${huntName}`,
      sk: `MARKER#${code}`,
    },
  });
  try {
    await docClient.send(command);
    return { success: true };
  } catch (e) {
    return null;
  }
};

const addScan = async (email: string, ip: string, markerName: string) => {
  const command = new PutCommand({
    TableName: table,
    Item: {
      pk: `EMAIL#${email}`,
      sk: `MARKER#${markerName}`,
      email,
      ip,
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
      pk: `HUNTER#${hunter}`,
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

const rsvp = async (hunter: string, info: string, favoriteArtist: string) => {
  const command = new PutCommand({
    TableName: table,
    Item: {
      pk: `HUNTER#${hunter}`,

      sk: `HUNTER#${hunter}`,
      info,
      favoriteArtist,
    },
  });
  try {
    await docClient.send(command);

    return { success: true };
  } catch (e) {
    console.error("error while saving rsvp", e);
    return null;
  }
};

// deprecated?
const getHuntersCollected = (hunt: Hunts, hunter: string) => {
  const huntedMarkers = markers.filter((marker) => marker.hunt === hunt && marker.finder === hunter);
  return huntedMarkers;
};

export default {
  getHunterInfo,
  getMarkers,
  getHunts,
  getHunt,
  addHunt,
  addMarker,
  updateMarker,
  deleteMarker,
  addScan,
  checkMarker,
  getActiveHunt,
  getMarkerByCode,
  claimMarker,
  getHuntersCollected,
  saveUserIP,
  rsvp,
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
