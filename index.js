// const puppeteer = require("puppeteer");

const axios = require("axios");
const wait = require('./wait.js').wait;
const waitForTime = require('./waitForTime.js').waitForTime;
async function checkAvailable() {
  const response = await axios.get('https://waitwhile.com/api/v2/public/locations/derbycitychopshop');
  if(response.status !== 200) {
    throw response;
  }
  return response.data.isWaitlistActive;
}

/**
 *
 * @param {Config} config
 * @returns {Promise<*>}
 */
async function submitToQueue(config) {
  const response = await axios.post('https://api.waitwhile.com/v2/public/visits/5Q1X9eFEygDJeVB1cyin', {
    "locale": "en-US",
    "serviceIds": [
        "txftezWLYEB05JltyWW1"
    ],
    "firstName": config.firstName,
    "lastName": config.lastName,
    "phone": config.phoneNumber,
    "partySize": "1",
    "resourceIds": [
        "A0TihBZEdsHrh6lakpvR" // brandon
    ],
    "fields": {}
  });
  if(response.status !== 200) {
    throw response;
  }
  console.log(response.data);
  return response.data.publicId;
}
/**
 *
 * @returns {Promise<void>}
 */
async function waitForSignupToBeAvailable() {
  let isDisabled = true;
  while(isDisabled) {
    isDisabled = !(await checkAvailable());
    if(isDisabled)
      await wait(1);
  }
}

/**
 *
 * @param {Config} conf
 * @returns {Promise<void>}
 */
async function main(conf) {
  if(conf.targetTime) {
    await waitForTime(conf.targetTime.tomorrow, conf.targetTime.hour, conf.targetTime.minute);
  }
  await waitForSignupToBeAvailable();
  const id = await submitToQueue(conf);
  if(!id) {
    console.log('something went wrong with the submission id came back as falsy: ' + id);
  } else {
    console.log(`View appointment at: https://waitwhile.com/locations/derbycitychopshop/visits/${id}`);
  }

}


main(require('./config').config).catch(e => {
  console.log("encountered an error!");
  console.error(e);
});
