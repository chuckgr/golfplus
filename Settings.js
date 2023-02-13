/**
 * Settings class 
 * 
 * Settings class will handle all of the settings from a settings sheet.  All settings 
 * need to be identified at build time (no dynamic settings at this point)
 */
class Settings {
  constructor() {
    this._data;
    // Row indexes for the settings
    this._nameIndex = 0;
    this._typeIndex = 1;
    this._requiredIndex = 2;
    this._valueIndex = 3;
  }

  /**
   * Read all of the settings into data structures for access by the main classes
   * then parse them into setting classes based on the type of setting
   */
  _readSettings() {
    this._data = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName('Settings')
      .getDataRange()
      .getValues();

    // Loop for all setting data and create classes
    this._data.forEach((s,i) => {
      

    });

  }
}