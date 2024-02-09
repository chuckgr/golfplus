/** 
 * Get all the player handicaps from the sheet named "HandicapForm Responses" 
 * to calculate handicap value for the leaderboards.
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product.
 */ 
class Handicaps {
  constructor() {
    if (0) {
      console.log(`Read from File`);
      this._handicapSheet = SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName('HandicapForm Responses');
      this._handicapData = this._handicapSheet
        .getDataRange()
        .getValues();
      this._handicapData = this._handicapData.slice(1);
    }

    /** Create Handicap objects with the records and put into an array */
    this._data = new Array();
    this._handicapData = this._parseHandicapData();
    this._handicapData.forEach((d) => {
      this._data.push(new Handicap(d));
    })
  }

  /**
   * Parse handicap data from the PlayerRounds instead of a separate sheet
   * 
   * @return {array} Array containg handicap data for each player
   *                  [0, tournament Number, Player, Amateur handicap, Pro handicap]
   */
  _parseHandicapData() {
    let courseSettings;
    let handiCourseLevel;
    let handicapMap = new Map();
    let plyrsAry = [];
    let binAry = [];
    let plrIndex = -1;
    let nameIndex = 2;
    let levelLoc = new Map();
    levelLoc.set("Amateur",3);
    levelLoc.set("Pro", 4);
    let tmpAry = [];
    for (const p of playerRounds) {
      if (p.getNumber() > 24.01) {
        courseSettings = tournaments.getTournamentById(p.getNumber()).rounds;
        handiCourseLevel = courseSettings[p.getRound()-1].level;
        if (handicapMap.has(p.getNumber())) {
          plyrsAry = handicapMap.get(p.getNumber());
          plrIndex = plyrsAry.findIndex(pi => pi[nameIndex] == p.getName());
          if (plrIndex>-1){
            binAry = plyrsAry[plrIndex];
            if (p.getHandicap()>=0) {
              binAry[levelLoc.get(handiCourseLevel)] = Math.max(binAry[levelLoc.get(handiCourseLevel)], p.getHandicap());
            } else {
              binAry[levelLoc.get(handiCourseLevel)] = Math.min(binAry[levelLoc.get(handiCourseLevel)], p.getHandicap());
            }
            plyrsAry[plrIndex] = binAry;
            handicapMap.set(p.getNumber(), plyrsAry);
          } else {
            tmpAry = [0, p.getNumber(),p.getName(), 0, 0];
            tmpAry[levelLoc.get(handiCourseLevel)] = p.getHandicap();
            plyrsAry.push(tmpAry);
            handicapMap.set(p.getNumber(), plyrsAry);
          }
        } else {
          tmpAry = [0, p.getNumber(), p.getName(), 0, 0];
          tmpAry[levelLoc.get(handiCourseLevel)] = p.getHandicap();
          handicapMap.set(p.getNumber(), [tmpAry]);
        }
      }
    }

    /** Package all tournament handicaps in one array */
    let retary = [];
    for (const [key,value] of handicapMap) {
      retary = [...retary, ...value];
    }
    return retary;
  }
  
  /** 
   * Return all of the Handicaps
   * 
   * @return {array} Array of all Handicap objects
   */ 
  getHandicaps() {
    return this._data;
  }

  /**
   * Get all of the 'Handicap' objects with the requested id
   * 
   * @param {number} Number of the tournament the handicaps are associated with
   */
  getHandicapsById(id) {
    return this._data.filter(h => h.tournament == id);
  }

  /**
   * Get the player handicap data (tournament, name, am handicap, pro handicap) for the passed player name
   * 
   * @param {string} Name of the player to get the data for
   * @return {object} Object with the player data: tournament, name, am handicap, pro handicap
   */
  getPlayerHandicapData(player) {
    return this._data.filter(h => h.name == player);
  }

  /**
   * Make this object implenent the iterator interface so we can loop over the list
   */
  [Symbol.iterator]() {
    let index = -1;
    let data  = this._data;

    return {
      next: () => ({ value: data[++index], done: !(index in data) })
    };
  };
}
