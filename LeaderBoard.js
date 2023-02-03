/**
 * Contains the data/methods for creating the leaderboards for the current
 * tournament in Golf+ for fun. 
 * 
 * Leaderboards are identified by tournament number 
 * which is just yy.tt, where yy is the last two digits of the year and tt is the
 * tournament number (1-13). So first tournament of 2023 is 23.01.
 * 
 * Each leaderboard is completely rewritten every time for each leaderboard selected
 * Typical use case are: print the current tournament board after each round and then
 * final leaderboard at the end of the tournament.                             
 * 
 */
class Leaderboard {
  
  constructor(data) {
    this._data = data;
    this._id;
    this._tourny;
    this._tournyNumber;
    this._sheetName = `Leaderboard`;
    this._leaderboardSheet = null;
    this._numCols = 7;
    
    this._headerTitle = [["Name", "Round 1", "Round 2", "Round 3", "Round 4", "Total", "+/-"]];
    this._footerValues = [["Course"],["Par"],["Date"],["Tees"], ["Pins"], ["Greens"],["Wind"],["Level"]];

    // Everything will be based off the header row/col
    this._headerRow = 2;
    this._headerColumn = 2;
    this._headerNumRows = 1;
    this._dataRow = this._headerRow+1;
    this._dataCol = this._headerColumn;
    this._scoreCols = 4;
    this._createScoreToParRow = this._headerRow+7;
    this._headerColor = "yellow";
    this._sumColNum = this._headerColumn+5; // 6;
    this._sumColOff =  this._headerRow+1;   // 2;
    this._sumColStart = columnToLetter(this._headerColumn+1);   // "C" 
    this._sumColEnd = columnToLetter(this._headerColumn+4);     // "F"
    this._parFormulaCol = columnToLetter(this._headerColumn+6); // 'H'
    this._parSumCol = columnToLetter(this._headerColumn+5);     // 'G'
    this._scoreToParCol = this._headerColumn+6;
    this._footerNumRows = 8;
    this._footerRowStart = 0;  // This is incorrect until we add the data, updated in footer func
    //this._horizAlign = [["left", "right", "right", "right", "right", "right", "center"]];
    this._horizAlign = [["left", "center", "center", "center", "center", "center", "center"]];
    //this._horizAlignCourses = [["right"],["right"],["right"],["right"],["right"],["right"],["right"],["right"]];
    this._horizAlignCourses = [["center"],["center"],["center"],["center"],["center"],["center"],["center"],["center"]];
    this._horizAlignScores = [["left", "center", "center", "center", "center", "center", "center"]];
    this._fontStyles = [["bold", "bold", "bold", "bold", "bold", "bold", "bold"]];
    this._fontName = "Trebuchet MS"; // "Roboto Mono" "Comfortaa"
    this._colWidthName = 140;
    this._colWidthScores = 93;
    this._colWidthTotals = 37;
    this._colWidthScorToPar = 33;
  }

  /**
   * Create the leaderboard
   * 
   * @param {number} id - the Tournament ID to create the leaderboard for
   */
  create(id) {
    this._tournyNumber = id;
    // create/find the sheet
    this._createSheet(id);

    // clear the sheet
    this._clearSheet();

    // add the data
    this._addData(this._data);

    // format the sheet
    this._setLayout(this._leaderboardSheet);

    // Add the footer
    this._createFooter(this._leaderboardSheet);

    // No grid lines
    this._leaderboardSheet.setHiddenGridlines(true);

    // Make all column width to width of data
    this._setColWidths(this._leaderboardSheet);

    // Clear out 999 for missing scores
    this._normalizeData(this._leaderboardSheet, tournaments.getTournamentById(this._tournyNumber));
  }

  /**
   * Create the spreadsheet if not created
   * 
   * @param {string} tournyNumber - contains the tournament number to build the leaderboard for
   */
  _createSheet(tournyNumber) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sn = `${this._sheetName} ${tournyNumber}`;
    this._leaderboardSheet = ss.getSheetByName(sn);
    if (this._leaderboardSheet == null) {
      this._leaderboardSheet = ss.insertSheet(sn);
    }
  }

  /**
   * Clear tbe sheet before adding new data
   */
  _clearSheet() {
    if (this._leaderboardSheet.getLastRow()>0) {
      this._leaderboardSheet
        .getRange(1, 1, this._leaderboardSheet.getLastRow(), this._leaderboardSheet.getLastColumn())
        .clear();
    }
  }

  /**
   * Take passed data and add it to the spreadsheet
   * 
   * @param {array} data - 2d nx5 array for the leader board. n is the number of rows
   *                       based on how many players have a scorecard for the tournament 
   */
  _addData(data) {
    this._leaderboardSheet.insertRows(this._dataRow, data.length+1);  
    this._leaderboardSheet.getRange(this._dataRow,this._dataCol, data.length, data[0].length).setValues(data);
  }

  /**
   * Define the layout of the leaderboard sheet
   * 
   * @param {spreadsheet} Sheet that the layout will be applied to
   */
  _setLayout(sheet) {
    if (sheet != null) {
      // Set the horizontal alignment for the data rows +2 summ columns
      this._data.forEach((d,i) => {
        sheet.getRange(this._dataRow+i,this._dataCol, 1, d.length+2)
          .setHorizontalAlignments(this._horizAlignScores);
      });
    
      // Set the header row color, text, and border
      sheet.getRange(this._headerRow, this._headerColumn, this._headerNumRows, this._numCols)
        .setBackground(this._headerColor)
        .setBorder(false, false, true, false, false, false)
        .setValues(this._headerTitle);

      // Set the border for the bottom of the results, these get pushed down when data rows are added 
      sheet.getRange(this._headerRow+1, this._headerColumn, this._headerNumRows, this._numCols)
        .setBorder(true, false, false, false, false, false);

      // Set the formulas for summing the scores   
      sheet.getRange(this._dataRow, this._sumColNum, this._data.length, 1)
        .setFormulas(this._createSumFormulas(this._data.length));

      // Set the number format for score vs par
      sheet.getRange(this._dataRow, this._scoreToParCol, this._data.length+1, 1)
        .setNumberFormats(this._createTotalScoreFormat(this._data.length+1));

      // Set the horizontal alignment for the header row
      sheet.getRange(this._headerRow, this._headerColumn, this._headerNumRows, this._horizAlign[0].length)
        .setHorizontalAlignments(this._horizAlign);

      // Make the first row bold text
      sheet.getRange(this._headerRow, this._headerColumn, this._headerNumRows, this._numCols)
        .setFontWeights(this._fontStyles);

      // Apply row banding for the data portion of the sheet
      sheet.getRange(this._dataRow, this._headerColumn, this._data.length, this._data[0].length+2)
        .applyRowBanding()
        .setHeaderRowColor("white")
        .setFirstRowColor("#faf8c8") // #faf8c8-yellow #edf2fa-blue
        .setSecondRowColor("white");

      // TODO - move border values to settings page
      sheet.getRange(this._dataRow, this._sumColNum, this._data.length, 1)
        .setBorder(true, true, false, false, false, false);
    }    
  }

  /**
   * Create the footer values based on the tournaments that have been defined
   */
  _createFooter(sheet) {
    let rangeRowStart = sheet.getLastRow()+1;
    this._footerRowStart = sheet.getLastRow()+1;
    let rangeColStart = this._headerColumn;

    // Horizontal border of the top row of footer
    //TODO Move hardcoded values to settings
    sheet.getRange(rangeRowStart+1, rangeColStart, 1, this._numCols)
       .setBorder(true, false, false, false, false, false);
    
    // Get the data for the courses and add to footer
    tournaments.getTournamentById(this._tournyNumber).rounds.forEach((r) => {
      this._footerValues[0].push(r.course);
      this._footerValues[1].push(Courses.getPar(r.course));
      this._footerValues[2].push(r.date);
      this._footerValues[3].push(r.tees);
      this._footerValues[4].push(r.pins);
      this._footerValues[5].push(r.greens);
      this._footerValues[6].push(r.wind);
      this._footerValues[7].push(r.level);
    });

    // Add the footer data
    sheet.getRange(rangeRowStart+1, rangeColStart, this._footerNumRows, this._footerValues[0].length)
      .setValues(this._footerValues);

    // Make the titles bold
    //TODO Move values to variables or settings
    sheet.getRange(rangeRowStart+1, rangeColStart, this._footerNumRows, 1)
      .setFontWeights([["bold"],["bold"],["bold"],["bold"],["bold"],["bold"],["bold"],["bold"]]);

    // Set the horizontal alignment for the courses columns, but not header column
    [...Array(4)].forEach( (c,i) =>{ 
      sheet.getRange(rangeRowStart+1, rangeColStart+1+i, this._horizAlignCourses.length, 1)
      .setHorizontalAlignments(this._horizAlignCourses); 
    }); 

    // Add in the =SUM function to add up the course par total
    //TODO Fix hardcoded +2
    sheet.getRange(rangeRowStart+2, this._sumColNum, 1)
      .setFormula([[`=SUM(${this._sumColStart}${rangeRowStart+2}:${this._sumColEnd}${rangeRowStart+2})`]]);

    // Set the left border for the total par score
    //TODO move hardcoded values to settings
    sheet.getRange(rangeRowStart+1, this._sumColNum, this._footerNumRows, 1)
        .setBorder(true, true, false, false, false, false);

    // Get the total vs par for the course
    sheet.getRange(this._headerRow+1, this._scoreToParCol, this._data.length, 1)
      .setFormulas(this._createScoreToParFormulas(this._data.length, rangeRowStart+2));

    // Set the font for the whole sheet
    sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn())
      .setFontFamilies(this._createFontArray(sheet.getLastRow(), sheet.getLastColumn(), this._fontName));

    // Lets sort on the total score field
    sheet.getRange(this._dataRow , this._dataCol, this._data.length, sheet.getLastColumn())
      .sort(this._sumColNum);

    // Create a conditional formatting rule for the score to par column
    this._createConditionalRuleScoreToPar(sheet);

    // Create a conditional rule for all of the scores to par
    this._createConditionalRuleScores(sheet);
  }

  /**
   * Set the widths of the columns to make it look nice
   * 
   * TODO - Move all values to settings and remove hardcoded values
   */
  _setColWidths(sheet) {
    sheet.setColumnWidths(this._dataCol, 1, this._colWidthName);
    sheet.setColumnWidths(this._dataCol+1, 4, this._colWidthScores);
    sheet.setColumnWidths(this._dataCol+5, 1, this._colWidthTotals);
    sheet.setColumnWidths(this._dataCol+6, 1, this._colWidthScorToPar); 
  }

  /**
   * Normailize the data area by removing the 999 number used as a placeholder for missing
   * rounds and allowing the sort to put players with missing scores at the bottom of the 
   * leaderboard.
   * 
   * @param {Spreadsheet} Leaderboard spreadsheet to make the changes on.
   */
  _normalizeData(sheet, tournament) {
    const scores = sheet
      .getRange(this._dataRow, this._dataCol+1, this._data.length, this._scoreCols)
      .getValues();
    scores.forEach((row,i) => {
      row.forEach( (s,j) => { 
        // If we have a temp score we clear it from the scoreboard
        if (s===999) {
          sheet.getRange(this._dataRow+i, this._dataCol+j+1, 1 ,1).clear();
          // If a totally missed round we clear totals formula
          if (j+1<=tournament.definedRounds) {
            //sheet.getRange(this._dataRow+i, this._scoreToParCol, 1, 1).clear();
          }
        }
      });
    });
  }

  /**
   * Create conditional formatting rules for the total to par column
   */
  _createConditionalRuleScoreToPar(sheet) {
    // Range for the score column and all scores
    const range = sheet.getRange(this._dataRow, this._scoreToParCol, this._data.length, 1)
    let rule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0)
      .setFontColor("#FF0000")
      .setRanges([range])
      .build();
    let rules = sheet.getConditionalFormatRules();
    rules.push(rule);
    sheet.setConditionalFormatRules(rules);
  }

  /**
   * Create conditional formatting rules for the individual scores
   * 
   * TODO - make it work
   */
  _createConditionalRuleScores(sheet) {
    let rules = [];
    let newRules = [];
    let rule;
    let range;
    for (let i=this._dataCol+1; i<this._dataCol+5; i++) {
      //console.log(`Par score column ${i} par value = ${sheet.getRange(this._footerRowStart+2, i, 1, 1).getValue()}`);
      range = sheet.getRange(this._dataRow, i, this._data.length, 1)
      rule = SpreadsheetApp.newConditionalFormatRule()
        .whenNumberLessThan(parseInt(sheet.getRange(this._footerRowStart+2, i, 1, 1).getValue()))
        .setFontColor("#FF0000")
        .setRanges([range])
        .build();
      newRules.push(rule);
      //console.log(`newRule length ${newRules.length}`);
    }
    rules = sheet.getConditionalFormatRules();
    sheet.setConditionalFormatRules([...rules,...newRules]);
  }

  /**
   * Create the formula array to apply to the player scores row to sum the scores
   * 
   * @param {number} Number of rows to create formulas for
   * @return {array} 2D array of foremulas to sum the scores
   */
  _createSumFormulas(rows) {
    let formulas = [];
    [...Array(rows)].forEach( (r,i) => formulas.push([`=SUM(${this._sumColStart}${i+this._sumColOff}:${this._sumColEnd}${i+this._sumColOff})`]));
    return formulas;
  }

  /**
   * Create the formulas for +/- par
   */
  _createScoreToParFormulas(rows, row) {
    let formulas = [];
    [...Array(rows)].forEach( (r,i) => 
      formulas.push([`=DIFFTOPAR(${this._sumColStart}${i+this._sumColOff}:${this._sumColEnd}${i+this._sumColOff},$${this._sumColStart}$${row}:$${this._sumColEnd}$${row})`]));
    return formulas;
  }

  /**
   * Create the number formats for the total score to add a +/-
   */
  _createTotalScoreFormat(rows) {
    let formats = [];
    //[...Array(rows)].forEach( (r,i) => formats.push(["+0;-0;0"]));
    [...Array(rows)].forEach( (r,i) => formats.push(["(+0);(-0);(0)"]));
    return formats;
  }

  /**
   * Create an array with the font to be used for the leaderboard.  Need to have each  cell
   * with it's own font name :|
   */
  _createFontArray(rows, cols, text) {
    let fontAry = [];
    let rowAry = [];
    [...Array(rows)].forEach(r => {
      [...Array(cols)].forEach( c => {
        rowAry.push(text);
      });
      fontAry.push(rowAry); 
      rowAry = new Array(); 
    });
    return fontAry;
  }
}
