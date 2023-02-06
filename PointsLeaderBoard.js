/**
 * Contains the data/methods for creating the points leaderboard for a set of tournaments
 * in Golf+ for fun.
 * 
 * Each leaderboard is completely rewritten every time for each leaderboard selected
 * Typical use case are: print the current points board after each round and then
 * final leaderboard at the end of the tournament.                             
 * 
 * @param {PlayerRound[]} ? Array of player rounds for this leaderboard or should we just get PlayerRounds class?
 * TODO - Determine what tournaments are in the points run (what is the key?)
 *        - Use the tournament number as the key
 *      - Determine the layout of the leaderboard
 *        rank name events points #wins #top5 points-behind
 *      - What function/methods can be shared with LeaderBoard class
 *        - undetermined and will be evaluated at creation time 
 *      - Make sure we take into account ties
 *        - Do we give them the same point value and then reduce later (10 10 6)? or
 *          we go straight down (10 10 8?)
 */
class PointsLeaderboard {
  
  constructor() {
    //this._data = data;
    this._sheetName = "FedEx Points Leaderboard";
    this._pointsSheet;
    this._tournaments = [23.01,23.02,23.03,23.04];
    this._tableData = [];
    this._go();
  }

  /**
   * Kick off the building of the sheet
   */
  _go() {
    // Rip through the data to create the tournament boards
    let tournyBoards = this._sliceData();

    // Calculate the stats and format them into an array
    let leaderBoardData = this._calculateScores(tournyBoards);

    // Create the sheet
    //this._createSheet();

    // Add the data
    //this._buildLeaderBoard(tournyBoards);

    // Format the sheet
    //this._formatSheet();
  }

  /**
   * Create the spreadsheet if not created
   */
  _createSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sn = `${this._sheetName}`;
    this._pointsSheet = ss.getSheetByName(sn);
    if (this._pointsSheet == null) {
      this._pointsSheet = ss.insertSheet(sn);
    }
  }

  /**
   * Populate the sheet with the data     
   */
  _calculateScores(tournyData) {
    let tournament;
    let points = [10, 8, 6, 4, 2];
    let index = 0;
    let pp;
    
    // Look at each tournament and calculate points
    tournyData.forEach( (v,k,m) => {
      console.log(`Map = ${k} ${v}`);
      // Loop for all the tournament data that is already sorted
      v.forEach( t => {
        pp = new PlayerPoints(t, k);
        pp.events = pp.events+1;
        pp.points = pp.points + points[index];
        if (index === 0) {
          pp.wins = pp.wins+1;
          pp.topfive = pp.topfive+1;
        } else if (index < 5) {
          pp.topfive = pp.topfive+1;
        }
        this._tableData.push(pp);
      });

    });
    console.log(`PLB:_buildLeaderBoard: ${JSON.stringify(this._tableData)}`);
  }

  /**
   * Slice up the data into tournaments and create the data structures to be used by 
   * the pointleaderboard
   * 
   * @return {Map} AMap containing the table data for the points spreadsheet by tournament number
   */
  _sliceData() {
    const playerRounds = new PlayerRounds();
    let numRounds = 0;
    let totalByPlayer = [];
    let total = 0;
    let fedex = new Map();

    // Loop for all of the tournaments eligble for leaderboard
    this.getTournamentNumbers().forEach( (t,i) => {
      let tournyRes = playerRounds.filter(PlayerRound.NUMBER, t);
      let plyrResults;
      // Loop for all players (players is a global Players object)
      for (let p of players) {
        // Grab all records from tournament for this player
        plyrResults = tournyRes.filter(PlayerRound.PLAYER, p);
        // We only count if there are 4 rounds played
        if (plyrResults.getNumRounds() == 4) { 
          for (let r of plyrResults) {
            total+= r.getScore();
          }
          numRounds = numRounds + plyrResults.getNumRounds();
          totalByPlayer.push({"name": p, "score": total});
          //console.log(`Player "${p}"" has ${plyrResults.getNumRounds()} rounds in ${t} tournament`);
        }    
        total = 0;
      }
      totalByPlayer.sort((a, b) => parseInt(a.score) - parseInt(b.score));
      fedex.set(t, totalByPlayer);
      totalByPlayer = [];
    });

    return fedex;
  }

  /**
   * Return the tounaments in this points leaderboard.  Will start off with pre-defined
   * hard coded torunament numbers, then we will put them in a setting
   * 
   * @return {array} Array of tournament numbers
   */
  getTournamentNumbers() {
    return this._tournaments;
  }

  /**
   * Format the data on the sheet
   */
  _formatSheet() {

  }
}