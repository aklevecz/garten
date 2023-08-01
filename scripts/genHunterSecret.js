import jsSha3 from "js-sha3";
import deterministicLetterRearrange from "./arrange.js";
const keccak_256 = jsSha3.keccak_256;

const args = process.argv.slice(2);

function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function sha3(message) {
  return keccak_256(message);
}

function generateRandomSHA3Hash() {
  const randomString = generateRandomString(32); // Change 32 to the desired length of the random string.
  const sha3Hash = sha3(randomString);
  return sha3Hash;
}

function main() {
  const input = args[0];
  let hash = "";
  if (!input) {
    hash = generateRandomSHA3Hash();
  } else {
    hash = sha3(input + deterministicLetterRearrange(input));
  }
  console.log(hash);
}
main();
