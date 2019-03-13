const main = require('../main');

(async function init() {
    let raceId = Number.parseInt(process.argv[2]);
    let algorithm = process.argv[3];
    let gradientSteps = Number.parseInt(process.argv[4]);
    let repeat = Number.parseInt(process.argv[5]);
    let useMaxSwitches = process.argv[6] === 'true';

    if (process.argv[4] === undefined) gradientSteps = 1;
    if (process.argv[5] === undefined) repeat = 1;
    if (algorithm === 'no-switching' || algorithm === 'random-switching'
        && raceId > 0 && raceId < 29)  {
        await main.computeRace(raceId, algorithm, gradientSteps, repeat, useMaxSwitches)
    }
})();