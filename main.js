const plotly = require('plotly')("kozorog", "SzLQweRMdm9Yb3rRhvdi");
const utils = require('./utils');
const Race = require('./Race').Race;

(async function init() {
    let raceId = Number.parseInt(process.argv[2]);
    let algorithm = process.argv[3];
    if (algorithm === 'no-switching' || algorithm === 'random-switching'
        && raceId > 0 && raceId < 29)  {
        await computeRace(raceId, algorithm)
    }
})();

async function computeRace(raceId, algorithm) {
    let data = await utils.getJsonFileData('test.json');
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
    plot(getNumbersArray(attempt.scoreSumList.length), attempt.scoreSumList);
    await onFinish(race.id, attempt.scoreSum, attempt.bikers);
    console.log(race);
}

async function onFinish(raceId, score, race) {
    let parsedData = utils.stringifyData(raceId, race);
    let filename =  'race' + raceId + '_' + score + '_' + new Date().getUTCMilliseconds();
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