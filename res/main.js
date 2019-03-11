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
        for (let i = 0; i < repeat; i++) {
            if (repeat > 1) await computeRace(raceId, algorithm, false);
            else await computeRace(raceId, algorithm);
        }
    }
})();

async function computeRace(raceId, algorithm, plotChart) {
    let data = await utils.getJsonFileData('test');
    let r = data[raceId-1];
    let race = new Race(raceId, r.stats.n, r.stats.k, r.stats.d, r.stats.m, r.points, r.orderedRaces);
    let attempt;
    switch (algorithm) {
        case 'no-switching':
            attempt = race.noSwitching();
            break;
        case 'random-switching':
            attempt = race.randomSwitching();
            break;
    }
    if (plotChart) plot(getNumbersArray(attempt.scoreSumList.length), attempt.scoreSumList);
    if (plotChart) console.log(race);
    await onFinish(race.id, attempt.scoreSum, attempt.bikers);
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