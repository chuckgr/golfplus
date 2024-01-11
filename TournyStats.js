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
  
  /**
   * Get the number of tourny rounds "Pro" and "Amateur"
   * 
   * @return {object} Keys Pro and Amateur with number of rounds for each
   */
  _getNumberOfRoundsByLevel() {
    let tary = tournys.getTournaments();
    let tRnds = []
    let proRnds = 0;
    let amRnds = 0;
    tary.forEach(t => {
      tRnds = t.rounds;
      tRnds.forEach(r => {
        if (r.level == "Pro") {
          proRnds += 1;
        } else {
          amRnds += 1;
        }
      });
    });
    return {"Amateur": amRnds, "Pro": proRnds};
  }
    
}