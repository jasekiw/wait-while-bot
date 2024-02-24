const wait = require('./wait.js').wait;

/**
 *
 * @param {boolean} tomorrow
 * @param {number} hour
 * @param {number} minutes
 * @returns {Promise<void>}
 */
async function waitForTime(tomorrow, hour, minutes) {
  let isItTime = false;
  const target = getTargetDate(tomorrow, hour, minutes);
  if(!isItTime) {
    console.log('Waiting for target time: ' + target);
  }
  while(!isItTime) {
    let currentTime = new Date();
    let elapsed = (target - currentTime) / 1000
    isItTime = elapsed <= 0;
    if(!isItTime) {
      await wait(1)
    }
  }
}

/**
 * @param {boolean} tomorrow
 * @param {number} hour
 * @param {number} minutes
 */
function getTargetDate(tomorrow, hour, minutes) {
  let target = new Date();
  target.setHours(hour, minutes, 0, 0);
  target.setDate(target.getDate() + (tomorrow ? 1 : 0))
  return target;
}

exports.waitForTime = waitForTime;




