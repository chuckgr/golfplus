/**
 * Contains the data/methods for the handicap for a player for a tournament
 * 
 * @param {array} - Parameters for this round in the passed object
 *                   {number}      - Tournament number this handicap belongs to
 *                   {name}        - Name of player
 *                   {amhandicap}  - Amateur handicap
 *                   {prohandicap} - Pro handicap
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.
 */
class Handicap {
  constructor(data) {
    this._data = data;
    this._tournament = data[1] || 0;
    this._name = data[2].trim();
    this._handicapam = data[3] || -1;
    this._handicappro = data[4] || -1;
  }
  
  /**
   * Define the static status fields
   */
  static get TOURNAMENT()   { return 1;}
  static get NAME()         { return 2;}
  static get HANDICAPAM()   { return 3;}
  static get HANDICAPPRO()  { return 4;}

  /**
   * Get the value of the field as specified by the passed enum
   */
  getField(field) {
    switch (field) {
      case 1:
        return this._tournament;
        break;
      case 2:
        return this._name;
        break;
      case 3:
        return this._handicapam;  
        break;
      case 4:
        return this._handicappro;  
        break;  
      
    }
    return this._data[field];
  }

  /**
   * Get the tournament number
   */
  get tournament() {
    return this._tournament;
  }

  /**
   * Get the players name
   */
  get name() {
    return this._name;
  }

  /**
   * Get the amatuer handicap
   */
  get handicapam() {
    return this._handicapam;
  }
  
  /**
   * Get the pro handicap
   */
  get handicappro() {
    return this._handicappro;
  }
  
  /**
   * Print the record out
   */
  toString() {
    return `${this._name} ${this._tournament} ${this._handicapam} ${this._handicappro}`
  }
}