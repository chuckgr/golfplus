/** 
 * Contains the data/methods for hadicaps for a tournament in Golf+ for fun
 * 
 * @param {object} - Object with Handicap objects for each player and one tournament (if defined)
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.
 */
class TournamentHandicaps {
  constructor(data) {
    this._data = data;
    this._baseAm = this.getBaseHandicap('amateur');
    this._basePro = this.getBaseHandicap('pro');
  }

  /**
   * Get the base Handicap (highest) object to base all other strokes given for a level.
   */
  getBaseHandicap(level) {
    let highest = null;
    //let score = 0
    this._data.forEach(h => {
      if (highest == null) { highest = h;}
      if (level == 'amateur') {
        if (highest.getField(Handicap.HANDICAPAM) < h.getField(Handicap.HANDICAPAM)) {
          highest = h;
        }
      } else {
        if (highest.getField(Handicap.HANDICAPPRO) < h.getField(Handicap.HANDICAPPRO)) {
          highest = h;
        }
      }
    });
    return highest;
  }

  /**
   * Get the strokes for a player by level
   * 
   * @param {string} Player name to get the strokes for
   * @param {string} Level strokes to be returned for; 'amateur' or 'pro'
   */
  getStrokes(player, level) {
    let playerHandicap;
    let returnHandicap = 0
    if (level == 'amateur') {
      if (this._baseAm.name != player) {
        playerHandicap = this._data.filter(h => h.name == player)[0];
        if (this._data.find(h => h.name == player)) {
          returnHandicap = this._baseAm.getField(Handicap.HANDICAPAM) - playerHandicap.getField(Handicap.HANDICAPAM);
        }
      }
    } else {
      if (this._basePro.name != player) {
        playerHandicap = this._data.filter(h => h.name == player)[0];
        if (this._data.find(h => h.name == player)) {
          returnHandicap = this._basePro.getField(Handicap.HANDICAPPRO) - playerHandicap.getField(Handicap.HANDICAPPRO);
        }
      }
    }
    return Math.floor((returnHandicap * 100))/100;
  }

  /**
   * Print the settings out
   */
  toString() {
    return `${this._number} ${this._date} ${this._course} ${this._tees} ${this._pins} ${this._greens} ${this._wind} ${this._level}` 
  }
}