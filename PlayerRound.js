/**
 * Contains the data/methods for one round of golf
 * 
 * @param {array} - Parameters for this round in the passed object
 *                   {timestamp} - Timestamp when the round was entered
 *                   {date}      - Date of round
 *                   {course}    - Course played
 *                   {round#}    - Round # for this tournament
 *                   {name}.     - Name of player
 *                   {score}     - Score for the round
 */
class PlayerRound {
  constructor(data) {
    this._timestamp = data[0];
    this._date = data[1];
    this._course = data[2];
    this._round = data[3];
    this._name = data[4];
    this._score = data[5];
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
   * Get the torunament round
   */
  getRound() {
    return this._round;
  }
  
  /**
   * Print the record out
   */
  toString() {
    return `${this._date} ${this._course} ${this._name} ${this._round} ${this._score}`
  }
}