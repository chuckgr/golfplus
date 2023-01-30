/**
 * Tournaments for the Golf+ for fun group
 *
 * This object will read in the spreadsheet for the settings for each tounament 
 */
class Tournaments {
  constructor() {
    this._tournaments = new Map();
    this._loadData();
  }

  /** 
   *  Load all of the tournament data from the Tournament spreadsheeet
   */
  _loadData() {
    this._data = SpreadsheetApp.getActiveSpreadsheet()
                .getSheetByName('Tournament Settings')
                .getDataRange()
                .getValues();
    // Remove the header row
    this._data = this._data.slice(1);

    // Rip through the rows and create a TournamentRound object for each tournament
    let tr;
    let tmpRec;
    let tourny;
    this._data.forEach((t,i) => {
      tr = new TournamentRound(t);
      if (tr.isValid()) {
        if (this._tournaments.has(tr.number)) {
          tmpRec = this._tournaments.get(tr.number);
          tmpRec.add(tr);
          this._tournaments.set(tr.number, tmpRec);
        } else {
          tourny = new Tournament(tr.number);
          tourny.add(tr);
          this._tournaments.set(tr.number, tourny);
        }
      }
    });
  }

  /**
   * Get tournament by ID
   */
  getTournamentById(id) {
    return this._tournaments.get(id);
  }

  /**
   * Get all the tournaments
   * 
   * @return {array} 2D Array for each tournament
   */
  getTournaments() {
    let returnAry = [];
    this._tournaments.forEach(t => returnAry.push(t));
    return returnAry;
  }

  /**
   * Get all of the tournament numbers 
   */
  getNumbers() {
    let returnAry = [];
    this._tournaments.forEach(t => returnAry.push(t.number));
    return returnAry;
  }

  /**
   * Get the number of defined tournament rounds. Since they are not defined ahead of time
   * we can use this to determine if a round was missed by a player
   */
  getNumberOfCourses() {

  }

  /**
   * Get the tournament that is currrently in process
   * 
   * @return {Tournament} Return the tournament object for the current week
   */
  getCurrentTournament() {
    let currentTourny;
    let rounds;
    this._tournaments.forEach(t => {
      rounds = t.rounds;
      rounds.forEach(r => {
        if (getWeekNumber(r.date) == getCurrentWeekNumber()) {
          currentTourny = t;
        }       
      });
    }); 
    return currentTourny;
  }

  /**
    * Print out the tournaments
    */
  toString() {
    let rec;
    for (const [key, value] of this._tournaments) {
      console.log(`${key}: ${value.toString()}`);
    } 
  } 

}