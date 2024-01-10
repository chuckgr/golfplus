/**
 * Contains the data/methods for the courses in Golf+
 *
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product. 
 * 
 */
class Courses {
  constructor() {
    this._setting = settings.getSetting("COURSES");
    this._data = this._setting.value;
  }

  /**
   * Return the courses array
   * 
   * @return {array} 2d Array with [Course Name, Par] for each course
   */
  getCourses() {
    return this._data;
  }

  /**
   * Get number of Courses
   * 
   * @return {number} Number of courses
   */
  static getNumberOfCourses() {
    return this._data.length;
  }

  /**
   * Get par for a course
   * 
   * @param {string} Course name to search for
   * @return {number} Par for course or undefined 
   */
  getPar(course) {
    let courseAry = this._data.find(c => c[0] == course);
    if (courseAry != undefined) {
      return courseAry[1];
    } else {
      return undefined;
    }
  }

}
  