/** 
 * Get all the players from the sheet named "Players" for creating the
 * form and whatever else we need.
 */ 
class Players {
  constructor() {
    this._playerData = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName('Players')
      .getDataRange()
      .getValues();
    this._data = new Array();
    this._playerData.forEach((d) => {
      this._data.push(d[0]);
    })
  }
  
  /** 
   * Return all of the players
   */ 
  getPlayers() {
    return this._data;
  }
}
