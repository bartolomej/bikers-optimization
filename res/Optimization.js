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
    race.addNewBikers(utils.randomDistinctNumbers(this.nVirtualBikers, this.nBikers));
    for (let i = 0; i < this.nRaces-1; i++) {
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