const fs = require('fs');
const INPUTS_DIR = __dirname + '/../inputs/';
const OUTPUTS_DIR = __dirname + '/../results/';


function parseData(fileData) {
  let orderedRaces = [];
  let rawRaces = fileData.split('\n\n');
  for (let i = 1; i < rawRaces.length; i++) {
    let rawRace = rawRaces[i].split('\n');
    let orderedRace = { stats: {}, points: [], orderedRaces: []};
    for (let j = 0; j < rawRace.length; j++) {
      let orderedRow = rawRace[j].split(' ').map(value => Number.parseInt(value));
      if (j === 0)
        orderedRace.stats = {
            T: orderedRow[0],
            n: orderedRow[1],
            d: orderedRow[2],
            k: orderedRow[3],
            m: orderedRow[4]
        };
      else if (j === 1) orderedRace.points = orderedRow;
      else orderedRace.orderedRaces.push(orderedRow);
      }
      orderedRaces.push(orderedRace);
    }
    return orderedRaces;
}

function stringifyData(raceId, arrayOfRaces) {
    let parsedString = '' + raceId + '\n';
    for (let i = 0; i < arrayOfRaces.length; i++) {
        for (let j = 0; j < arrayOfRaces[i].length; j++) {
            parsedString += arrayOfRaces[i][j];
            parsedString += ' ';
        }
        parsedString += "\n";
    }
    return parsedString;
}

function saveJsonData(object, filename) {
  return new Promise(resolve => {
      fs.writeFile(INPUTS_DIR + filename, JSON.stringify(object, null, 2), 'utf8',
          (err, success) => {
            if (err) return resolve(err);
            else return resolve(success);
      });
  })
}

function saveData(object, filename) {
    return new Promise(resolve => {
        fs.writeFile(OUTPUTS_DIR + filename + '.txt', object, 'utf8',
            (err, success) => {
                if (err) return resolve(err);
                else return resolve(success);
            });
    })
}

function getFileData(filename) {
  return new Promise((resolve => {
    const fileStream = fs.createReadStream(INPUTS_DIR + filename);
    let fileData = '';
    fileStream.on('data', data => fileData += data);
    fileStream.on('error', err => err);
    fileStream.on('end', () => resolve(fileData))
  }));
}

function getJsonFileData(filename) {
    return new Promise((resolve => {
        const fileStream = fs.createReadStream(INPUTS_DIR + filename + '.json');
        let fileData = '';
        fileStream.on('data', data => fileData += data);
        fileStream.on('error', err => console.error(err));
        fileStream.on('end', () => resolve(JSON.parse(fileData)))
    }));
}

module.exports = {
    parseData: parseData,
    saveData: saveData,
    getFileData: getFileData,
    stringifyData: stringifyData,
    getJsonFileData: getJsonFileData
};