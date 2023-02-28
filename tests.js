/**
 * Test converting the dates in course data to strings
 */
function test_convertDates() {
  let tnums = tournaments.getNumbers();
  let ct = tournaments.getTournamentById(tnums[tnums.length-1]);
  let data = ct.leaderboardData;

  let diffToPar = 0;
  let totalScore = 0;
  let courseData = tournaments.getCourseArray(tnums[tnums.length-1]);

  console.log(`Date field: ${courseData[2]}`);
  // Turn date obj to date string
  let courseDates = courseData[2].map(d => {
    if (d != 'Date') {
      return new Date(d).toLocaleDateString();
    } else {
      return "Date";
    }
  });
  //console.log(`courseDates: ${courseDates}`);
  courseData[2] = courseDates;
  console.log(`${courseData[2]}`);

}

/**
 * Test building the leaderboard data in the Tournament class
 */
function test_createLeaderboardData() {
  let tnums = tournaments.getNumbers();
  let ct = tournaments.getTournamentById(tnums[tnums.length-1]);
  let data = ct.leaderboardData;

  let diffToPar = 0;
  let totalScore = 0;
  let footerData = tournaments.getCourseArray(tnums[tnums.length-1]);
  data.forEach((r,i) => {
    r.forEach((s,j) => {
      if (j>0 && j<5) {
        totalScore += s;
        if (parseInt(s) != 999) {
          diffToPar = diffToPar + (parseInt(s) - footerData[1][j]);
        }
      }
    });
    data[i].push(totalScore);
    data[i].push(diffToPar);
    diffToPar = 0;
    totalScore = 0;
  });
  //console.log(`${JSON.stringify(data)}`);
  let sdata = data.sort((a,b) => a[5]-b[5]);
  //data.forEach(r => console.log(r));

  // Normalize the data after the sort
  data.forEach((r,i) =>{
    r.forEach((c,j) => {
      if (c==999) {
        data[i][j] = 0;
        data[i][5] -= 999;
      }
    });
  });

  console.log(`data length [${data.length}]`);
  let msg = '';
  let plyMsg = 'Players';
  let courMsg = 'Courses';
  let limit = data.length;
  [...data,...footerData].forEach( (r,i) => {
    i < limit ? msg = plyMsg : msg = courMsg;
    console.log(`Record number [${i}] [${msg}] value [${r}]`);
  });
  //console.log(`${JSON.stringify(data)}`);;
}

/**
 * Test new createScoreToPar method
 */
function test_createScoreToPar() {
  let num = 23.05
  let tourny = tournaments.getTournamentById(num);
  let courseData = tournaments.getCourseArray(num);
  let lb = new Leaderboard(buildLeaderBoard(tourny));
  let res = lb._createScoreToPar(courseData);
  console.log(`createSocreToPar: ${JSON.stringify(res)}`);
}

/**
 * Test incremental backup
 */
function test_incrementalBackup() {
  let record = JSON.parse('["1/1/2021 22:49:36","1/1/2021","22.01","1","Bob Dylan","77"]');
  let bk = new Backup();
  if (bk.findFile(bk.fileName)) {
    bk.add(record);
  }
}

/**
 * Create file in folder test
 */
function test_createSpreadsheet() {
  /*
  // Works but has a depricated method addFile(), the Drive API works, so we go with that!
  var destination = DriveApp.getFolderById('1PUUa99wncEhzpMHdnGvpWDgXsLTB7Ran');
  var newFile = SpreadsheetApp.create('Golf+ tournaments - BACKUP').getId();
  destination.addFile(DriveApp.getFileById(newFile));
  */
  let backup = new Backup();
  backup.createFile(`Golf tournaments - backup`);
}

/**
 * Backup class test
 */
function test_backupClass() {
  //let bk = new Backup();
  //bk._findFile("Golf tournaments - dev");

  let backup = new Backup();
  let backupSS = backup.findFile(backup.fileName);
  let formRespSheet = SpreadsheetApp.getActive().getSheetByName("Form Responses");
  if (!backupSS) {
    backupSS = backup.createFile(backup.fileName);
    backup.fullBackup(formRespSheet);
  }
}

/**
 * Test Trigger class
 */
function test_triggerClass() {
  // Lets create an installable trigger to see if we can find it
  const ss = SpreadsheetApp.getActive();
  //let triggerID = ScriptApp.newTrigger("postFormSubmit")
  //                  .forSpreadsheet(ss)
  //                  .onChange()
  //                  .create();

  let trig = new Triggers(ss);
  let found = trig.find("14752940");
  console.log(`Trigger found? ${found != null} `);
  //trig._saveTriggerID("3756437776730826077");
  console.log(` ${parseInt(trig._getTriggerID())}`);
  if (triggers.find(triggers._getTriggerID())) {
    console.log(`Found it: ${trig._getTriggerID()}`);
  }
}

/**
 * Used as a destination of the trigger
 */
function triggerCatcher(e) {
  // Print the results
  console.log(`${JSON.stringify(e)}`);
} 

/**
 * Kick off a build of leaderboard manually 
 */
function test_buildLB() {
  let tID = 23.04;
  tournamentByNumber(tID);
}

/**
 * Test new method to get tounament name
 */
function test_getTournyName() {
  let tourny = tournaments.getTournamentById(23.03);
  console.log(`Name=${tourny.name}`);
  console.log(`"${tournaments.getTournamentNameById(23.03)}"`);
}
/**
 * Test 'instanceof' keyword on my classes
 */
function test_instanceOf() {
  let lb = new Leaderboard();
  console.log(`is lb an instanceof LeaderBoard class? ${lb instanceof Tournament}`);
}

/**
 * Test the new utility createValueArray() function
 */
function test_createValueArray() {
  let out = createValueArray(3,2, "test");
  console.log(out);
}

/**
 * Test PlayerPoints class
 */
function test_playerPoints() {
  //let data = new Map();
  let tourn = 23.10;
  const ps = [
    {"name":"Rory McAroy", "score":268},
    {"name":"Tiger Woods", "score":278},
    {"name":"Jordan Speith", "score":276},
    {"name":"Chuck Grieshaber", "score":308},
    {"name":"Kari Grieshaber", "score":318},
    {"name":"Bob Dyland", "score":338},
  ];
  //data.set(tourn, data);

  let pp = new PlayerPoints(ps[0], tourn);
  console.log(`PlayerPoints.name ${pp.name}`);
  console.log(`toArray: ${pp.toArray()}`)
}

/**
 * Test pointsleaderboard 
 */
function test_pointsBoard() {
  let plb = new PointsLeaderboard();
  //let table = plb._sliceData();

/*
  // Look at each tournament and calculate points
  table.forEach( (v,k,m) => {
    console.log(`Map = ${k} ${JSON.stringify(v)}`)
  });
*/
}

/**
 * Test assuring I can get all player records
 */
function test_getAllPlayerRecs() {
  const prs = new PlayerRounds();

  // Get all of the records for one tournament
  //let tournyRes = prs.filter(PlayerRound.NUMBER, number);
  //let minRes;
  let minRes = prs.filter(PlayerRound.PLAYER, "George Boyd");
  for (let r of minRes) {
    console.log(`"${r.getName()}" ${r.getNumber()} ${new Date(r.getDate()).toLocaleDateString()} ${r.getScore()}`);
  }
}

/**
 * Test filtering down records for determining fedex points
 */
function test_filterRecords() {
  const prs = new PlayerRounds();
  let number = 23.01;
  let total = 0;
  let numRounds = 0;
  //let cnt = 0;
  let totalByPlayer = [];
  let fedex = new Map();

  console.log(`${tournaments.getNumbers()}`);
  // Loop for all tournament numbers
  tournaments.getNumbers().forEach( t => {
    console.log(`Tournament ${t}`);
    // Get all of the records for one tournament
    let tournyRes = prs.filter(PlayerRound.NUMBER, t);
    let minRes;

    // Loop for all players
    for (let p of players) {
      // Grab all records from tournament for this player
      minRes = tournyRes.filter(PlayerRound.PLAYER, p);
    
      // We only count if there are 4 rounds played
      if (minRes.getNumRounds() == 4) { 
        for (let r of minRes) {
          total+= r.getScore();
          //cnt++;
        }
        numRounds = numRounds + minRes.getNumRounds();
        totalByPlayer.push({"name": p, "score": total});
        console.log(`Player "${p}"" has ${minRes.getNumRounds()} rounds in this tournament`);
      }    
      total = 0;
      //cnt = 0;
    }
  
    console.log(`Total rounds found = ${numRounds}`);
    //console.log(`${JSON.stringify(totalByPlayer)}`);
    totalByPlayer.sort((a, b) => parseInt(a.score) - parseInt(b.score));
    console.log(`${JSON.stringify(totalByPlayer)}`);
    fedex.set(t, totalByPlayer);
  });

  console.log(`${fedex.keys()}`);
}

/**
 * Test the iterator in PlayerRounds
 */
function test_iteratorPR() {
  const prs = new PlayerRounds();
  for (let pr of prs) {
    console.log(pr.getName());
  }
}

/**
 * Test the filter function of the PlayerRounds class 
 */
function test_playerRounds() {
  const prs = new PlayerRounds();
  console.log(`getNumRounds() ${prs.getNumRounds()}`);
  //console.log(`getField(NAME) ${prs[0].getField(4)}`);
  let fpr = [];
  fpr = prs.filter(PlayerRound.PLAYER, "Chuck Grieshaber");
  console.log(`Number of rounds = ${fpr.getNumRounds()}`);
  for (let r of fpr) {
    console.log(`${r.getName()} ${r.getScore()} ${r.getRound()}`);
  }
}

/**
 * Get player rounds by number
 */
function test_getRoundsById() {
  let rounds = [];
  let leaderboard = [];
  let found = false;
  let playerName;
  let playerScores = new Array(4);
  const pr = new PlayerRounds();
  const players = new Players();  
  rounds = [...pr.getRoundsByNumber(23.01)];
  rounds.forEach(r => console.log(`${r.getName()} ${r.getRound()} ${r.getScore()}`));
  // Get the records for each of the tournament rounds and the course data for the footer
  //currTourny.rounds.forEach((r) => {
    //rounds = [...rounds, ...pr.getRoundsByDate(r.date)];
    //rounds = [...rounds, ...pr.getRoundsByNumber(23.02)];
  //});
}

/**
 * get col widths
 */
function test_getColWidth() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Leaderboard 23.01");
  console.log(`7=${sheet.getColumnWidth(7)} 8=${sheet.getColumnWidth(8)}`);
}
/**
 * Column number to letter test
 */
function test_col2Letter(){
  console.log(`col=2, letter=${columnToLetter(2)}`);
  console.log(`col=5, letter=${columnToLetter(5)}`);
  console.log(`col=55, letter=${columnToLetter(55)}`);
}

/**
 * Test getting all tournament numbers
 */
function test_getTournyNums() {
  console.log(`${tournaments.getNumbers()}`);
}

/**
 * Test exporting the leaderboard sheet
 */
function test_exportToHTML() {
  let url ="https://docs.google.com/spreadsheets/d/1nriQ4L8Qm3bFqJxTD9kCb9I37AsTBmez_Wum9MBJE-E/export#gid=79002314&format=zip&gridlines=false"
  exportSpreadsheet();

}

/**
 * Test getting tournament numbers 
 */
function test_getTournyNumbers() {
  let tournys = getTournamentNumbers();
  tournys.forEach((t,i) => console.log(`T#${i} ${t}`));
  let tmp = [...tournys];
  console.log(`replaceChildren(): "${tmp}"`);
}

/**
 * Text select tournament by number
 */
function test_tournamentById() {
  const number = "23.02";
  let currentTourny = tournaments.getTournamentById(Number(number));
  console.log(`${typeof currentTourny}`);
  if (typeof currentTourny === "object") {
    console.log(` ${currentTourny.number} ${number}`);
  } else {
    console.log(`Could not find the tournament`);
  }
}

/**
 * Test font aray
 */
function test_fontArray(){
  let lb = new Leaderboard();
  console.log(`${JSON.stringify(lb._createFontArray(12, 7))}`);
  //console.log(`${JSON.stringify(lb._createFontArray2(12, 7))}`);
  let rows = 12;
  let cols = 7;
  let fontAry = [];
  let rowAry = [];
  [...Array(rows)].forEach(r => {
    [...Array(cols)].forEach( c => {
      rowAry.push("Comfortaa");
    });
    fontAry.push(rowAry); 
    rowAry = new Array();
  });
  console.log(JSON.stringify(fontAry));
}

/**
 * 
 */
function text_arraylen() {
  let horizAlignCourses = [["right"],["right"],["right"],["right"],["right"],["right"],["right"],["right"]];
  console.log(`${horizAlignCourses.length} ${horizAlignCourses[0].length}`);
}
/**
 * Check out sumScoreToPar()
 */
function test_sumScoreToPar() {
  let lb = new Leaderboard();
  console.log(`${lb._createScoreToParFormulas(1,13)}`);
}

/**
 * Get the rounds by tournament number
 */
function test_getRoundsByNumber() {
  let tournamentByNumber = tournaments.getTournamentById(22.13);
  let tournamentDates = tournamentByNumber.tournamentDates;
  pr = new PlayerRounds();
  let rounds = pr.getRoundsByNumber(22.13);
  console.log(`${rounds}`);
}
/**
 * Test getting the formula
 */
function test_getFormulas() {
  let lb = new Leaderboard();
  let formulas = lb._createSumFormulas(4);
  console.log(`${JSON.stringify(formulas)}`);
  formulas = lb._createParFormulas(4);
  console.log(`${formulas}`);
  formulas = lb._createTotalScoreFormat(4);
  console.log(formulas);
  let trophys = ["🥇","🥈", "🥉"];
}

/**
 * Test setting sheet formatting options 
 */
function test_sheetFormatting() {
  let headerValues = [["Name", "Round 1", "Round 2", "Round 3", "Round 4", "Total", " ", "+/-"]];
  let footerValues = [
    ["Course", "Kiawah", "Pebble Beach", "Wolf Creek", "Castle Links"],
    [ "Par", 72, 72, 71, 72]
  ];
  let data = [
    ["Jim Morrison","72","73","74","75"],
    ["Bob Dylan","64","73","84","75"],
    ["Tom Petty","77","78","69","101"]
  ];
  let horizAlign = [["left", "right", "right", "right", "right", "right","center"]];
  let lb = new Leaderboard();
  let formulas; //= [["=SUM(A2:E2)"],["=SUM(A3:E3)"],["=SUM(A4:E4)"],["=SUM(A5:E5)" ]];

  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Test formatting");
  // lb._clearSheet();
  if (sheet.getLastRow()>0) {
    sheet
       .getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn())
//        .getRange(1, 1, 50, 10)
       .clear();
  }

  console.log(`${sheet.getLastRow()} ${sheet.getLastColumn()}`);

  sheet.insertRows(2, data.length+1);     
  sheet.getRange(2,1,data.length,5)
      .setValues(data);
  sheet.getRange(sheet.getLastRow()+1, 1, 2, 5)
      .setValues(footerValues);

  sheet.getRange(1, 1, 1, 8)
          .setBackground("yellow")
          .setBorder(false, false, true, false, false, false)
          .setValues(headerValues);

  sheet.getRange(sheet.getLastRow()-1, 1, 1, 8)
       .setBorder(true, false, false, false, false, false)
       .setBackground("white"); 

  sheet.getRange(2, 6, 4, 1).setFormulas(lb._createSumFormulas(data.length+1));
  sheet.getRange(2, 8, 4, 1).setNumberFormats(lb._createTotalScoreFormat(data.length+1));
  sheet.getRange(1, 1, 1, 7).setHorizontalAlignments(horizAlign);
  sheet.autoResizeColumns(1,9);

}

/**
 * Getting the current tournament
 */
function test_getCurrentTournament() {
  const tournaments = new Tournaments();
  let currTourny = tournaments.getCurrentTournament();
  console.log(`Get Current Tourny ${currTourny.number}`)
}

/**
 * Get the tounaments 
 */
function test_getTournaments() {
  let tournies = tournaments.getTournaments();
  let rounds;
  tournies.forEach(t => {
    console.log(`${t.number}`)
    rounds = t.rounds;
    rounds.forEach(r => {
      console.log(`. ${r.date}`);
    });
  });  
}

/**
 * Get tournament by ID (e.g. 23.1)
 */
function test_getTournamentById() {
  let tourny = new Map();
  tourny = tournaments.getTournamentById(22.13);
  let rounds = tourny.getRounds();
  rounds.forEach((r) => console.log(`${r.course} ${r.date}`));
  //console.log(tourny.getRounds());
}

/**
 * Test gettinbg rounds by name
 */
function test_getRoundsByName() {
  let pr = new PlayerRounds()
  let rounds = pr.getRoundsByName("Chuck Grieshaber");
  console.log(`${rounds}`);
}

/**
 * Test getting player records by date
 */
function test_getScoresByDate(){
  let ps = new PlayerRounds();
  let pr = new Array();
  pr = [...ps.getRoundsByDate("12/5/2022")];
  pr = [...pr, ...ps.getRoundsByDate("12/12/2022")];
  pr = [...pr, ...ps.getRoundsByDate("12/19/2022")];
  pr = [...pr, ...ps.getRoundsByDate("12/26/2022")];

  pr.forEach( p => console.log(`${p.getName()} ${p.getScore()} ${p.getRound()}`))
}

/**
 * Test get week number for passed date
 */
function test_getWeekNumber() {
  console.log(`Week number: ${getWeekNumber("12/3/2022")}`);
  console.log(`Week number: ${getWeekNumber("12/4/2022")}`);
  console.log(`Week number: ${getWeekNumber("12/5/2022")}`);
  console.log(`Week number: ${getWeekNumber("12/6/2022")}`);
  console.log(`Week number: ${getWeekNumber("12/7/2022")}`);
  console.log(`Week number: ${getWeekNumber("12/8/2022")}`);
  console.log(`Week number: ${getWeekNumber("12/9/2022")}`);
  console.log(`Week number: ${getWeekNumber("12/10/2022")}`);
  console.log(`Week number: ${getWeekNumber("12/11/2022")}`);
  console.log(`Week number: ${getWeekNumber("12/12/2022")}`);
}


function test_getPlayers() {
  let players = new Players();
  let list = players.getPlayers();
  console.log(`Number of players = ${list.length}`);
  list.forEach((p,i) =>{
      console.log(`${i}  ${p}`);
  });
}

function test_GetFormUrl() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheets = ss.getSheets();
  let sheetName = "";
  sheets.forEach((s) => {
    sheetName = s.getSheetName();
    console.log(`Checking sheet "${sheetName}"`);
    if (sheetName.startsWith('Form Responses')) {
      console.log(s.getFormUrl());
    }
  });
  /*
  var formUrl = SpreadsheetApp.getActive().getActiveSheet().getFormUrl();
  if (formUrl) {
    console.log(formUrl);
  } else {
    console.log('No form is linked');
  }
  */
}

function test_UpdateForm() {
  let players = new Players();
  let mform = new Form(['Chuckster']);
  mform.update(players.getPlayers());
}

function test_getDateOfWeek() {
  console.log(`Week 5 : ${getDateOfWeek(1,2023)}`);
  console.log(`Week 5 : ${getDateOfWeek(5,2023)}`);
  console.log(`Week 52 : ${getDateOfWeek(52,2023)}`);
  console.log(`Week 52 : ${getDateOfWeek(52,2022)}`);
}

function getDateOfWeek(w, y) {
    var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week
    return new Date(y, 0, d);
}

function test_getCourses() {
  console.log(`${Courses.getCourses()}`);
  let ta = [];
  ta.push(Courses.getPar("Alpine"));
  console.log(`${Courses.getPar("Kiawah")} ${ta}`);
}

/**
 * Test Tournament class
 */
function test_tournamentsClass() {
  let t = new Tournaments();
  t.toString();
  
}

/**
 * Text getting par for a course
 */
function test_getPar() {
  console.log(`${Courses.getPar(Courses.CLIFFS)}`);
  console.log(`${Courses.getPar(Courses.PINEHURST)}`);
}