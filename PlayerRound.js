/**
 * Contains the data/methods for one round of golf
 * 
 * @param {array} - Parameters for this round in the passed object
 *                   {timestamp} - Timestamp when the round was entered
 *                   {date}      - Date of round
 *                   {number}    - Tournament number this round belongs to
 *                   {round#}    - Round # for this tournament
 *                   {name}.     - Name of player
 *                   {score}     - Score for the round
 */
class PlayerRound {
  constructor(data) {
    this._data = data;
    this._timestamp = data[0];
    this._date = data[1];
    this._number = data[2];
    this._round = data[3];
    this._name = data[4];
    this._score = data[5];
  }
  
  /**
   * Define the static status fields
   */
  static get DATE()   { return 1;}
  static get NUMBER() { return 2;}
  static get ROUND()  { return 3;}
  static get PLAYER() { return 4}
  static get SCORE()  { return 5;}

  /**
   * Get the value of the field as specified by the passed enum
   */
  getField(field) {
    return this._data[field];
  }

  /**
  * Get the date of this round
  */
  getDate() {
    return this._date;  
  }

  /**
   * Get the players name
   */
  getName() {
    return this._name;
  }

  /**
   * Get the score
   */
  getScore() {
    return this._score;
  }

  /**
   * Get the tournament number
   */
  getNumber() {
    return this._number;
  }
  /**
   * Get the tournament round
   */
  getRound() {
    return this._round;
  }
  
  /**
   * Print the record out
   */
  toString() {
    return `${this._date} ${this._number} ${this._name} ${this._round} ${this._score}`
  }
}