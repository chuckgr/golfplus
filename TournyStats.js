/**
 * Class to build the tournament stats page
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
class TournyStats {
  constructor() {
    //let playerRnds = new PlayerRounds();
    //let results = [];
    this._t = new Tournaments();
    this._ta = this._t.getTournaments();
  }

  /**
   * Compile when the courses were played and the number of times played
   */
  _getCoursesPlayed() {
    let tmpData = {};
    let rounds = [];
    let coursesPlayed = new Map();

    this._ta.forEach(t => {
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

    //let courseAry = [["Course", "Times Played", "Last played"]];
    /**
     * Convert the Map to an Array
     */
    let courseAry = [];
    for (const [key, value] of coursesPlayed) {
      courseAry.push([key, value.count, new Date(value.date).toLocaleDateString()]);
    }

    /**
     * Sort the array by last played course
     */
    //courseAry.sort((a,b) => new Date(a[2]).getTime() - new Date(b[2]).getTime());
    //courseAry.sort((a,b) => parseInt(b[1]) - parseInt(a[2]));

    return courseAry.sort((a,b) => new Date(a[2]).getTime() - new Date(b[2]).getTime());
  }
  
}