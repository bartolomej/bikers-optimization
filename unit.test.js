const should = require('chai').should();
const expect = require('chai').expect;
const assert = require('chai').assert;
const utils = require('./res/utils');
const Race = require('./res/Race').Race;
const Optimization = require('./res/Optimization').Optimization;
const main = require('./res/main');
const clean = require('./res/scripts/clean');
const data = require('./res/data');

describe('Parsing testing', function () {
    it('should read file', async function () {
        let file = await data.getJsonFileData('input_race');
        should.exist(file);
    });
    it('should parse file', async function () {
        let file = await data.getFileData('kolesarji-unix.in.txt');
        let parsedData = data.parseData(file);
        should.exist(parsedData);
    });
    it('should save data to file', async function () {
        let dataFile = await data.getFileData('kolesarji-unix.in.txt');
        let parsedData = data.parseData(dataFile);
        let saving = await data.saveData(parsedData, 'test.json');
    });
    it('should parse output data', function () {
        let races = [[1,2,3], [3,1,2], [2,1,3]];
        let output = data.stringifyData(1, races);
        data.saveData(output, 'test.txt');
    });
    it('should correctly determine files with best results', function () {
        clean.clean()
    });
});

describe('Utils testing', function () {
    it('should generate random numbers', function () {
        let n1 = utils.randomDistinctNumbers(4, 5);
        let n2 = utils.randomDistinctNumbers(10, 11, [1,2,3]);
        let n3 = utils.randomDistinctNumbers(10, 11);
        let n4 = utils.randomDistinctNumbers(0, 19);
        should.equal(n1.length, 4);
        should.equal(n2.length, 10);
        should.equal(shouldNotInclude(n2, [1,2,3]), true);
        should.equal(n3 instanceof Error, true);
        should.equal(n4.length, 0);
    });
    it('should should sum array', function () {
        let arraySum = utils.getArraySum([1,3,4]);
        should.equal(arraySum, 8);
    });
    it('should should merge array without duplication', function () {
        let withMergeDuplication = utils.mergeWithoutDuplication([4,5,1,2,6,3], [5,6,1]);
        let withoutMergeDuplication = utils.mergeWithoutDuplication([1,5,2,4,6,3], [8,2,6,7]);
        should.equal(withMergeDuplication.length, 6);
        should.equal(withoutMergeDuplication.length, 8);
    });
});

describe('Optimization class testing', function () {
    it('should test static class functions', function () {
        let arrayMix = new Optimization(1,5,3).randomBikersMix([1,2,3], [4]);
        let falseArrayMix = new Optimization(1,5,4).randomBikersMix([1,2,3,4], [1,3,4]);
        let nonArrayMix = new Optimization(1,6,5).randomBikersMix([1,2,3,4,5], []);
        should.equal(arrayMix.length, 3);
        should.equal(nonArrayMix.length, 5);
        should.not.equal(arrayMix, [1,2,3]);
        should.equal(falseArrayMix.length, 4);
    });
    it('should compute race with random gradient descent', function () {
        let races = [[5,3,4,2,1], [3,4,5,1,2], [1,2,5,3,4], [4,2,1,5,3]];
        let instance = new Optimization(1, 5, 3, 4, 2, [100, 80, 60], races);
        let randomSwitchResult = instance.randomSwitching(10, true);
        should.exist(randomSwitchResult);
    });
    it('should should compute race with iterative gradient descent', function () {
        let races = [[5,3,4,2,1], [3,4,5,1,2], [1,2,5,3,4], [4,2,1,5,3]];
        let instance = new Optimization(1, 5, 3, 4, 2, [100, 80, 60], races);
        let randomSwitchResult = instance.iterativeSwitching(1);
        should.exist(randomSwitchResult);
    });
    it('should compute race', function () {
        let races = [[5,3,4,2,1], [3,4,5,1,2], [1,2,5,3,4], [4,2,1,5,3]];
        let instance = new Optimization(1, 5, 3, 4, 2, [100, 80, 60, 40, 30], races);
        let randomSwitchResult = instance.randomSwitching();
        should.exist(randomSwitchResult);
    });
    it('should calculate results', async function () {
        await main.computeRace(1, 'random-switching');
    });
});


function shouldNotInclude(array, constraints) {
    for (let i = 0; i < array.length; i++)
        for (let j = 0; j < constraints.length; j++)
            if (array[i] === constraints[j]) return false;
    return true;
}

