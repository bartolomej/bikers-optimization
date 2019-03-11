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
    let race = {
      bikers: [Race.randomNumbers(this.nVirtualBikers, this.nBikers)],
      scoreSum: 0,
      scoreList: [],
      scoreSumList: []
    };
    for (let i = 0; i < this.races.length; i++) {
      let scores = this.getBikersScore(this.races[i], race.bikers[i]);
      let nSwitches = Race.random(this.nSwitches);
      let newBikers = Race.randomNumbers(nSwitches, this.nBikers);
      race.bikers.push(this.randomBikersMix(this.races[i], newBikers));
      race.scoreSum += Race.getArraySum(scores);
      race.scoreList.push(scores);
      race.scoreSumList.push(race.scoreSum);
    }
    this.computed.push({type: 'random-switching', result: race});
    return race;
  }

  computationalSwitching() {
    let race = {
      bikers: [Race.randomNumbers(this.nVirtualBikers, this.nBikers)],
      scoreSum: 0,
      scoreList: [],
      scoreSumList: []
    }
    // TODO: compute the most significant switching for every race
    // TODO: fire multiple instances of algorithm
    // TODO: log already computed possibilities
  }

  randomBikersMix(oldBikers, newBikers) {
    if (newBikers.length === 0) return oldBikers;
    if (newBikers.length > this.nSwitches)
      return new Error('More switched bikers than allowed');
    newBikers = Race.mergeWithoutDuplication(oldBikers, newBikers);
    let randoms = Race.randomNumbers(newBikers.length - 1, oldBikers.length - 1);
    let j = 0;
    for (let i = 0; i < oldBikers.length; i++) {
      if (randoms.includes(i)) {
        oldBikers[i] = newBikers[j];
        j++;
      }
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
    let finalArray = [];
    for (let i = 0; i < input.length; i++)
      if (!target.includes(input[i])) finalArray.push(input[i]);
    return finalArray;
  }

  static randomNumbers(number, max) {
    let numbers = [];
    if (number >= max) return new Error("Cant generate distinct numbers");
    for (let i = 0; i < number; i ++) {
      let randNumber = Math.floor(Math.random() * max);
        while (numbers.includes(randNumber))
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