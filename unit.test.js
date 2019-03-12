const should = require('chai').should();
const expect = require('chai').expect;
const assert = require('chai').assert;
const utils = require('./res/utils');
const Race = require('./res/Race').Race;
const main = require('./res/main');
const clean = require('./res/clean');

describe('Parsing testing', function () {
    it('should read file', async function () {
        let file = await utils.getJsonFileData('test');
        should.exist(file);
    });
    it('should parse file', async function () {
        let file = await utils.getFileData('kolesarji-unix.in.txt');
        let parsedData = utils.parseData(file);
        should.exist(parsedData);
    });
    it('should save data to file', async function () {
        let dataFile = await utils.getFileData('kolesarji-unix.in.txt');
        let parsedData = utils.parseData(dataFile);
        let saving = await utils.saveData(parsedData, 'test.json');
    });
    it('should parse output data', function () {
        let races = [[1,2,3], [3,1,2], [2,1,3]];
        let output = utils.stringifyData(1, races);
        utils.saveData(output, 'test.txt');
    });
    it('should correctly determine files with best results', function () {
        clean.clean()
    });
});

describe('Race class testing', function () {
    it('should generate random numbers', function () {
        let n1 = Race.randomNumbers(4, 5);
        let n2 = Race.randomNumbers(10, 11);
        let n3 = Race.randomNumbers(10, 10);
        let n4 = Race.randomNumbers(0, 19);
        should.exist(n1);
        should.exist(n2);
        should.equal(n3 instanceof Error, true);
        should.equal(n4.length, 0);
    });
    it('should test class functions', function () {
        let race = new Race(1, 3, 2, 2, 2, [100, 80, 60], [[3,1,2],[1,3,2]]);
        let arraySum = Race.getArraySum([1,3,4]);
        let arrayMix = race.randomBikersMix([1,2,3], [4]); // must be random
        let falseArrayMix = race.randomBikersMix([1,2,3], [1,3,4]);
        let nonArrayMix = race.randomBikersMix([1,2,3], []);
        let withMergeDuplication = Race.mergeWithoutDuplication([4,5,1,2,6,3], [5,6,1]);
        let withoutMergeDuplication = Race.mergeWithoutDuplication([1,5,2,4,6,3], [8,2,6,7]);
        should.equal(arraySum, 8);
        should.equal(arrayMix.length, 4);
        should.equal(nonArrayMix.length, 3);
        should.equal(withMergeDuplication.length, 6);
        should.equal(withoutMergeDuplication.length, 8);
        should.not.equal(arrayMix, [1,2,3]);
        should.equal(falseArrayMix instanceof Error, true);
        should.equal(nonArrayMix.length, 3);
    });
    it('should calculate bikers scores', function () {
        let races = [[5,3,4,2,1], [3,4,5,1,2], [1,2,5,3,4]];
        let race = new Race(1, 5, 3, 3, 2, [100, 80, 60, 40, 30], races);
        let noSwitchResult = race.noSwitching();
        let randomSwitchResult = race.randomSwitching();
        should.exist(noSwitchResult);
        should.exist(randomSwitchResult);
    });
    it('should calculate results', async function () {
        await main.computeRace(3, 'random-switching');
    });
});

