/**
 * Contains the data/methods for creating the points leaderboard for a set of tournaments
 * in Golf+ for fun.
 * 
 * Each leaderboard is completely rewritten every time for each leaderboard selected
 * Typical use case are: print the current points board after each round and then
 * final leaderboard at the end of the tournament.                             
 * 
 * @param {PlayerRound[]} - Array of player rounds for this 
 * TODO - Determine what tournaments are in the points run (what is the key?)
 *      - Determine the layout of the leaderboard
 *      - What function/methods can be shared with LeaderBoard class
 */
class PointsLeaderboard {
  
  constructor(data) {
    this._data = data;
  }
}