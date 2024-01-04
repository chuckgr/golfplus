/**
 * Class to build the player stats page
 * 
 * Stats to compile in no order:
 * - Total rounds
 * - Tournaments played/completed
 * - Lowest score on each course
 * - Highest score on each course
 * - Avg score for a course/ overall average
 * 
 * TODO - Complete and test
 * 
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product. 
 */
class Stats {
  constructor() {
    //let playerRnds = new PlayerRounds();
    //let results = [];
  }

  /**
   * Build the results by parsing the data records for each player that has a round
   * posted.
   */
  _parseRecords() {

  }

  /**
   * Create a array of the courses played and when
   */
  _getCoursesPlayed() {
    let t = new Tournaments();
    let coursesPlayed = new Map();
    let ta = t.getTournaments();
    let rounds = [];
    let rData = {};
    let tmpData = {};
    //console.log(`Course.  Times Played.  last Played`);
    ta.forEach(t => {
      rounds = t.rounds;
      rounds.forEach(r => {
        if (coursesPlayed.has(r.course)) {
          tmpData = coursesPlayed.get(r.course);
          tmpData.count = tmpData.count+1;
          tmpData.date = Math.max(tmpData.date, r.date);
          coursesPlayed.set(r.course, tmpData);
        } else {
          coursesPlayed.set(r.course, {"count":1, "date":r.date});
        }
      });
    });
    /** Convert Map object to multi-dimentional array */
    //let courseAry = [["Course", "Times Played", "Last played"]];
    let courseAry = [];
    for (const [key, value] of coursesPlayed) {
      courseAry.push([key, value.count, new Date(value.date).toLocaleDateString()]);
      /** Print the array */
      console.log(`${key} ${value.count} ${new Date(value.date).toLocaleDateString()}`);
    }

    /**
    * Sort the array
    */
    //courseAry.sort((a,b) => a[1] - b[1]); // Sorts on times played, low -> high
    courseAry.sort((a,b) => new Date(a[2]).getTime() - new Date(b[2]).getTime()); // Sorts on date, old to new
    courseAry.forEach(c => console.log(`${c[0]} ${c[1]} ${c[2]}`));

    return courseAry;
  }

  /**
   * 
   */
  getStats() {
    return this._getCoursesPlayed();
  }
}