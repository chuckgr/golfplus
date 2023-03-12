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
  constructor(tournyNumber) {
    this._number = tournyNumber;
    this._name = "";
    this._rounds = new Array();
    this._valid = false;
  }

  /**
   * Parse the data passed and put in individual variables
   * 
   * @param {TournamentRound} tournyRound - Contains a round for the current tournament 
   */
  add(tournyRound) {
    this._name = tournyRound.name;
    this._rounds.push(tournyRound);
  }

  /**
   * Get the settings for all the rounds defined in the tournament
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
   * Get the number of rounds defined for this tournament
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
   */
  get leaderboardData() {
    let rounds = [];
    let leaderboard = [];
    let found = false;
    let playerName;
    let playerScores = new Array(4);
    const pr = new PlayerRounds();
    const players = new Players();  

    // Get the records for each of the tournament rounds and the course data for the footer
    this._rounds.forEach((r) => {
      rounds = [...rounds, ...pr.getRoundsByNumber(r.number)];
    });

    // Get the records for the players in the player database
    let playerList = players.getPlayers();
    playerList.forEach( (p,i) => {
      if (found) { leaderboard.push([playerName, ...playerScores]);}
      playerName = p;
      found = false;
      // Preload scores so sort will work for missing scores
      playerScores = [999, 999, 999, 999];
      rounds.forEach((r) => {
        if (r.getName().trim() == p.trim()) {
          found = true;
          playerScores[r.getRound()-1] = r.getScore();
        }
      });
    });
    return leaderboard;
  }

  /**
   * Get the latest round date, in milliseconds, for the status display on the web
   */
  get latestRoundDate() {
    let latestDate = 0;
    let prs = new PlayerRounds().filter(PlayerRound.NUMBER, this._number);
    //let rounds = pr.filter(PlayerRound.NUMBER, 23.07);
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
    this._rounds.forEach((r,i) => tmp=tmp+`Tournament:toString ${i} ${r.number} ${this._rounds.length}`);
    return tmp;
  }
}