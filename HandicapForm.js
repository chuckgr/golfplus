/**
 * Create a form to enter the Golf scores for a week.
 * 
 * TODO - convert to using Settingsclass to parse the player file
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.* 
 */
class HandicapForm {
  constructor(players) {
    this._ss = SpreadsheetApp.getActiveSpreadsheet();
    this._formSheet = "HandicapForm Responses";
    this._players = players;
    this._form;
    this._url;
    this._editUrl;
    //let tournys = new Tournaments();
    this._tournamentNumbers = new Tournaments().getNumbers();
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
    var form = FormApp.create('Golf plus fun tournaments Handicap input');
    
    // Description of the form
    form.setDescription('Create the amateur and pro handicaps for a player in the Golf plus fun tournaments');
    
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
    form.addListItem()
      .setTitle("Tournament Number")
      .setRequired(true)
      .setChoiceValues(getTournamentNumbers());

    form.addListItem()
      .setTitle("Name")
      .setRequired(true)
      .setChoiceValues(this._players);
    
    let hadicapValidation = FormApp.createTextValidation()
      .setHelpText("Value must be a number from -20 to 40")
      .requireNumberBetween(-20, 40)
      .build();

    form.addTextItem()
      .setTitle("Amateur Handicap")
      .setValidation(hadicapValidation)
      .setRequired(true);

    form.addTextItem()
      .setTitle("Pro Handicap")
      .setValidation(hadicapValidation)
      .setRequired(true);

    // Make sure the form is attached before we try to update it
    SpreadsheetApp.flush();

    // Assign the form responses to the responses sheet (not working yet)
    //form.removeDestination();
    //form.setDestination(FormApp.DestinationType.SPREADSHEET, this._ss.getSheetByName(this._formSheet))

    this._form = form;
    this._url = form.getPublishedUrl();
    this._editUrl = form.getEditUrl();
    Logger.log('HandicapForm:create(): Published URL: ' + this._url);
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
   * See if we have a form already created for this sheet, if not create one,
   * if so update the players question.
   */ 
  _checkForForm() {
    let sheets = this._ss.getSheets();
    let sheetName = "";
    let found = false;
    sheets.forEach((s) => {
      sheetName = s.getSheetName();
      if (sheetName.startsWith('HandicapForm Responses')) {
        if (s.getFormUrl() != null) {
          found = true;
          this._url = s.getFormUrl();
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
      if (sheetName.startsWith('HandicapForm Responses')) {
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
