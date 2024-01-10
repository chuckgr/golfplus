/**
 * Settings class 
 * 
 * Settings class will handle all of the settings from a settings sheet.  All settings 
 * need to be identified at build time (no dynamic settings at this point)
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.
 */
class Settings {
  constructor() {
    this._data;
    this._settings = new Map();
    // Setting string to setting
    
    // Row indexes for the settings
    this._nameIndex = 0;
    this._typeIndex = 1;
    this._requiredIndex = 2;
    this._valueIndex = 3;

    // Get the settings data
    this._readSettings();
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

    let name, displayName, type, required;
    let data = [];
    /** Loop for all setting data and create classes  */
    this._data[0].forEach((s,i) => {

      /** Skip the title column */
      if (i!=0) {
        displayName = s.trim();
        name = s.trim().toUpperCase().replace(/ /g, '');
        type = this._data[this._typeIndex][i].trim();
        required = this._data[this._requiredIndex][i];
        
        if (this._data[this._valueIndex][i] != ""){
          let e=this._valueIndex;
          while (e < this._data.length && this._data[e][i] != "") {
            /** NameValue and NumericPair use two columns for the data */
            if (type == "NameValue") {
              data.push([this._data[e][i], this._data[e][i+1]])
            } else {
              data.push(this._data[e][i]);
            }
            e++;
          }
        } 
      
        if (type != "" && type != undefined) {
          let options = {"name":name, "displayName":displayName, "type":type, "required":required, "data":data};
          switch(type) {
            case 'String':
              this._settings.set(name, new StringSetting(options));
              break;
            case '#':
            case '##.##':
              this._settings.set(name, new NumericSetting(options));
              break;
            case 'mm/dd/yyyy':
              this._settings.set(name, new DateSetting(options));
              break;
            case 'NameValue':
              this._settings.set(name, new NameValueSetting(options));
              break;
            default:
              console.log(`No provider for "${type}" type yet`);
              break;
          }
          data = [];
        }
      }
    });
  }

  /**
   * Get the setting value(s) given the setting name, undefined otherwise
   * 
   * @param {string} Setting name to get
   * @return {[values]} - Array of values for this setting
   */
  getSetting(name) {
    if (this._settings.has(name)) {
      return this._settings.get(name);
    } else {
      return undefined;
    }
  }
}