const plotly = require('plotly')("kozorog", "SzLQweRMdm9Yb3rRhvdi");
const utils = require('./utils');
const Race = require('./Race').Race;

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

async function computeRace(raceId, algorithm, repeat) {
    let data = await utils.getJsonFileData('test');
    let r = data[raceId-1];
    let race = new Race(raceId, r.stats.n, r.stats.k, r.stats.d, r.stats.m, r.points, r.orderedRaces);
    let attempts = [];
    for (let i = 0; i < repeat; i++)
        attempts.push(race.randomSwitching());
    let bestAttempt = {scoreSum: 0};
    for (let i = 0; i < repeat; i++)
        if (attempts[i].scoreSum > bestAttempt.scoreSum)  bestAttempt = attempts[i];
    plot(getNumbersArray(bestAttempt.scoreSumList.length), bestAttempt.scoreSumList);
    await onFinish(race.id, bestAttempt.scoreSum, bestAttempt.bikers);
    log(race, attempts, bestAttempt);
}

function log(race, attempts, bestAttempt) {
    console.log('best result: ', bestAttempt);
    console.log('\n');
}

async function onFinish(raceId, score, race) {
    let parsedData = utils.stringifyData(raceId, race);
    let filename =  'race_' + raceId + '_' + score + '_' + new Date().getUTCMilliseconds();
    await utils.saveData(parsedData, filename);
}

function getNumbersArray(end) {
    let array = [];
    for (let i = 0; i < end; i++)
        array.push(i)
    return array;
}

function plot(xAxis, yAxis) {
    let data = [{x: xAxis, y: yAxis, type: 'scatter'}];
    let layout = {fileopt : "overwrite", filename : "bikers-optimization-2"};
    plotly.plot(data, layout, function (err, msg) {
        if (err) return console.log(err);
        console.log(msg);
    });
}

module.exports = {
    computeRace: computeRace
};