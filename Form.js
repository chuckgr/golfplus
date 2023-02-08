/**
 * Create a form to enter the Golf scores for a week.
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.* 
 */
class Form {
  constructor(players) {
    this._ss = SpreadsheetApp.getActiveSpreadsheet();
    this._formSheet = "Form Responses";
    this._players = players;
    this._form;
    this._url;
    this._editUrl;
    // Create the form if not already created
    if (!this._checkForForm()) {
      this.create();
    }
  }
  
  /** 
   * Used to create the form for a specific player round
   */ 
  create() {
    // Create a new form, add the questions for each sample registered
    var form = FormApp.create('Golf+ for fun Weekly Round Score');
    
    // Description of the form
    form.setDescription('Create the responses for a Golf+ round for fun tournaments');
    
    // We will collect email addresses so we can tabulate per person
    form.setCollectEmail(false);
  
    // Update the form's response destination.
    form.setDestination(FormApp.DestinationType.SPREADSHEET, this._ss.getId());
    
    // Only one response per user
    form.setLimitOneResponsePerUser(false);
    
    // Don't allow them to bring the form back up again if false
    form.setShowLinkToRespondAgain(true);
    
    //-----------------------------------------------------------------------
    // Create the prompts for a round
    //-----------------------------------------------------------------------
    form.addDateItem()
      .setTitle("Date of round")
      .setRequired(true)
      .setIncludesYear(true)
      .setHelpText("The date should be in the range of the tournament round or it will not be counted correctrly");

    form.addListItem()
      .setTitle("Tournament Number")
      .setRequired(true)
      .setChoiceValues(getTournamentNumbers());

    form.addListItem()
      .setTitle("Round")
      .setRequired(true)
      .setChoiceValues([1,2,3,4]);

    form.addListItem()
      .setTitle("Name")
      .setRequired(true)
      .setChoiceValues(this._players);
    
    form.addListItem()
      .setTitle("Score")
      .setRequired(true)
      .setChoiceValues(this.getScoreChoices());
    
    // Make sure the form is attached before we try to update it
    SpreadsheetApp.flush();

    // Assign the form responses to the responses sheet
    //form.removeDestination();
    //form.setDestination(FormApp.DestinationType.SPREADSHEET, this._ss.getSheetByName(this._formSheet))


    this._form = form;
    this._url = form.getPublishedUrl();
    this._editUrl = form.getEditUrl();
    Logger.log('Form:create(): Published URL: ' + this._url);
    //Logger.log('Form:create(): Editor URL: ' + this._editUrl); 
  }

  /** 
   * Used to update the form for the players list
   */ 
  update() {
    let form;
    let lists;
    let playerItem;
    if (!this._checkForForm()) {
      this.create();
    } else {
      form = FormApp.openByUrl(this._url);
      lists = form.getItems();
      lists.forEach((l) => {
        // Update the list of players
        if (l.getType() == "LIST" && l.getTitle() == "Name") {
          playerItem = l.asListItem();
          playerItem.setChoiceValues(this._players);
        // Update the tournament numbers 
        } else if (l.getType == "LIST" && l.getTitle() == "Tournament Number") {
          playerItem = l.asListItem();
          playerItem.setChoiceValues(getTournamentNumbers());
        }
      });
    }
  }

  /**
   * Used to recreate the form with all data fields
   */ 
  recreate() {
    let formSheet = this._getFormSheet();
    if (formSheet != null) {
      FormApp.openByUrl(this._url).removeDestination();
      this.create();
    }
  }

  /**
   * Return the url of the form
   */ 
  getUrl() {
    return this._url;  
  }
  
  /**
   *  Set the url of the form
   */
  setUrl(url) {
    this._url = url;  
  }
  
  /** 
   * Get a list of scores to use in the form dropdown, starting score and total
   * number of scores
   */
  getScoreChoices() {
    const numOfScores = 90;
    const startNumber = 60
    return [...Array(numOfScores).keys()].map(i => i+startNumber);
  }

  /**
   * See if we have a form already created for this sheet, if not create one,
   * if so update the players question.
   */ 
  _checkForForm() {
    let sheets = this._ss.getSheets();
    let sheetName = "";
    let found = false;
    sheets.forEach((s) => {
      sheetName = s.getSheetName();
      if (sheetName.startsWith('Form Responses')) {
        if (s.getFormUrl() != null) {
          found = true;
          this._url = s.getFormUrl();
          console.log(this._url);
        }
      }
    });
    return found;
  }

  /** 
   * Return the sheet the form is linked to
   */ 
  _getFormSheet() {
    let sheets = this._ss.getSheets();
    let sheetName = "";
    let found = false;
    let returnSheet = null;
    sheets.forEach((s) => {
      sheetName = s.getSheetName();
      if (sheetName.startsWith('Form Responses')) {
        if (s.getFormUrl() != null) {
          found = true;
          this._url = s.getFormUrl();
          returnSheet = s;
        }
      }
    });
    
    return returnSheet;
  }
}
