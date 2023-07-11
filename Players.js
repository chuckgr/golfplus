/** 
 * Get all the players from the sheet named "Players" for creating the
 * form and whatever else we need.
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.
 */ 
class Players {
  constructor() {
    this._playerSheet = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName('Players');
    this._playerData = this._playerSheet
      .getDataRange()
      .getValues();
    this._data = new Array();
    let plrObj = {};
    this._playerData.forEach((d) => {
      this._data.push(new Player(d));
    })
  }
  
  /** 
   * Return all of the players
   */ 
  getPlayers() {
    return this._data;
  }

  /**
   * Add a new player to the database of players
   * 
   * @param {string} player to add to the player list
   */
  add(player) {
    let rc = 0;
    if (!this._data.find(p => p == player.trim())) {
      let dataRange = this._playerSheet.getDataRange();
      this._playerSheet.getRange(dataRange.getRow()+1, 1, 1, 1).setValue(player.trim());
      this._playerSheet.sort(1);
    } else {
      // Already in database
      rc = -1;
    }
    return rc;
  }

  /**
   * Get the player data (name, username, handicap) for the passed player name
   * 
   * @param {string} Name of the player to get the data for
   * @return {object} Object with the player data: name, username, handicap
   */
  getPlayerData(player) {
    return this._data.filter(p => p.name == player);
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
