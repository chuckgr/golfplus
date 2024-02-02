/** 
 * Get all the player handicaps from the sheet named "HandicapForm Responses" 
 * to calculate handicap value for the leaderboards.
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.
 */ 
class Handicaps {
  constructor() {
    this._handicapSheet = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName('HandicapForm Responses');
    this._handicapData = this._handicapSheet
      .getDataRange()
      .getValues();
    this._handicapData = this._handicapData.slice(1);

    /** Create Handicap objects with the records and put into an array */
    this._data = new Array();
    this._handicapData.forEach((d) => {
      this._data.push(new Handicap(d));
    })
  }
  
  /** 
   * Return all of the Handicaps
   * 
   * @return {array} Array of all Handicap objects
   */ 
  getHandicaps() {
    return this._data;
  }

  /**
   * Get all of the 'Handicap' objects with the requested id
   * 
   * @param {number} Number of the tournament the handicaps are associated with
   */
  getHandicapsById(id) {
    return this._data.filter(h => h.tournament == id);
  }

  /**
   * Get the player handicap data (tournament, name, am handicap, pro handicap) for the passed player name
   * 
   * @param {string} Name of the player to get the data for
   * @return {object} Object with the player data: tournament, name, am handicap, pro handicap
   */
  getPlayerHandicapData(player) {
    return this._data.filter(h => h.name == player);
  }

  /**
   * Make this object implenent the iterator interface so we can loop over the list
   */
  [Symbol.iterator]() {
    let index = -1;
    let data  = this._data;

    return {
      next: () => ({ value: data[++index], done: !(index in data) })
    };
  };
}
