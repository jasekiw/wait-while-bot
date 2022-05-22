const wait = require('./wait.js').wait;

/**
 *
 * @param {boolean} tomorrow
 * @param {number} hour
 * @param {number} minutes
 * @returns {Promise<void>}
 */
async function waitForTime(tomorrow, hour, minutes) {
  let isIt8 = false;
  while(!isIt8) {
    let currentTime = new Date();
    let target = new Date();
    target.setHours(hour, minutes, 0, 0);
    target.setDate(target.getDate() + (tomorrow ? 1 : 0))
    let elapsed = (target - currentTime) / 1000
    isIt8 = elapsed <= 0;
    if(!isIt8) {
      await wait(1)
    }
  }
}

exports.waitForTime = waitForTime;




