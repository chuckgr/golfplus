/**
 * Class to build the player stats page
 * 
 * Stats to compile in no order:
 * - Total rounds
 * - Tournaments played/completed
 * - Lowest score on each course
 * - Highest score on each course
 * - Avg score for a course/ overall average
 * 
 * TODO - Complete and test
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product. 
 */
class Stats {
  constructor() {
    this._tournaments = new Tournaments();
    this._playerRnds = new PlayerRounds();
    this._roundsByPlayer = [];
    this._playersSummary();
  }

  /**
   * Get the stats for the rounds played
   */
  _getRoundsPlayed() {
    return this._playerRnds.getNumRounds();
  }

  /**
   * Get number of tournaments played
   */
  _getTournamentsPlayed() {
    return this._tournaments.getTournaments().length;
  }

  /**
   * Get the number of players
   */
  _getNumOfPlayers() {
    return this._getRoundsByPlayer().size;
  }

  /**
   * Create a summary table
   */
  getSummary() {
    let rndsByLevel = this._getNumberOfRoundsByLevel();
    return [["Rounds Played", this._getRoundsPlayed()],["Amatuer Rounds", rndsByLevel.amatuer], ["Pro Rounds", rndsByLevel.pro], ["Tournaments Played", this._getTournamentsPlayed()], ["Number of Players", this._getNumOfPlayers()]];
  }

  /**
   * Get the player stats
   * 
   * @return {Map} A map with the play name as key, rounds in array as the value
   */
  _getRoundsByPlayer() {
    let plyers = new Map();

    /**  Loop for all of the rounds and save rounds per player */
    for (const r of this._playerRnds) {
      if (plyers.has(r.getName())) {
        this._roundsByPlayer = plyers.get(r.getName());
        this._roundsByPlayer.push(r);
      } else {
        this._roundsByPlayer.push(r);
      }
      plyers.set(r.getName(), this._roundsByPlayer);
      this._roundsByPlayer = [];
    }

    /** Sort each player rounds by date */
    plyers.forEach( (k,v) => { 
      k.sort((a,b) => a.getTimeStamp() - b.getTimeStamp());
    });

    return plyers;
  }

  /**
   * Create a array of the courses played and when
   */
  _getCoursesPlayed() {
    let t = new Tournaments();
    let coursesPlayed = new Map();
    let ta = t.getTournaments();
    let rounds = [];
    let tmpData = {};

    ta.forEach(t => {
      rounds = t.rounds;
      rounds.forEach(r => {
        if (coursesPlayed.has(r.course)) {
          tmpData = coursesPlayed.get(r.course);
          tmpData.count = tmpData.count+1;
          tmpData.date = Math.max(tmpData.date, r.date);
          coursesPlayed.set(r.course, tmpData);
        } else {
          coursesPlayed.set(r.course, {"count":1, "date":r.date});
        }
      });
    });
    /** Convert Map object to multi-dimentional array */
    //let courseAry = [["Course", "Times Played", "Last played"]];
    let courseAry = [];
    for (const [key, value] of coursesPlayed) {
      courseAry.push([key, value.count, new Date(value.date).toLocaleDateString()]);
    }

    /** Sort the array of courses by date, oldest first */
    //courseAry.sort((a,b) => a[1] - b[1]); // Sorts on times played, low -> high
    courseAry.sort((a,b) => new Date(a[2]).getTime() - new Date(b[2]).getTime()); // Sorts on date, old to new
    //courseAry.forEach(c => console.log(`${c[0]} ${c[1]} ${c[2]}`));

    return courseAry;
  }

  /**
   * Create the data for the player table
   */
  _playersSummary() {
    let playersData = [];
    let playerInfo = [];
    let prds = this._getRoundsByPlayer();
    prds.forEach( (k,v) => {
      //console.log(`Player:${v} Rounds:${k}`); 
      playersData.push(v); /** Player name */
      playersData.push(k.length); /** Number of rounds */
      /** Loop through all of the player scores to get best score */
      let bestScore = 999;
      k.forEach(r => {
        bestScore = Math.min(bestScore, r.getScore());
        //console.log(` ${new Date(r.getTimeStamp()).toLocaleDateString()} \t${tournaments.getTournamentNameById(r.getNumber())}  \t${r.getScore()}`)});
      });
      playersData.push(bestScore); /** Best score */
      playersData.push(tournaments.getTournamentNameById(k[k.length-1].getNumber())); /** Name of last tournament */
      playersData.push(k[k.length-1].getTimeStamp().toLocaleDateString()); /** Date of last tournament */
      playerInfo.push(playersData);
      playersData = [];
    });

    /** Sort on last tournament played */
    playerInfo.sort((a,b) => new Date(b[4]).getTime() - new Date(a[4]).getTime()); // Sorts on date, old to new
    return playerInfo;
  }

  /**
   * Get the number of tourny rounds "Pro" and "Amateur"
   * 
   * @return {object} Keys Pro and Amateur with number of rounds for each
   */
  _getNumberOfRoundsByLevel() {
    let tournys = this._tournaments.getTournaments();
    let tRnds = []
    let proRnds = 0;
    let amRnds = 0;
    let novRnds = 0;
    tournys.forEach(t => {
      tRnds = t.rounds;
      tRnds.forEach(r => {
        if (r.level == "Pro") {
          proRnds += 1;
        } else if (r.level == "Amateur") {
          amRnds += 1;
        } else {
          novRnds += 1;
        }
      });
    });
    return {"amatuer": amRnds, "pro": proRnds, "novice": novRnds};
  }

  /**
   * Return all of the stats tables
   * 
   * @return {object} Object with a key for each table to be added to the stats page
   */
  getStats() {
    return {"coursesPlayed":this._getCoursesPlayed(), "summary":this.getSummary(), "playersSum": this._playersSummary()};
  }
}