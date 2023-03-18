/** 
 * Contains the data/methods for a tournament round in Golf+ for fun
 * 
 * @param {object} - Object with tournament settings data
 *                     - number: Tournament Number
 *                     - date: Start Date
 *                     - course: Course being played
 *                     - tees: Tees location
 *                     - pins: Difficulty of Pins
 *                     - greens: Green speed 
 *                     - wind: Wind speed
 *                     - level: Player Level
 *                     - name: Tournament name (if any)
 *                `    - status: Complete or In Progress
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.
 */
class TournamentRound {
  constructor(data) {
    this._data = data;
    this._parseData(this._data);
    this._valid = this.isValid();
  }

  /**
   * Parse the data passed and put in individual variables
   * 
   * @param {array} Data array from spreadsheet
   */
  _parseData(data) {
    this._number = data[0];
    this._date = data[1];
    this._course = data[2];
    this._tees = data[3];
    this._pins = data[4];
    this._greens = data[5];
    this._wind = data[6];
    this._level = data[7];
    this._name = data[8];
    this._status = data[9];
  }

  /**
   * Check to see we have all required data for a valid tournament
   */
  isValid() {
    return (this._number != "" &&
             this._date != "" &&
             this._course != "" &&
             this._tees != "" &&
             this._pins != "" &&
             this._greens != "" &&
             this._wind != "" &&
             this._level != "" &&
             this._name != "" &&
             this.status != ""
             );
  }


  /**
   * Getter for Number
   */
  get number() {
    return this._number;
  }

  /**
   * Getter for Date
   */
  get date() {
    return this._date;
  }

  /**
   * Getter for Course
   */
  get course() {
    return this._course;
  }

  /**
   * Getter for Tees
   */
  get tees() {
    return this._tees;
  }

  /**
   * Getter for Pins
   */
  get pins() {
    return this._pins;
  }

  /**
   * Getter for greens
   */
  get greens() {
    return this._greens;
  }

  /**
   * Getter for Wind
   */
  get wind() {
    return this._wind;
  }

  /**
   * Getter for Level
   */
  get level() {
    return this._level;
  }

  /**
   * Getter for Tournament name
   */
  get name() {
    return this._name;
  }

  /**
   * Getter for torunament status, "In progress" or "Complete"
   */
  get status() {
    return this._status;
  }

  /**
   * Print the settings out
   */
  toString() {
    return `${this._number} ${this._date} ${this._course} ${this._tees} ${this._pins} ${this._greens} ${this._wind} ${this._level}` 
  }
}