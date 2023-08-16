const accountSid = "AC8d7dce6ee08ebb0913366f14b0f828a9";
const authToken = "";
const toPhoneNumber = "+14159671642";
const fromPhoneNumber = "+18887087612";
const messageBody = "cheeeemooooooo";

const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

fetch(url, {
  method: "POST",
  headers: {
    Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    To: toPhoneNumber,
    From: fromPhoneNumber,
    Body: messageBody,
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
