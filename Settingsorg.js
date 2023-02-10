/** 
 * 
 * Settings class that contains the information from the Setting sheet concerning settings
 * 
 * Settings in the table are organized as such in previous product that we are basing this on
 * Row 2 - Setting name 
 *  "  3 - not used (take this out for our version)
 *  "  4 - Type format for the field (what are the options?)
 *         # - {number} one or more # indicate numbers and digits
 *         mm/dd/yyyy - {date}
 *         mm/dd/yyyy hh:mm:ss- {dateTime}
 *  "  5 - Required field 
 *         "required" "automatic" (need to understand this one)
 *  "  6+  Data for setting
 *         array of values or single value
 * 
 * TODO - Convert to class, validate types, test
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.
 */ 
class Settingsorg {
  constructor() {
    this._dateTimeFormat = 'mm/dd/yyyy hh:mm:ss';
    this._dateFormat = 'mm/dd/yyyy';
    this._numberFormat = '#';
    this._nameLoc = 0;
    this._typeLoc = 1;
    this._requiredLoc = 2;
    this._data = SpreadsheetApp.getActiveSpreadsheet()
                  .getSheetByName('Settings')
                  .getDataRange()
                  .getValues();
    let setObj;

    // OLD info from previous project for reference only
    // Start on 2nd row, 2nd colum for 65 rows and 24 columns
    //var data = sheet.getRange(2, 2, 65, 24)
    //                .getValues();
    var data = setObj.data;
    this._settings = [];
    var name, displayName, type, required, setting;
    let value = [];
  
  // Loop for all settings and create a setting object for each
  for (var i=0; i<data[0].length; i++) {
    // Assure we have a setting name
    if (data[this._nameLoc][i].trim() !== "") {
      displayName = data[0][i];
      // Save the setting name and remove blanks between
      name = data[0][i].toUpperCase()
                       .replace(/ /g, '');
      // Determine the setting type
      var settingType = data[2][i];
      if (data[this._typeLoc][i] === 'mm/dd/yyyy hh:mm:ss') {
        type = 'Datetime';
      } else if (data[this._typeLoc][i] === 'mm/dd/yyyy') {
        type = 'Date';
      } else if (data[this._typeLoc][i] === '###' || 
                data[this._typeLoc][i] === '##' || 
                data[this._typeLoc][i] === '#') {
        type = 'Number';
      } else {
        // Undefined type that we just grab the data for
        // - do we need to define?
        type = data[this._typeLoc][i];
      }
      
      // Determine if its a required field
      required = data[this._requiredLoc][i];
      // Enum of values if the first row is not empty
      if (data[4][i] !== '') {
        var e = 4+0;
        while (data[e][i] !== '') {
          value.push(data[e][i]);
          e++;
        }
      } 

      // Add the setting to the list of settings
      this.settings.push(new Setting(name, displayName, type, required, value));
      value =[];
    }
  }
  }   
  
  /**
   * Return the array of all of the settings
   */
  getSettings() {
    return this.settings;
  }
  
  /** 
   * Return the setting for the passed setting name
   */ 
  getSetting(name) {
    return this.settings.filter((s) => s.name === name );
  }

  /**
   * Return the setting for the passed setting name
   */ 
  getSettingType(name) {
    let toCheck = this.getSetting(name);
    return toCheck[0].type;
  }

  
  /** 
   * Return the setting for the passed setting name
   */ 
  getRequiredSettings(name) {
    return this.settings.filter((s) =>  s.required === 'Required');
  }

/** 
 * Search for a setting and return the values array
 */ 
  getValues(name) {
    var fs = this.settings.filter((s) => s.name === name);
    return fs[0];
  }

  /**  
   * Search for a setting and return the values array
   */ 
  find(name) {
    var fs = this.settings.filter((s) => s.name === name);
    return fs[0];
  }

  /**
   *  A Checkbox setting is made up of several columns with the same name, if required then one
   *  of the resulting settings need to be set
   */ 
  getCheckbox(name) {
    return this.settings.filter((s) => s.value[0] === name && s.type === 'Checkbox');
  }
  
  /** 
   * A Checkbox setting is made up of several columns with the same name, This returns each of the 
   * setting names that are Checkboxes in an array
   */ 
  getCheckboxSettings() {
    return this.settings.filter((s) =>  s.type === 'Checkbox');
  }

}
