const main = require('../main');

(async function init() {
    let raceId = Number.parseInt(process.argv[2]);
    let algorithm = process.argv[3];
    let repeat = Number.parseInt(process.argv[4]);
    if (process.argv[4] === undefined) repeat = 1;
    if (algorithm === 'no-switching' || algorithm === 'random-switching'
        && raceId > 0 && raceId < 29)  {
        await computeRace(raceId, algorithm, repeat)
    }
})();