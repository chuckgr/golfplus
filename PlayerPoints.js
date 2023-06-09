/**
 * Contains the tournament data for a player to calculate the FedEx points
 * 
 * @param {array} - Parameters for this round in the passed object
 *                   {name}       - Player name
 *                   {score}      - Total score for this player on this tournament
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.
 */
class PlayerPoints {
  constructor(data) {
    this._name = data.name;
    //this._score = data.score;
    this._points = 0;
    this._rank = 0;
    this._events = 0;
    this._numWins = 0;
    this._numTopFive = 0;
    this._matchPlayWins = 0;
  }
  
  /**
   * Define the status field getters
   */
  get points()   { return this._points;}
  get rank() { return this._rank;}
  get events()  { return this._events;}
  get name() { return this._name}
  get wins()  { return this._numWins;}
  get topfive()  { return this._numTopFive;}
  get matchPlayWins() { return this._matchPlayWins;}

  /**
   * Define the status field setters
   */
  set points(points) { this._points = points;}
  set rank(rank) { this._rank = rank;}
  set events(events)  { this._events = events;}
  set wins(numWins)  { this._numWins = numWins;}
  set topfive(numTopFive)  { this._numTopFive = numTopFive;}
  set matchPlayWins(matchPlayWins)  { this._matchPlayWins = matchPlayWins;}

  /**
   * Output the data in an array
   */
  toArray() {
    return [this._rank, this._name, this._points, this._events, this._numWins, this._numTopFive, this._matchPlayWins];
  }

  /**
   * Print the record out
   */
  toString() {
    return `${this._rank} ${this._name} ${this._points} ${this._events} ${this._numWins} ${this._numTopFive} ${this._matchPlayWins}`;
  }
}