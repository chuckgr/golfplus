/**
 * Tournaments for the Golf+ for fun group
 *
 * This object will read in the spreadsheet for the settings for each tounament 
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.
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
   * Get tournament name by using the tournament id as a key
   */
  getTournamentNameById(id) {
    return this._tournaments.get(id).name;
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
   * Create the data array for courses for a tournament
   * 
   * @param {number} tournament to return the course data for
   */
  getCourseArray(tournament) {
    let retAry = [["Course"],["Par"],["Date"],["Tees"], ["Pins"], ["Greens"],["Wind"],["Level"]];
    this.getTournamentById(tournament).rounds.forEach((r) => {
      retAry[0].push(r.course);
      retAry[1].push(Courses.getPar(r.course));
      retAry[2].push(r.date);
      retAry[3].push(r.tees);
      retAry[4].push(r.pins);
      retAry[5].push(r.greens);
      retAry[6].push(r.wind);
      retAry[7].push(r.level);
    });
    return retAry;
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