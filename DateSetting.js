/**
 * Class for a DateSetting
 * 
 * @param {object} - Parameters for this setting in the passed object
 *                   {name}         - Name of this setting
 *                   {displayName}  - Text to display for the setting
 *                   {type}         - Type of setting
 *                   {required}     - If the setting is required to be defined
 *                   {value}        - Value for this setting
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product. 
 */
class DateSetting extends Setting {
  constructor(data) {
    super(data);
  }

  /**
   * Get the value of the setting
   */
  get value() {
    return this._value;
  }
  
}