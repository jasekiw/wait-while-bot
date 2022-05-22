const waitForTime = require('./waitForTime.js').waitForTime;

(async function() {
  // change this to a future time to test
  await waitForTime(false, 19, 49);
  console.log("it's time!");
})();
