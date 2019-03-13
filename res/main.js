const plotly = require('plotly')("kozorog", "SzLQweRMdm9Yb3rRhvdi");
const data = require('./data');
const utils = require('./utils');
const Optimization = require('./Optimization').Optimization;

// results: http://rtk.ijs.si/2019/kolesarji/#naj

async function computeRace(raceId, algorithm, gradientSteps = 1, repeat = 1, useMaxSwitches = false) {
    return new Promise(async resolve => {
        let inputData = await data.getJsonFileData('input_races');
        let input = inputData[raceId-1];
        let instance = new Optimization(
            raceId, input.stats.n,
            input.stats.k, input.stats.d,
            input.stats.m, input.points,
            input.orderedRaces);
        let attempts = [];
        let bestAttempt = 0;
        for (let i = 0; i < repeat; i++)
            attempts.push(instance.randomSwitching(gradientSteps, useMaxSwitches));
        console.log(attempts);
        for (let i = 0; i < repeat; i++)
            if (attempts[i].getTotalScore() > bestAttempt) bestAttempt = attempts[i];
        await save(instance.id, bestAttempt.getTotalScore(), bestAttempt.getAllRaces());
        plot(utils.getNumbersArray(bestAttempt.getScoreTrack().length), bestAttempt.getTotalScore());
        log(instance, attempts, bestAttempt);
        return resolve();
    })
}

function log(race, attempts, bestAttempt) {
    console.log('best result: ', bestAttempt);
    console.log('\n');
}

async function save(raceId, score, race) {
    let parsedData = data.stringifyData(raceId, race);
    let filename =  'race_' + raceId + '_' + score + '_' + new Date().getUTCMilliseconds();
    await data.saveData(parsedData, filename);
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