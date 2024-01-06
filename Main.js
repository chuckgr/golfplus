/**
 * Golf+ fun tournaments 
 * 
 * This code was developed to maintain the tournament leaderboards for the Facebook
 * Golf+ fun tournaments group.  The group will hold tournaments over a week or month.
 * This code contains a form to enter the scores for a tournament as well as a modal
 * popup to aquire the tournament number. The tournaments are identified by a 
 * tournament number which is the last two digits of the year and a two digit sequential
 * number of the tournament for this year (i.e. 23.02 for the second tournament of 2023).
 * 
 * This file is the location where most of the scripts get kicked off.
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.
 */

/** 
 * Globals
 */ 
const version = "1.0.20"
const settings = new Settings();
const players = new Players();
const courses = new Courses();
const tournaments = new Tournaments();

/**
 * Add our own menu items
 */ 
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Golf+ fun tournaments')
      .addItem('Create Leaderboard by Tournament Number', 'selectTournament')
      .addItem('Create Points Leaderboard', 'buildPointsBoard')
      // TODO .addItem('Recreate All Leaderboards', 'allLeaderBoards')
      .addSeparator()
      .addSubMenu(ui.createMenu('Forms')
          .addItem('Create/Update Form', 'updateForm'))
      .addToUi();
}

/**
 * Set a trigger to capture the form submit events
 * 
 * started getting errors creating the ui menu in onOpen, comment out for now to see
 */
/*
let triggers = new Triggers();
// Get the property of the trigger and then see if it is still installed and active
if (!triggers.find(triggers._getTriggerID())) {
  triggers.create({"functionName":"postFormSubmit"});
} 
*/

/**
 * On form submit we will build the leaderboard for the tournament that the score was
 * submitted to
 *
 * @param {Event} e - Event from the form submission 
 */
function postFormSubmit(e) {
  let tournyNumber = e.values[2];
  console.log(`Form Submitted: values: ${JSON.stringify(e.values)}`);

  // Make a backup of the form responses 
  let backup = new Backup();
  //let backupSS = backup.findFile(backup.fileName);
  let backupSS = backup.open();
  //if (!backupSS) {
    let formRespSheet = SpreadsheetApp.getActive().getSheetByName('Form Responses');
    //backupSS = backup.createFile(backup.fileName);
    //backup.fullBackup(formRespSheet);
  //}
  backup.add(e.values);

  // Recreate the leaderboard on form submit
  tournamentByNumber(tournyNumber); 
}

/** 
 * Create/update the form to enter the scores
 */ 
function createForm() {
  const form = new Form(players.getPlayers());
  let url = form.getUrl();
  // Log URL incase we want to send it out to peoples
  console.log(url);
}

/** 
 * Create/update the form to enter the scores
 */ 
function updateForm() {
  const form = new Form(players.getPlayers());
  form.update();
  // Log URL incase we want to send it out to peoples
  console.log(form.getUrl());
}

/** 
 * Create/update the form to enter the scores
 */ 
function recreateForm() {
  const form = new Form(players.getPlayers());
  form.recreate();
}

/**
 * Get the valid tournament numbers for the selection dialog
 * 
 * @return {array} Contains all of the valid tournament numbers
 * 
 * TODO - Move this to the Utilities class
 */
function getTournamentNumbers(){
  let numbers = [];
  tournaments.getTournaments().forEach(t => {
    numbers.push(`${t.number}`);
  });
  numbers.sort((a, b) => (a > b ? -1 : 0));
  return numbers;
}

/**
 * Display the Select Tournament number dialog to allow for the user to select
 * the tournament number that the leaderboard should be created for
 */
function selectTournament() {
  var widget = HtmlService
                .createHtmlOutputFromFile("SelectTournamentDialog.html")
                .setWidth(400)
                .setHeight(100);
  SpreadsheetApp.getUi().showModalDialog(widget, "Select Tournament");
}

/**
 * Create a leaderboard for the tournament selected from the dialog box. 
 * This is called by the script service from the clients browser 
 * (see SelectTournamentDialog.html)
 * 
 * @param {number} number - the tournament number selected by the user
 */
function tournamentByNumber(number) {
  let currentTourny = tournaments.getTournamentById(Number(number));
  if (currentTourny instanceof Tournament) {
    const lbData = buildLeaderBoard(currentTourny);
    const lb = new Leaderboard(lbData);
    lb.create(currentTourny.number);
  } else {
    console.log(`Could not find the selected tournament ${number}`);
  }
}

/**
 * Build the points leader board
 */
function buildPointsBoard() {
  // Gets kicked off at creation time in the constructor
  const plb = new PointsLeaderboard();
  plb.build();
}

/**
 * Create a leaderboard for the current tournament
 * 
 * @param {Tournament} currTourny - object that contains the tournament rounds to create the leaderboard from
 */
function buildLeaderBoard(currTourny) {
  let rounds = [];
  let playerMap = new Map();  // key=name, value=[r1,r2,r3,r4]
  let leaderboard = [];
  const pr = new PlayerRounds();

  // Get the records for each of the tournament rounds and the course data for the footer
  currTourny.rounds.forEach((r) => {
    rounds = [...rounds, ...pr.getRoundsByNumber(r.number)];
  });

  // Loop for all of the rounds logged for this tournament
  let tmpPlr = [];
  rounds.forEach(r => {
    if (playerMap.has(r.getName())) {
      tmpPlr = playerMap.get(r.getName());
    } else {
      tmpPlr = [999,999,999,999];
    }
    tmpPlr[r.getRound()-1] = r.getScore();
    playerMap.set(r.getName(), tmpPlr);
  });

  // Convert from a map to array for leaderboard
  for (const [name, scores] of playerMap) {
    leaderboard.push([name, ...scores]);
  }

  return leaderboard;
}