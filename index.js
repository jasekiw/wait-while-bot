const puppeteer = require("puppeteer");
const wait = require('./wait.js').wait;
const waitForTime = require('./waitForTime.js').waitForTime;
require('./configSchema.js')

/**
 *
 * @param {puppeteer.Page} page
 */
async function getIsDisabled(page) {
  return await page.evaluate(() => {
    return document.querySelector(`#join-waitlist-1`).parentElement.className.indexOf("disabled") !== -1;
  });
}

/**
 *
 * @param {puppeteer.Page} page
 * @returns {Promise<void>}
 */
async function loadPage(page) {
  await page.goto("https://waitwhile.com/welcome/derbycitychopshop", {
    waitUntil: "networkidle2",
  });
  await page.waitForSelector('#join-waitlist-1');
}

/**
 *
 * @returns {Promise<{browser: puppeteer.Browser, page: puppeteer.Page}>}
 */
async function setupBrowser() {
  const browser = await puppeteer.launch({ headless: false });

  // open a new tab in the browser
  const page = await browser.newPage();
  // set device size to stick to only desktop view
  await page.setViewport({
    width: 1280,
    height: 800,
    isMobile: false,
  });
  return {browser, page};
}

/**
 *
 * @param {puppeteer.Page} page
 * @param {Config} conf
 * @returns {Promise<void>}
 */
async function fillOutForm(page, conf) {
  await page.click('#join-waitlist-1');

  await page.waitForSelector("#service-1");
  await page.click("#service-1")
  await page.click("#allow-multiple-next-btn")

  await page.waitForSelector("#public-partysize-next");
  await page.click("#public-partysize-next");

  await page.waitForSelector(".service-list.first-avail");
  await page.waitForTimeout(200); // in some cases the page wasn't ready
  await page.click(".service-list.first-avail"); // click no first available person button and it will automatically go to the next page

  await page.waitForSelector("#name02");
  await page.type("#name02", conf.firstName);
  await page.waitForSelector("#name03");
  await page.type("#name03", conf.lastName);
  await page.waitForSelector("#phone01");
  await page.type("#phone01", conf.phoneNumber);
  await page.waitForSelector("#public-confirm-button");
  if(conf.confirm) {
    await page.click("#public-confirm-button");
  }
}

/**
 *
 * @param {puppeteer.Page} page
 * @returns {Promise<void>}
 */
async function waitForSignupToBeAvailable(page) {
  let isDisabled = true;
  while(isDisabled) {
    await loadPage(page);
    isDisabled = getIsDisabled(page);
    if(isDisabled)
      await wait(5);
  }
}

/**
 *
 * @param {puppeteer.Browser} browser
 * @param {puppeteer.Page} page
 * @returns {Promise<void>}
 */
async function waitAndCloseBrowser(browser, page) {
  await page.waitForTimeout(5000);
  await browser.close();
}

/**
 *
 * @param {Config} conf
 * @returns {Promise<void>}
 */
async function main(conf) {
  await waitForTime(conf.targetTime.tomorrow, conf.targetTime.hour, conf.targetTime.minute);
  const {browser, page} = await setupBrowser();
  await waitForSignupToBeAvailable(page);
  await fillOutForm(page, conf);
  if(conf.closeAfter)
    await waitAndCloseBrowser(browser, page);
}


main(require('./config').config).catch(e => {
  console.log("encountered an error!");
  console.error(e);
});
