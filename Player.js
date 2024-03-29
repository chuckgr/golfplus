/**
 * Contains the data/methods for one player of golf
 * 
 * @param {array} - Parameters for this round in the passed object
 *                   {timestamp} - Timestamp when the round was entered
 *                   {date}      - Date of round
 *                   {number}    - Tournament number this round belongs to
 *                   {round#}    - Round # for this tournament
 *                   {name}.     - Name of player
 *                   {score}     - Score for the round
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.
 */
class Player {
  constructor(data) {
    this._data = data;
    this._name = data[0].trim();
    this._username = data[1].trim() || "";
    this._handicapam = data[2] || -1;
    this._handicappro = data[3] || -1;
    this._inTourny = data[4] || 0;
    //console.log(`Player: name- ${this._name} username- ${this._username} handicap- ${this._handicap}`);
  }
  
  /**
   * Define the static status fields
   */
  static get NAME()         { return 0;}
  static get USERNAME()     { return 1;}
  static get HANDICAPAM()   { return 2;}
  static get HANDICAPPRO()  { return 3;}
  static get INTOURNEY()    { return 4;}

  /**
   * Get the value of the field as specified by the passed enum
   */
  getField(field) {
    switch (field) {
      case 0:
        return this._name;
        break;
      case 1:
        return this._username;
        break;
      case 2:
        return this._handicapam;  
        break;
      case 3:
        return this._handicappro;  
        break;  
      case 4:
        return this._inTourny;
        break;
    }
    return this._data[field];
  }

  /**
  * Get the date of this round
  */
  get userName() {
    return this._username;  
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
    return `${this._name} ${this._username} ${this._handicapam} ${this._handicappro} ${this._inTourny}`
  }
}