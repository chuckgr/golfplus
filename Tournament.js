/**
 * Contains the data/methods for a tournament in Golf+ for fun
 * which consists of 4 TournamentRounds
 * 
 * @param {object} tournyNumber - contains the number for this tournament
 *  
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.                              
 */
class Tournament {
  /**
   * @param {number} Number of this tournament
   */
  constructor(tournyNumber) {
    this._number = tournyNumber;
    this._name = "";
    this._rounds = new Array();
    this._valid = false;
    this._status;
  }

  /**
   * Parse the data passed and put in individual variables
   * 
   * @param {TournamentRound} tournyRound - Contains a round for the current tournament 
   */
  add(tournyRound) {
    this._name = tournyRound.name;
    this._status = tournyRound.status;
    this._rounds.push(tournyRound);
  }

  /**
   * Add in handicaps for this tournament 
   * 
   * @param {array} Array of Handicap objects for this tournament
   */
  addHandicaps(handicaps) {
    this._handicaps = new TournamentHandicap(handicaps);
  }

  /**
   * Get the settings for all the rounds defined in the tournament
   * 
   * @return {array} Array of all of the rounds for this tournament
   */
  get rounds() {
    return this._rounds;
  }

  /**
   * Return the tournament number
   * 
   * @return {number} tournament number assigned to this tournament
   */
  get number() {
    return this._number;
  }

  /**
   * Get the name of the tournament
   * 
   * @return {string} Name of this tournament
   */
  get name() {
    return this._name;
  }

  /**
   * Return the status of the tournament 
   * 
   * @return {string} Status as "Complete", "In-progress", or "Open"
   */
  get status() {
    return this._status;
  }

  /**
   * Get the number of rounds defined for this tournament
   * 
   * @return {number} Number of rounds for this tournament
   */
  get definedRounds() {
    return this._rounds.length;
  }

  /**
   * Get the dates for a tournament 
   * 
   * @return {srtring[]} Array of date strings for the tournament 
   */
  get tournamentDates() {
    let roundDates = new Array();
    this.rounds.forEach( r => roundDates.push(r.date));
    return roundDates;
  } 

  /**
   * Create the tournament leaderboard data (table of players and scores with totals and score to par)
   * 
   * @param {string} Type of leaderboard to return; net or handicap
   */
  leaderboardData(type) {
    let rounds = [];
    let playerMap = new Map();  // key=name, value=[r1,r2,r3,r4]
    let leaderboard = [];
    const pr = new PlayerRounds();

    /** Get the records for each of the tournament rounds and the course data for the footer  */
    this._rounds.forEach((r) => {
      rounds = [...rounds, ...pr.getRoundsByNumber(r.number)];
    });

    /** Loop for all of the rounds logged for this tournament */
    let tmpPlr = [];
    let tmpStrokes = 0;
    rounds.forEach(r => {
      if (playerMap.has(r.getName())) {
        tmpPlr = playerMap.get(r.getName());
      } else {
        tmpPlr = [999,999,999,999];
      }
      /** Get the strokes based on handicap */
      let strokeType = "amateur";
      /** TODO - Fix this, not always going to be round 3, duh! */
      if (r.getRound()==3) { strokeType = "pro"}
      tmpStrokes = (type=='handicap') ? this._handicaps.getStrokes(r.getName(), strokeType) : 0;
      //console.log(`Player=${r.getName()} strokes=${tmpStrokes} level=${this._rounds[r.getRound()-1].level} score=${r.getScore()}`);
      //tmpPlr[r.getRound()-1] = Math.floor((r.getScore() - tmpStrokes)*10)/10;
      tmpPlr[r.getRound()-1] = Number((r.getScore() - tmpStrokes).toPrecision(4));
      playerMap.set(r.getName(), tmpPlr);
    });

    /** Convert from a map to array for leaderboard and add username */
    let playerData = [];
    let newName = "";
    for (const [name, scores] of playerMap) {
      playerData = players.getPlayerData(name)[0];
      playerData.userName == "" ?  newName = name : newName = `${name} (@${playerData.userName})`;
      leaderboard.push([newName, ...scores]);
    }

    return leaderboard;
  }

  /**
   * Get the latest round date, in milliseconds, for the status display on the web
   */
  get latestRoundDate() {
    let latestDate = 0;
    let prs = new PlayerRounds().filter(PlayerRound.NUMBER, this._number);
    for (let r of prs) {
      latestDate = Math.max(latestDate, new Date(r.getTimeStamp()).getTime());
    }
    return latestDate;
  }

  /**
   * Check to see we have all required data for a valid tournament
   */
  isValid() {
    return this._rounds.length > 0;
  }

  /**
   * Print the settings out
   */
  toString() {
    let tmp = "";
    this._rounds.forEach((r,i) => tmp=tmp+` ${r.number} ${r.name}`);
    return tmp;
  }
}