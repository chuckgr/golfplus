/**
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.
 */

/**
 * ---------------------------------------------------------
 *  The following functions are called from the Admin sheet
 * ---------------------------------------------------------
 */
/**
 * Create the list of players for the match play tournament and place them in the 
 * match play bracket sheet 'Players' Called from a menu item on the spreadsheet UI
 */
function getMatchPlayPlayers() {
  let count = 0;
  let tournyNames = [];
  let matchPlayNames = [];
  let doubleTourneyNames = [];
  let tournyString = ""
  let plyrs = new Players();
  for (p of plyrs){
    if (p.getField(Player.INTOURNEY)>0) {
      count++;
      if (p.getField(Player.USERNAME).trim() == "") {
        console.log(`Player ${p.getField(Player.NAME)} has no player tag`);
      }
      //console.log(`${p.toString()}`);
      //matchPlayNames.push([`${p.getField(Player.NAME)}-${p.getField(Player.HANDICAPAM)}`]);
      matchPlayNames.push([`${p.getField(Player.NAME)}\n@${p.getField(Player.USERNAME)}`]);
      //matchPlayNames.push([`${p.getField(Player.NAME)}`]);
      tournyNames.push(`@${p.getField(Player.NAME)}`);
      doubleTourneyNames.push({"name":p.getField(Player.NAME), "handicap":p.getField(Player.HANDICAPAM)});
      if (count == 1) {
        tournyString += `@${p.getField(Player.NAME)}`;
      } else {
        tournyString += `, @${p.getField(Player.NAME)}`;
      }
    }
  }
  console.log(`${count} players in match play`);
  console.log(tournyString);
  //console.log(`${JSON.stringify(doubleTourneyNames)}`);

  /** Write out the players to the match play spreadsheet */
  let mpf = SpreadsheetApp.openById(settings.getSetting('MATCHPLAYFILE').value);
  let playerSheet = mpf.getSheetByName("Players");
  playerSheet
    .getDataRange()
    .clearContent();

  playerSheet
    .getRange(2,1,matchPlayNames.length,1)
    .setValues(matchPlayNames);

  var htmlApp = HtmlService
    .createHtmlOutput(`<p>${count} players in matchplay tournament:</p><br><p>${tournyString}</p>`)
    .setTitle('Match Play Players Added')
    .setWidth(400)
    .setHeight(450);

SpreadsheetApp.getActiveSpreadsheet().show(htmlApp);
}

/**
 * Add a new player to the player database. This is call by pressing the button on the admin screen.
 */
function adminAddPlayer() {
  return;
  let result;
  const nameField = "E5";
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let newPlayer = ss
    .getSheetByName('Admin')
    .getRange(nameField)
    .getValue();
  console.log(`Player to be added "${newPlayer}"`);
  if (newPlayer) {
    let plrs = new Players();
    result = plrs.add(newPlayer);
    console.log(`Result of add "${result}"`);
    if (result == -1) {
      ss.toast(`Player ${newPlayer} already exists!`, "Add new player", 5);
    } else {
      ss.toast(`Player ${newPlayer} added successfully`, "Add new player", 5);
      ss.getSheetByName('Admin')
        .getRange(nameField)
        .clearContent();
    }
  } else {
    ss.toast(`No Player name was found!`, "Add new player", 5);
  }
}

/**
 * Loop through rounds to find player not in player sheet
 */
function roundsNoPlayer() {
  let plrs = new PlayerRounds();
  const players = new Players().getPlayers();
  let plyrMap = new Map();
  
  for (r of plrs) {
    if (players.findIndex(p => p.name == r.getName()) < 0) {
      console.log(`${r.getName()} not found`);
    }
  }
}

/**
 * Determine if everyone that has a round is in the Players sheet
 */
function playersMissingFromSettings() {
  let plrs = new PlayerRounds();
  const players = new Players();
  let missingGolfers = [];
  let fndPlayer = new Map();
  let cnt = 0;

  // Loop for all of the players in database
  for (const p of plrs) { 
    if (fndPlayer.has(p.getName())) {
      fndPlayer.set(p.getName(), fndPlayer.get(p.getName())+1);
    } else {
      fndPlayer.set(p.getName(), 1);
    }
  }
  players.getPlayers().forEach(p => {
    fndPlayer.has(p.name) ? cnt++ : missingGolfers.push(p);
  });

  console.log(`${JSON.stringify(missingGolfers)}`);
}


/**
 * Determine which players we have loaded that have not played a round so they can
 * be culled from the database 
 */
function playersWithNoRounds() {
  let plrs = new PlayerRounds();
  let missingGolfers = [];
  let currPlayerRound;
  
  // Loop for all of the players in database
  players.getPlayers().forEach( p => { 
    //currPlayerRound = plrs.filter(PlayerRound.PLAYER, p);
    currPlayerRound = plrs.filter(PlayerRound.PLAYER, p.name);
    if (currPlayerRound.getNumRounds() == 0) {
      missingGolfers.push([p]);
      console.log(`${p} has no rounds`);
    }
  });

  if (missingGolfers.length > 1) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sn = `Missing Players`;
    let _missingPlayerSheet = ss.getSheetByName(sn);
    if (_missingPlayerSheet == null) {
      _missingPlayerSheet = ss.insertSheet(sn);
    }

    // Add the missing players
    _missingPlayerSheet
      .getRange(1,1,missingGolfers.length, 1)
      .clear()
      .setValues(missingGolfers);
  }
}

/**
 * Create a sheet that contains all of the courses played in the tournament so far
 * 
 * TODO - Code for this was moved to the Stats obj
 */
function findCoursesPlayed() {
  /*
  let t = new Tournaments();
  let coursesPlayed = new Map();
  let ta = t.getTournaments();
  let rounds = [];
  let rData = {};
  let tmpData = {};
  //console.log(`Course.  Times Played.  last Played`);
  ta.forEach(t => {
    rounds = t.rounds;
    rounds.forEach(r => {
      if (coursesPlayed.has(r.course)) {
        tmpData = coursesPlayed.get(r.course);
        tmpData.count = tmpData.count+1;
        tmpData.date = Math.max(tmpData.date, r.date);
        coursesPlayed.set(r.course, tmpData);
      } else {
        coursesPlayed.set(r.course, {"count":1, "date":r.date});
      }
    });
  }); 

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sn = `Courses Played`;
  let _coursesPlayedSheet = ss.getSheetByName(sn);
  if (_coursesPlayedSheet == null) {
    _coursesPlayedSheet = ss.insertSheet(sn);
  }

  //let courseAry = [["Course", "Times Played", "Last played"]];
  let courseAry = [];
  for (const [key, value] of coursesPlayed) {
    courseAry.push([key, value.count, new Date(value.date).toLocaleDateString()]);
  }
*/
  /** Sort the array */
  /*
  courseAry.sort((a,b) => new Date(a[2]).getTime() - new Date(b[2]).getTime()); // Sorts on date, old to new
  courseAry.unshift(["Course", "Times Played", "Last played"]);

  // Add the table to the sheet
  _coursesPlayedSheet
    .getRange(1,2,courseAry.length, 3)
    .clear()
    .setValues(courseAry);
   */
}

/**
 * Determine the Tournament that a player first participated in
 */
function calcFirstPlayerTournament() {
  let plrs = new PlayerRounds();
  let firstT = new Map();

  for (const pr of plrs) {
    if (!firstT.has(pr.getName())) {
      firstT.set(pr.getName(), pr.getNumber());
    } else {
      firstT.set(pr.getName(), Math.min(firstT.get(pr.getName(), pr.getNumber())));
    }
  }

  for (const [key, value] of firstT) {
    console.log(`${key} = ${value}`);
  } 
}

/** 
 * Get the week number for this week
 * 
 * @return {number} Weeknumber The week number for the current week
 * 
 * TODO - remove as we are not using it
 */
function getCurrentWeekNumber() { 
  let currentDate = new Date();
  let startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate)/(24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil(days/7);
  return weekNumber;
}

/**
 * Get the week number for this week
 * 
 * @param {string} date string in the following format mm/dd/yyyy
 * @return {number} Week number for passed in date string
 */ 
function getWeekNumber(date) { 
  let currentDate = new Date(date);
  let startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate)/(24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil(days/7);
  return weekNumber;
}

/**
 * Calculate the differance from par for the ranges passed
 * 
 * @param {aray[]}  - Array from range containing the scores to check
 * @paran {array[]} - Array from range for all of the courses in the footer typically
 * @return {array} - The difference to par
 */
function DIFFTOPAR(scoresRange, coursesRange) {
  //console.log(`${JSON.stringify(scoresRange)} ${JSON.stringify(coursesRange)}`);
  let diffToPar = 0;
  let res = [];
  scoresRange.forEach( (r,i) => {
    r.forEach((s,i) => {
      if (s != "") {
        diffToPar = diffToPar + (s - coursesRange[0][i]);
      }
    });
    res.push([diffToPar]);
    diffToPar = 0;
  });
  //console.log(`DIFFTOPAR: array size[${res.length}]`);
  return res;

}

/** 
 * Get the date for the week of year (always Monday)
 */ 
function getDateOfISOWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

/**
 * Convert column number to letter
 * 
 * @param {number} - Column number to be converted to alphabetic representation
 * @return {string} - Alphabetic representation of column number
 */
function columnToLetter(column) {
  let temp, letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

/** 
 * Create an array with the text to be used for the spreadsheet class methods.  
 */
function createValueArray(rows, cols, text) {
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

/**
 * Export spreadsheet from GitHub
 * 
 * https://gist.github.com/Spencer-Easton/78f9867a691e549c9c70
 */
function exportSpreadsheet() {
 
  //All requests must include id in the path and a format parameter
  //https://docs.google.com/spreadsheets/d/{SpreadsheetId}/export
 
  //FORMATS WITH NO ADDITIONAL OPTIONS
  //format=xlsx       //excel
  //format=ods        //Open Document Spreadsheet
  //format=zip        //html zipped          
  
  //CSV,TSV OPTIONS***********
  //format=csv        // comma seperated values
  //             tsv        // tab seperated values
  //gid=sheetId             // the sheetID you want to export, The first sheet will be 0. others will have a uniqe ID
  
  // PDF OPTIONS****************
  //format=pdf     
  //size=0,1,2..10             paper size. 0=letter, 1=tabloid, 2=Legal, 3=statement, 4=executive, 5=folio, 6=A3, 7=A4, 8=A5, 9=B4, 10=B5  
  //fzr=true/false             repeat row headers
  //portrait=true/false        false =  landscape
  //fitw=true/false            fit window or actual size
  //gridlines=true/false
  //printtitle=true/false
  //pagenum=CENTER/UNDEFINED      CENTER = show page numbers / UNDEFINED = do not show
  //attachment = true/false      dunno? Leave this as true
  //gid=sheetId                 Sheet Id if you want a specific sheet. The first sheet will be 0. others will have a uniqe ID. 
                               // Leave this off for all sheets. 
  // EXPORT RANGE OPTIONS FOR PDF
  //need all the below to export a range
  //gid=sheetId                must be included. The first sheet will be 0. others will have a uniqe ID
  //ir=false                   seems to be always false
  //ic=false                   same as ir
  //r1=Start Row number - 1        row 1 would be 0 , row 15 wold be 14
  //c1=Start Column number - 1     column 1 would be 0, column 8 would be 7   
  //r2=End Row number
  //c2=End Column number
 
  var ssID = "1ulAYbQADGmGWlcdixuOfdQZhWu_DYVZvZ9-U3xCKZCE"; // Test Popup spreadsheet in code
  //var ssID = "1nriQ4L8Qm3bFqJxTD9kCb9I37AsTBmez_Wum9MBJE-E";  // this spreadsheet
  var urlPdf = "https://docs.google.com/spreadsheets/d/"+ssID+"/export"+
                                                        "?format=pdf&"+
                                                        "size=0&"+
                                                        "fzr=true&"+
                                                        "portrait=false&"+
                                                        "fitw=true&"+
                                                        "gridlines=false&"+
                                                        "printtitle=true&"+
                                                        "sheetnames=true&"+
                                                        "pagenum=CENTER&"+
                                                        "attachment=true";

  var urlZip = "https://docs.google.com/spreadsheets/d/"+ssID+"/export"+
                                                        "?format=zip";
                                                                                                              
  var params = {method:"GET",headers:{"authorization":"Bearer "+ ScriptApp.getOAuthToken()}};
  
  var response = UrlFetchApp.fetch(urlZip, params).getBlob();
  // save to drive
  DriveApp.createFile(response);
  
  //or send as email
  /*
  MailApp.sendEmail(email, subject, body, {
        attachments: [{
            fileName: "TPS REPORT" + ".pdf",
            content: response.getBytes(),
            mimeType: "application/pdf"
        }]
    });};
  */
  
}