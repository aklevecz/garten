import { mapCenters } from "$lib/constants";
import type { HuntMarker, Hunts } from "./types";

import { AWS_S3_ACCESS_KEY, AWS_S3_SECRET_KEY } from "$env/static/private";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "us-east-1",
  credentials: { accessKeyId: AWS_S3_ACCESS_KEY, secretAccessKey: AWS_S3_SECRET_KEY },
});
const docClient = DynamoDBDocumentClient.from(client);

const table = "eggs";

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

// Possible indexes
// by hunter?

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

const getActiveHunt = () => {
  return hunts["fwb-fest"];
};

const getMarkers = async (hunt: Hunts): Promise<HuntMarker[]> => {
  const huntString = `HUNT#${getActiveHunt().name}`;
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
  const m = markers.filter((m) => m.hunt === hunt);

  const res = await docClient.send(command);
  console.log(res.Items);
  return res.Items;
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
  const res = await docClient.send(command);
  console.log(res);
};

const checkMarker = (name: string) => markers.find((m) => m.name === name)?.found;

const getMarkerByCode = async (code: string) => {
  //old
  markers.find((m) => m.code === code);
  //old
  const command = new GetCommand({
    TableName: table,
    Key: {
      pk: `HUNT#${getActiveHunt().name}`,
      sk: `MARKER#${code}`,
    },
  });
  const res = await docClient.send(command);
  return res.Item;
};

const claimMarker = async (marker: HuntMarker, finder: string) => {
  // old
  // const filteredMarkers = markers.filter((marker) => marker.name !== claimedMarker.name);
  // markers = [...filteredMarkers, { ...claimedMarker, found: true, finder }];
  // old

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

  const res = await docClient.send(command);
  console.log(res);
};

const getHuntersCollected = (hunt: Hunts, hunter: string) => {
  const huntedMarkers = markers.filter((marker) => marker.hunt === hunt && marker.finder === hunter);
  return huntedMarkers;
};

export default { getMarkers, addMarker, checkMarker, getActiveHunt, getMarkerByCode, claimMarker, getHuntersCollected };
