class Race {

	constructor(nRaces, nVirtualBikers) {
		this.nRaces = nRaces;
		this.nVirtualBikers = nVirtualBikers;
		this.bikers = [];
		this.scoreTrack = [];
	}

	getTotalScore() {
		let scoreSum = 0;
		for (let i = 0; i < this.scoreTrack.length; i++) {
			for (let j = 0; j < this.scoreTrack[i].length; j++) {
				scoreSum += this.scoreTrack[i][j];
			}
		}
		return scoreSum;
	}

	getScoreTrack() {
		return this.scoreTrack;
	}

	getAllRaces() {
		if (this.bikers.length > this.nRaces)
			throw new Error("Number of computed races isn't valid");
		return this.bikers;
	}

	getNewestBikers() {
		let index = this.bikers.length-1;
		return this.bikers[index].slice();
	}

	addScoreTrack(scoreArray) {
		if (scoreArray.length > this.nVirtualBikers)
			throw new Error("Invalid number of computer scores");
		this.scoreTrack.push(scoreArray)
	}

	addNewBikers(bikers) {
		if (bikers.length > this.nVirtualBikers)
			throw new Error("Larger virtual team than allowed");
		this.bikers.push(bikers);
	}

}

module.exports.Race = Race;