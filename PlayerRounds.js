/**
 * Contains all of the plyer rounds played so far
 * 
 * @param {object} - Parameters for this round in the passed object
 *                   {course} - Course played
 *                   {date}   - Date round was played
 *                   {score}  - Score for the round
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product. 
 */
class PlayerRounds {
  constructor(data) {
    this._rounds = new Array();
    if (data == null) {
      this._parse();
    } else {
      this._rounds = data;
    }
  }

  /**
   * Parse the records from the spreadsheet
   */
  _parse() {
    this._data = SpreadsheetApp.getActiveSpreadsheet()
                .getSheetByName('Form Responses')
                .getDataRange()
                .getValues();
    // Remove the header row
    this._data = this._data.slice(1);

    /** Rip through the rows and create a PlayerRound object for each player record */
    let playerRec;
    this._data.forEach((t,i) => { 
      playerRec = new PlayerRound(t);
      this._rounds.push(playerRec);
    });
  }

  /**
   * Get all records for a round
   * 
   * @param {string} date - String in mm/dd/yyyy format to retreive records for
   * @return {array} - Array of selected PlayerRound object
   */
  getRoundsByDate(date) {
    let weekNumber = getWeekNumber(date);
    let roundWeekNumber;
    let playerRecords = new Array();
    this._rounds.forEach((r) => {
      roundWeekNumber = getWeekNumber(r.getDate());
      if (weekNumber == roundWeekNumber) {
        playerRecords.push(r);
      }
    });
    return playerRecords;
  }

/**
   * Get all records for a round
   * 
   * @param {number} - Tournament number String in yy.tt format to retreive records for
   * @return {array} - Array of selected PlayerRound object
   */
  getRoundsByNumber(number) {
    let playerRecords = new Array();
    this._rounds.forEach((r) => {
      if (r.getNumber() == number) {
        playerRecords.push(r);
      }
    });
    return playerRecords;
  }

  /**
   * Get all records for a player
   * 
   * @param {string} player to return data for
   */
  getRoundsByName(name) {
    return this._rounds.filter((p) => p.getName() == name );
  }

  /**
   * Filter the data to return the results that match the filter expression
   * 
   * @param {string}  - Field to filter the results to
   * @param {string}  - Filter criteria for the field that is being filtered
   * @return {PlayerRounds} new PlayerRounds object with the fitered PlayerRound objects 
  */
  filter(field, criteria) {
    return new PlayerRounds (this._rounds.filter( (r) => {
      return r.getField(field) == criteria}));
  }

  /**
   * Get the number of rounds for this PlayerRounds object
   */
  getNumRounds() {
    return this._rounds.length;
  }

  /**
   * Get an array of all of the players that have a round logged
   * 
   * @return {Array} Array of all of the players with at leaset one round
   */
  getPlayers() {
    let plyers = new Set();
    let pArray = [];
    this._rounds.forEach(r => {
      plyers.add(r.getName());
    });
    plyers.forEach( v => pArray.push(v));
    pArray.sort();
    return pArray;
  }

  /**
   * Make this object implenent the iterator interface so we can loop over the list
   */
  [Symbol.iterator]() {
    let index = -1;
    let data  = this._rounds;

    return {
      next: () => ({ value: data[++index], done: !(index in data) })
    };
  };
}
  