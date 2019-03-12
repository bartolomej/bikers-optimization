const utils = require('./utils');

/**
 *  T -> test case number
 *  n -> total number of bikers
 *  d -> total number of races
 *  k -> size of virtual team
 *  m -> max number of bikers you can switch
 */
class Optimization {

  constructor(id, nBikers, nVirtualBikers, nRaces, nSwitches, points, races) {
    this.id = id; // T
    this.nBikers = nBikers; // n
    this.nRaces = nRaces; // d
    this.nVirtualBikers = nVirtualBikers; // k
    this.nSwitches = nSwitches; // m
    this.points = points;
    this.races = races;
    this.computed = [];
  }

  randomSwitching() {
    const race = {
      bikers: [utils.randomNumbers(this.nVirtualBikers, this.nBikers)],
      scoreSum: 0,
      scoreList: [],
      scoreSumList: []
    };
    for (let i = 0; i < this.races.length; i++) {
      let scores = this.getBikersScore(this.races[i], race.bikers[i]);
      let nSwitches = utils.random(this.nSwitches);
      let oldBikers = race.bikers[i].slice();
      // try some random neighbors of newBikes -> if better switch
      let newBikers = utils.randomNumbers(nSwitches, this.nBikers, race.bikers[i]);
      // set class methods in Race
      race.bikers.push(this.randomBikersMix(oldBikers, newBikers));
      race.scoreSum += utils.getArraySum(scores);
      race.scoreList.push(scores);
      race.scoreSumList.push(race.scoreSum);
    }
    this.computed.push({type: 'random-switching', result: race});
    return race;
  }

  randomBikersMix(oldBikers, newBikers) {
    if (newBikers.length === 0) return oldBikers;
    if (newBikers.length > this.nSwitches)
      return new Error('More switched bikers than allowed');
    oldBikers.splice(0, newBikers.length);
    newBikers = utils.mergeWithoutDuplication(oldBikers, newBikers);
    for (let i = 0; i < oldBikers.length; i++) {
      let random1 = utils.random(newBikers.length-1);
      let random2 = utils.random(newBikers.length-1);
      let eleSwitch = newBikers[random1];
      newBikers[random1] = newBikers[random2];
      newBikers[random2] = eleSwitch;
    }
    return oldBikers;
  }

  getBikersScore(race, bikers) {
    let scores = [];
    for (let i = 0; i < bikers.length; i++) {
      for (let j = 0; j < race.length; j++) {
        if (race[j] === bikers[i])
          scores.push(this.points[j]);
        }
      }
    return scores;
  }

}

module.exports.Optimization = Optimization;