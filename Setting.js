/**
 * Contains the data/methods for one setting
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
class Setting {
  constructor(data) {
    this._data = data;
  }
  
  /**
  * Get the nme of this setting
  */
  get name() {
    return this._data.name;  
  }

  /**
   * Get the display name
   */
  get displayName() {
    return this._data.displayName;
  }

  /**
   * Get the type
   */
  get type() {
    return this._data.type;
  }

  /**
   * Get the torunament round
   */
  get required() {
    return this._data.required;
  }

  /**
   * Get the value of the setting
   */
  get value() {
    return this._data.value;
  }
  
  /**
   * Print the record out
   */
  toString() {
    return `${this._data.name} ${this._data.displayName} ${this._data.type} ${this._data.required} ${this.__data.value}`
  }
}