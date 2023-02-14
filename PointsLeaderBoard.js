/**
 * Contains the data/methods for creating the points leaderboard for a set of tournaments
 * in Golf+ for fun.
 * 
 * Each leaderboard is completely rewritten every time for each leaderboard selected
 * Typical use case are: print the current points board after each round and then
 * final leaderboard at the end of the tournament.                             
 * 
 * @param {PlayerRound[]} ? Array of player rounds for this leaderboard or should we just get PlayerRounds class?
 * TODO - 
 *      - What function/methods can be shared with LeaderBoard class
 *        - undetermined and will be evaluated at creation time 
 *      - Make sure we take into account ties
 *        - Do we give them the same point value and then reduce later (10 10 6)? or
 *          we go straight down (10 10 8?)
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.
 */
class PointsLeaderboard {
  
  constructor() {
    //this._data = data;
    this._sheetName = "GPFT Points Leaderboard";
    this._pointsSheet;
    this._tournaments = [23.02,23.03,23.04,23.05,23.06,23.07,23.08];
    this._tableData = [];
    
    // Define settings
    this._numCols = 6;
    this._headerRowStart = 2;
    this._headerColStart = 2;
    this._headerRows = 2;
    this._headerTitle = [["Golf+ fun Points Leaderboard"]];
    this._headerColor = "#dcfaf5";
    this._alternatingRowColor = "#f2f9fa" 
    this._headerTitleFontStyle = [["bold"]];
    this._headerTitleFontSize = 14;
    this._headerColumnTitles = [["Rank", "Name", "Points", "Events", "# Wins","Top Three"]];
    this._headerHorizAlign = [["center", "center", "center", "center", "center", "center"]];
    this._dataHorizAlign = [["center", "left", "center", "center", "center", "center"]];
    this._headerColumnTitlesFontSize = 12;
    this._headerColumnTitlesFontStyles = [["bold", "bold", "bold", "bold", "bold", "bold"]];
    this._fontName = "Trebuchet MS"; // "Roboto Mono" "Comfortaa"
    this._dataRowStart = this._headerRowStart+this._headerRows;
    this._dataColStart = this._headerColStart;
    this._dataFontSize = 12;

    // Kick things off
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

    // Add the data
    this._buildLeaderBoard(leaderBoardData, this._createSheet());

    // Format the sheet
    //this._formatSheet(this._pointsSheet);
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
    return this._pointsSheet;
  }

  /**
   * Clear tbe sheet before adding new data
   */
  _clearSheet() {
    if (this._pointsSheet.getLastRow()>0) {
      this._pointsSheet
        .getRange(1, 1, this._pointsSheet.getLastRow(), this._pointsSheet.getLastColumn())
        .clear();
    }
  }


  /**
   * Populate the sheet with the data     
   */
  _calculateScores(tournyData) {
    let points = [8, 6, 4];
    let pp;
    let tmpPP;
    let done = false;
    
    // Look at each tournament and calculate points
    tournyData.forEach( (v,k,m) => {
      // Loop for all the tournament data that is already sorted
      index = 0;
      v.forEach( (t,i) => {
        // See if we have this player yet
        tmpPP = this._tableData.findIndex(p => p._name == t.name);
        if (tmpPP != -1) {
          pp = this._tableData[tmpPP];
        } else {
          pp = new PlayerPoints(t);
        }

        pp.events = pp.events+1;
        if (i < 3) {
          pp.topfive = pp.topfive+1;  
        } 

        // Determine the points if there are ties
        switch (i) {
          case 0:
            pp.wins = pp.wins+1;
            if (v[0].score === v[1].score && v[0].score === v[2].score) {
              pp.points = pp.points + points[i+2];
              done = true;
            } else if (v[0].score === v[1].score) {
              pp.points = pp.points + points[i+1];
            } else {
              pp.points = pp.points + points[i];
            }
            break;
          case 1:
            console.log(`Case 1: ${v[1].name}`);
            if (!done) {
              if (v[1].score === v[0].score) {
                pp.wins = pp.wins+1;
              }
              if (v[1].score === v[2].score) {
                pp.points = pp.points + points[i+1];
              } else {
                pp.points = pp.points + points[i];
              }
            } else {
              pp.points = pp.points + points[i+1];
            }
            break;
          case 2:
            pp.points = pp.points + points[i];
            break;
          default:
            pp.points = pp.points + 1;
        }

        if (tmpPP > -1) {
          this._tableData.splice(tmpPP,1,pp);
        } else {
          this._tableData.push(pp);
        }
      });

    });
    this._tableData.sort((a,b) => b.points - a.points);
    return this._tableData;
  }

  /**
   * Slice up the data into tournaments and create the data structures to be used by 
   * the pointleaderboard
   * 
   * @return {Map} Map containing the table data for the points spreadsheet by tournament number
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
   * Take the calculated points data and add it to the newly created sheet
   */
  _buildLeaderBoard(tournyBoards, sheet) {
    // Clear the sheet first
    this._clearSheet();

    // Turn off grid lines
    sheet.setHiddenGridlines(true);

    // Set the header rows
    this._setHeader(sheet);

    // Add in the data
    this._addData(tournyBoards, sheet);

    // Format the data area 
    sheet.autoResizeColumns(this._headerColStart+1, this._numCols);

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
   * Take passed data and add it to the spreadsheet
   * 
   * @param {PlayerPoints[]} data - 2d nx5 array of PlayerPoints objects for points leaderboard. 
   *                                n is the number of rows based on how many players have 
   *                                a played in a tournament. 
   */
  _addData(data, sheet) {
    let dataAry = [];
    data.forEach(p => dataAry.push(p.toArray()));
    dataAry.map((r,i) => r[0]=i+1);

    // Add the number of rows for the new data 
    sheet
      .insertRows(this._dataRowStart, dataAry.length+1);

    // Insert the data and format it    
    sheet
      .getRange(this._dataRowStart,this._dataColStart, dataAry.length, dataAry[0].length)
      .setFontFamily(this._fontName)
      .setFontSize(this._dataFontSize)
      .setHorizontalAlignments(createValueArray(dataAry.length, 6, "center"))
      .setValues(dataAry);

    sheet
      .getRange(this._dataRowStart,this._dataColStart, dataAry.length, dataAry[0].length)
      .applyRowBanding()
      .setHeaderRowColor("white")
      .setFirstRowColor(this._alternatingRowColor) // #faf8c8-yellow #edf2fa-blue
      .setSecondRowColor("white");

    sheet
      .getRange(this._dataRowStart, this._dataColStart+1, dataAry.length, 1)
      .setHorizontalAlignments(createValueArray(dataAry.length, 1, "right"));
  }

  /**
   * Add the header row(s)
   */
  _setHeader(sheet) {
    // Set the header title, color, and merge cols
    sheet
      .getRange(this._headerRowStart, this._headerColStart, 1, 1)
      .setBackground(this._headerColor)
      .setFontWeight(this._headerTitleFontStyle)
      .setFontSize(this._headerTitleFontSize)
      .setFontFamily(this._fontName)
      .setHorizontalAlignment(createValueArray(1,1, "center"))
      .setValues(this._headerTitle);

    // Merge the header title
    sheet
      .getRange(this._headerRowStart, this._headerColStart, 1, this._numCols)
      .merge()

    // Set the column header title
    sheet
      .getRange(this._headerRowStart+1, this._headerColStart, 1, 6)
      .setBackground(this._headerColor)
      .setFontWeight(this._headerColumnTitleFontStyle)
      .setFontSize(this._headerColumnTitlesFontSize)
      .setFontFamily(this._fontName)
      .setHorizontalAlignments(this._headerHorizAlign)
      .setValues(this._headerColumnTitles);   
  }
}