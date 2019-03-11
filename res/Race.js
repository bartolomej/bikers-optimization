const helper = require('./utils');

/**
 *  T -> test case number
 *  n -> total number of bikers
 *  d -> total number of races
 *  k -> size of virtual team
 *  m -> max number of bikers you can switch
 */
class Race {

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

  noSwitching() {
    let race = {
      bikers: Race.randomNumbers(this.nVirtualBikers, this.nBikers),
      scoreSum: 0,
      scoreList: [],
      scoreSumList: []
    };
    for (let i = 0; i < this.races.length; i++) {
      let scores = this.getBikersScore(this.races[i], race.bikers);
      race.scoreSum += Race.getArraySum(scores);
      race.scoreList.push(scores);
      race.scoreSumList.push(race.scoreSum);
    }
    this.computed.push({type: 'no-switching', result: race});
    return race;
  }

  randomSwitching() {
    const race = {
      bikers: [Race.randomNumbers(this.nVirtualBikers, this.nBikers)],
      scoreSum: 0,
      scoreList: [],
      scoreSumList: []
    };
    for (let i = 0; i < this.races.length; i++) {
      let scores = this.getBikersScore(this.races[i], race.bikers[i]);
      let nSwitches = Race.random(this.nSwitches);
      let oldBikers = race.bikers[i].slice();
      let newBikers = Race.randomNumbers(nSwitches, this.nBikers, race.bikers[i]);
      race.bikers.push(this.randomBikersMix(oldBikers, newBikers));
      race.scoreSum += Race.getArraySum(scores);
      race.scoreList.push(scores);
      race.scoreSumList.push(race.scoreSum);
    }
    this.computed.push({type: 'random-switching', result: race});
    return race;
  }

  btureForce() {
    let race = {
      bikers: [Race.randomNumbers(this.nVirtualBikers, this.nBikers)],
      scoreSum: 0,
      scoreList: [],
      scoreSumList: []
    }
    // TODO: fire multiple instances of algorithm
    // TODO: log already computed possibilities -> dynamic programming
  }

  randomBikersMix(oldBikers, newBikers) {
    if (newBikers.length === 0) return oldBikers;
    if (newBikers.length > this.nSwitches)
      return new Error('More switched bikers than allowed');
    // switch some old biker with new one
    oldBikers.splice(1, newBikers.length); // TODO choose better algorithm
    newBikers = Race.mergeWithoutDuplication(oldBikers, newBikers);
    for (let i = 0; i < oldBikers.length; i++) {
      let random1 = Race.random(newBikers.length-1);
      let random2 = Race.random(newBikers.length-1);
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

  static mergeWithoutDuplication(target, input) {
    let finalArray = target;
    for (let i = 0; i < input.length; i++)
      if (!target.includes(input[i])) finalArray.push(input[i]);
    return finalArray;
  }

  static randomNumbers(number, max, except = []) {
    let numbers = [];
    if (number >= max) return new Error("Cant generate distinct numbers");
    for (let i = 0; i < number; i ++) {
      let randNumber = Math.floor(Math.random() * max);
        while (numbers.includes(randNumber) || except.includes(randNumber))
          randNumber = Math.floor(Math.random() * max);
        numbers.push(randNumber);
    }
    return numbers;
  }

  static random(max) {
    return Math.floor(Math.random() * (max+1));
  }

  static getArraySum(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) sum += array[i];
    return sum;
  }

}

module.exports.Race = Race;