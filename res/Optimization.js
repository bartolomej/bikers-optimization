const utils = require('./utils');
const Race = require('./Race').Race;

/**
 *  T -> test case number
 *  n -> total number of bikers
 *  d -> total number of races
 *  k -> size of virtual team
 *  m -> max number of bikers you can switch
 */
class Optimization {

  constructor(id, nBikers, nVirtualBikers, nRaces, nSwitches, points, races) {
    this.id = id;
    this.nBikers = nBikers;
    this.nRaces = nRaces;
    this.nVirtualBikers = nVirtualBikers;
    this.nSwitches = nSwitches;
    this.points = points;
    this.races = races;
  }

  randomSwitching(gradientSteps = 1, useMaxSwitches = false) {
    let race = new Race(this.nRaces, this.nVirtualBikers);
    let initialBikers = utils.randomDistinctNumbers(this.nVirtualBikers, this.nBikers);
    race.addNewBikers(initialBikers);
    race.addScoreTrack(this.getBikersScore(initialBikers, this.races[0]));
    for (let i = 1; i < this.nRaces; i++) {
      let cache = {};
      for (let j = 0; j < gradientSteps; j++) {
        let nSwitches = utils.random(this.nSwitches);
        if (useMaxSwitches) nSwitches = this.nSwitches;
        let oldBikers = race.getNewestBikers();
        let newBikers = utils.randomDistinctNumbers(nSwitches, this.nBikers, oldBikers);
        let mergedBikers = this.randomBikersMix(oldBikers, newBikers);
        let scoreTrack = this.getBikersScore(mergedBikers, this.races[i]);
        let scoreSum = utils.getArraySum(scoreTrack);
        if (cache.score === undefined || scoreSum > cache.score) {
          cache.score = scoreSum;
          cache.bikers = mergedBikers;
          cache.scoreTrack = scoreTrack;
        }
      }
      race.addNewBikers(cache.bikers);
      race.addScoreTrack(cache.scoreTrack);
    }
    return race;
  }

  iterativeSwitching(gradientSteps = 1) {
    let race = new Race(this.nRaces, this.nVirtualBikers);
    let initialBikers = [];
    for (let i = 0; i < this.nVirtualBikers; i++)
      initialBikers.push(this.races[0][i]);
    race.addNewBikers(initialBikers);
    race.addScoreTrack(this.getBikersScore(initialBikers, this.races[0]));
    for (let i = 1; i < this.nRaces; i++) {
      let cache = {};
      for (let j = 0; j < gradientSteps; j++) {
        let oldBikers = race.getNewestBikers();
        let newBikers = this.iterativeBikersMix(oldBikers, this.races[i]);
        let scoreTrack = this.getBikersScore(newBikers, this.races[i]);
        let scoreSum = utils.getArraySum(scoreTrack);
        if (cache.score === undefined || scoreSum > cache.score) {
          cache.score = scoreSum;
          cache.bikers = newBikers;
          cache.scoreTrack = scoreTrack;
        }
      }
      race.addNewBikers(cache.bikers);
      race.addScoreTrack(cache.scoreTrack);
    }
    return race;
  }

  randomBikersMix(oldBikers, newBikers) {
    let mixedBikers = [];
    let merge = utils.mergeWithoutDuplication(oldBikers, newBikers);
    if (merge.length === this.nVirtualBikers) return merge;
    let elected = utils.randomDistinctNumbers(this.nVirtualBikers, merge.length-1);
    for (let i = 0; i < elected.length; i++) {
      let index = elected[i];
      mixedBikers.push(merge[index]);
    }
    return mixedBikers;
  }

  iterativeBikersMix(oldBikers, race) {
    let mixedBikersMix = oldBikers.slice();
    let switchCount = 0;
    for (let i = 0; i < race.length; i++) {
      if (switchCount >= this.nSwitches) break;
      if (!oldBikers.includes(race[i])) {
        mixedBikersMix.push(race[i]);
        switchCount++;
      }
    } 
    for (let i = race.length; i > 0; i--) {
      if (switchCount <= 0) break;
      let index = mixedBikersMix.indexOf(race[i]);
      if (index > -1) {
        mixedBikersMix.splice(index, 1);
        switchCount--;
      }
    }
    return mixedBikersMix;
  }

  getBikersScore(bikers, race) {
    let scores = [];
    for (let i = 0; i < bikers.length; i++) {
      for (let j = 0; j < race.length; j++) {
        if (race[j] === bikers[i]) {
          if (this.points[j] === undefined) scores.push(0);
          else scores.push(this.points[j]);
        }
      }
    }
    return scores;
  }

}

module.exports.Optimization = Optimization;