/**
 * Base class for a setting, each type will have it's own class
 * 
 * @param {object} - options - Parameters for this setting in the passed object
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
  constructor(options) {
    this._name = options.name;
    this._displayName = options.displayName;
    this._type = options.type;
    this._required = options.required;
    this._value = options.data;
  }
  
  /**
  * Get the name of this setting
  */
  get name() {
    return this._name;  
  }

  /**
   * Get the display name
   */
  get displayName() {
    return this._displayName;
  }

  /**
   * Get the type
   */
  get type() {
    return this._type;
  }

  /**
   * Get the require flag
   */
  get required() {
    return this._required;
  }

  /**
   * Get the value of the setting
   */
  get value() {
    return this._value;
  }
  
  /**
   * Print the record out
   */
  toString() {
    return `${this._name} ${this._displayName} ${this.type} ${this.required} ${this.value}`
  }
}