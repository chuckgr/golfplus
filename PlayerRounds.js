/**
 * Contains all of the plyer rounds played so far
 * 
 * @param {object} - Parameters for this round in the passed object
 *                   {course} - Course played
 *                   {date}   - Date round was played
 *                   {score}  - Score for the round
 */
class PlayerRounds {
  constructor() {
    this._rounds = new Array();
    this._parse();
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

    // Rip through the rows and create a TournamentRound object for each tournament
    let playerRec;
    let tmpRec;
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
      //console.log(`tournament week: ${weekNumber} round week number: ${roundWeekNumber}`);
      if (weekNumber == roundWeekNumber) {
        playerRecords.push(r);
      }
    });
    return playerRecords;
  }

/**
   * Get all records for a round
   * 
   * @param {number} - Trounament number String in yy.tt format to retreive records for
   * @return {array} - Array of selected PlayerRound object
   */
  getRoundsByNumber(number) {
    let roundWeekNumber;
    let playerRecords = new Array();
    this._rounds.forEach((r) => {
      roundWeekNumber = getWeekNumber(r.number);
      if (r.number == number) {
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
}
  