const fs = require('fs');
const path = require('path');

const directory = '../../results/';

(function() {
    clean();
})();

function clean() {
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        let bestResults = [];
        for (const file of files) {
            let search = file.split("_");
            let raceId = Number.parseInt(search[1]);
            let score = Number.parseInt(search[2]);
            if (bestResults[raceId-1] === undefined ||
                bestResults[raceId-1] < score) bestResults[raceId-1] = score;
        }
        console.log('best results: ', bestResults);
        for (const file of files) {
            let search = file.split("_");
            let score = Number.parseInt(search[2]);
            if (!bestResults.includes(score)) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        }
    });
}

module.exports = {
    clean: clean
}