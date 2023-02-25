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
 * Id for original spreadsheet: 11SMT0fM0qMMG11DqmIb6sNzihtL6W6qOBJmn7ENJsLA
 * Script id for original spreadsheet: 1BsdkdXPc6qhec81216mX9dX-aMxgkSSoD0fKM0M6MVqswOyv9vf1M8Eg
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.
 */
class Leaderboard {
  
  constructor(data) {
    this._data = data;
    this._id;
    this._tourny;
    this._tournyNumber;
    this._sheetName = `Leaderboard`;
    this._leaderboardSheet = null;
    this._headerTitle = [["Name", "Round 1", "Round 2", "Round 3", "Round 4", "Total", "+/-"]];
    this._footerValues = [["Course"],["Par"],["Date"],["Tees"], ["Pins"], ["Greens"],["Wind"],["Level"]];

    // Everything will be based off the header row/col
    this._numCols = 7;
    this._headerRow = 2;      // What row the header will start on
    this._headerColumn = 2;   // What column the header will start on
    this._headerNumRows = 2;  // Number of rows in the header
    this._dataRow = this._headerRow+this._headerNumRows; // Data row starts after header
    this._dataCol = this._headerColumn;                  // Data columns line up with the header
    this._scoreCols = 4;                                 // Number of columns for the scores (4 rounds)
    //this._createScoreToParRow = this._headerRow+7;       // Not used?
    this._headerColor = "#faf570"; //"yellow";
    this._rowBandingColor = "#faf8c8"; // light yellow
    this._headerTitleFontSize = 16;
    this._sumColNum = this._headerColumn+5; // 6;
    this._sumColOff =  this._headerRow+this._headerNumRows;   
    this._sumColStart = columnToLetter(this._headerColumn+1);   // "C" 
    this._sumColEnd = columnToLetter(this._headerColumn+4);     // "F"
    this._parFormulaCol = columnToLetter(this._headerColumn+6); // 'H'
    this._parSumCol = columnToLetter(this._headerColumn+5);     // 'G'
    this._scoreToParCol = this._headerColumn+6;
    this._footerNumRows = 8;
    this._footerRowStart = 0;  // This is incorrect until we add the data, updated in footer func
    this._horizAlign = [["right", "center", "center", "center", "center", "center", "center"]];
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
    this._setLayout(this._leaderboardSheet, id);

    // Add the footer
    this._createFooter(this._leaderboardSheet);

    // No grid lines
    this._leaderboardSheet.setHiddenGridlines(true);

    // Make all column widths uniform
    this._setColWidths(this._leaderboardSheet);

    // Clear out 999 for missing scores
    this._normalizeData(this._leaderboardSheet);
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
    this._leaderboardSheet
      .insertRows(this._dataRow, data.length);  
    this._leaderboardSheet
      .getRange(this._dataRow,this._dataCol, data.length, data[0].length)
      .setHorizontalAlignments(createValueArray(data.length, data[0].length, "center"))
      .setValues(data);
      
    // Align the names to the right
    this._leaderboardSheet
      .getRange(this._dataRow,this._dataCol, data.length, 1)
      .setHorizontalAlignments(createValueArray(data.length, 1, "right"));

    // Add in the score to par 
    this._leaderboardSheet
      .getRange(this._dataRow,this._scoreToParCol, data.length, 1)
      .setValues(this._createScoreToPar(tournaments.getCourseArray(this._tournyNumber)));
  }

  /**
   * Define the layout of the leaderboard sheet
   * 
   * @param {spreadsheet} Sheet that the layout will be applied to
   */
  _setLayout(sheet, id) {
    if (sheet != null) {
      // Add in the tournament name as the first line in the header 
      sheet.getRange(this._headerRow, this._headerColumn, 1, 1)
        .setBackground(this._headerColor)
        .setFontFamily(this._fontName)
        .setFontSize(this._headerTitleFontSize)
        .setValues([[tournaments.getTournamentNameById(id)]]);

      // Merge all columns for the title together
      sheet.getRange(this._headerRow, this._headerColumn, 1, this._numCols)
        .setHorizontalAlignments(createValueArray(1,this._numCols,"center"))
        .merge();  

      // Set the header row color, text, and border
      sheet.getRange(this._headerRow+1, this._headerColumn, this._headerTitle.length, this._numCols)
        .setBackground(this._headerColor)
        .setBorder(false, false, true, false, false, false)
        .setValues(this._headerTitle);

      // Set the formulas for summing the scores   
      sheet.getRange(this._dataRow, this._sumColNum, this._data.length, 1)
        .setHorizontalAlignments(createValueArray(this._data.length, 1, "center"))
        .setFormulas(this._createSumFormulas(this._data.length));

      // Set the number format for score vs par
      sheet.getRange(this._dataRow, this._scoreToParCol, this._data.length+1, 1)
        .setHorizontalAlignments(createValueArray(this._data.length+1, 1, "center"))
        .setNumberFormats(this._createTotalScoreFormat(this._data.length+1));

      // Set the horizontal alignment for the header row
      sheet.getRange(this._headerRow+1, this._headerColumn, 1, this._horizAlign[0].length)
        .setHorizontalAlignments(this._horizAlign);

      // Make the header titles bold text
      sheet.getRange(this._headerRow+1, this._headerColumn, 1, this._numCols)
        .setFontWeights(this._fontStyles);

      // Add border to the left of the score sum column
      // TODO - move border values to settings page
      sheet.getRange(this._dataRow, this._sumColNum, this._data.length, 1)
        .setBorder(true, true, false, false, false, false);
    }    
  }

  /**
   * Create the footer values based on the tournaments that have been defined
   */
  _createFooter(sheet) {
    let rangeRowStart = sheet.getLastRow();
    this._footerRowStart = sheet.getLastRow();
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
    //  .setFontWeights(createValueArray(this._footerNumRows,this._footerValues[0].length, "bold"))
      .setValues(this._footerValues);

    // Make the titles bold
    //TODO Move values to variables or settings
    sheet.getRange(rangeRowStart+1, rangeColStart, this._footerNumRows, 1)
      .setHorizontalAlignments(createValueArray(this._footerNumRows, 1, "right"))
      .setFontWeights([["bold"],["bold"],["bold"],["bold"],["bold"],["bold"],["bold"],["bold"]]);

    sheet.getRange(rangeRowStart+1, rangeColStart+1, this._horizAlignCourses.length, 4)
      .setHorizontalAlignments(createValueArray(this._horizAlignCourses.length, 4, "center")); 

    // Add in the =SUM function to add up the course par total
    //TODO Fix hardcoded +2
    sheet.getRange(rangeRowStart+2, this._sumColNum, 1)
      .setFormula([[`=SUM(${this._sumColStart}${rangeRowStart+2}:${this._sumColEnd}${rangeRowStart+2})`]]);

    // Set the left border for the total par score
    //TODO move hardcoded values to settings
    sheet.getRange(rangeRowStart+1, this._sumColNum, this._footerNumRows, 1)
        .setBorder(true, true, false, false, false, false);

    // Add a last updated row at the bottom of the footer
    sheet.getRange(this._footerRowStart+this._footerNumRows+1, this._headerColumn, 1, this._numCols)
         .setBackground(this._rowBandingColor)
         .setValues([[`Last updated ${new Date().toLocaleString('en-US')}`, "", "", "", "", "", ""]]);

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

     // Apply row banding for the data portion of the sheet after footer data has been added/formatted
    sheet
        .getRange(this._dataRow, this._dataCol, this._data.length, this._data[0].length+2)
        .applyRowBanding()
        .setHeaderRowColor("white")
        .setFirstRowColor(this._rowBandingColor) // #faf8c8-yellow #edf2fa-blue
        .setSecondRowColor("white");    
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
  _normalizeData(sheet) {
    const scores = sheet
      .getRange(this._dataRow, this._dataCol+1, this._data.length, this._scoreCols)
      .getValues();
    scores.forEach((row,i) => {
      row.forEach( (s,j) => { 
        // If we have a temp score we clear it from the scoreboard
        if (s===999) {
          sheet.getRange(this._dataRow+i, this._dataCol+j+1, 1 ,1).clear();
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
   */
  _createConditionalRuleScores(sheet) {
    let rules = [];
    let newRules = [];
    let rule;
    let range;
    for (let i=this._dataCol+1; i<this._dataCol+5; i++) {
      range = sheet.getRange(this._dataRow, i, this._data.length, 1)
      rule = SpreadsheetApp.newConditionalFormatRule()
        .whenNumberLessThan(parseInt(sheet.getRange(this._footerRowStart+2, i, 1, 1).getValue()))
        .setFontColor("#FF0000")
        .setRanges([range])
        .build();
      newRules.push(rule);
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
   * Calculate the diff to par after the table is loaded, thus removing the need to have a custom function
   * 
   * @param {array[]}  footerData - 2d array of the courses data to capture the par for each course
   * @return {array[]} Array of score to par calculations to be added to the last row of table
   */
  _createScoreToPar(footerData) {
    let results = [];
    let diffToPar = 0;
    // Loop for each player (row)
    this._data.forEach((r,i) => {
      // Loop for each score for the player (col)
      r.forEach((s,j) => {
        console.log(`s: ${s} ${diffToPar}`);
        // Skip over the name
        if (j>0) {
          // Skip rounds with no scores
          if (parseInt(s) != 999) {
            diffToPar = diffToPar + (s - footerData[1][j]);
          }
        }
      });
      console.log(`push diffToPar: ${diffToPar}`);
      results.push([diffToPar]);
      diffToPar = 0;
    });
    return results;
  }

  /**
   * Create the number formats for the total score to add a +/-
   */
  _createTotalScoreFormat(rows) {
    let formats = [];
    [...Array(rows)].forEach( (r,i) => formats.push(['(+0);(-0);"E"']));
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
