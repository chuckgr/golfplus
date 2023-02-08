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
    this._playerData = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName('Players')
      .getDataRange()
      .getValues();
    this._data = new Array();
    this._playerData.forEach((d) => {
      this._data.push(d[0].trim());
    })
  }
  
  /** 
   * Return all of the players
   */ 
  getPlayers() {
    return this._data;
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
