/**
 * 
 * Contains the data/methods for the courses in Golf+
 *
 * Copyright 2023 Chuck Grieshaber, All rights reserved.
 * Code can be used freely as long as the copyright statement is kept with 
 * all code used and the code is not used in a commercial product. 
 */
class Courses {
  constructor() {
  }

  /**
   * Define the static map names
   */
  static get ALPINE() { return "Alpine";}
  static get CLIFFS() { return "Cliffs";}
  static get CASTLELINKS() { return "Castle Links";}
  static get KIAWAH() { return "Kiawah";}
  static get PINEHURST() { return "Pinehurst";}
  static get PEBBLEBEACH() { return "Pebble Beach";}
  static get VALHALLA() { return "Valhalla";}
  static get WOLFCREEK() { return "Wolf Creek";}
  static get SCOTTSDALE() { return "TPC Scottsdale";}
  static get SAWGRASS() { return "TPC Sawgrass";}
  static get SOUTHWIND() { return "TPC Southwind";}
  static get YALE() { return "Yale";}
  static get OLYMPIAFIELDS() { return "Olympia Fields";}
  static get EASTLAKE() { return "East Lake";}
  static get OLDCOURSE() { return "Old Course";}
  static get KAPALUA() { return "Kapalua";}


  /**
   *  Return the map names in an array
   */
  static getCourses() {
    return [
            Courses.CLIFFS, 
            Courses.ALPINE, 
            Courses.CASTLELINKS, 
            Courses.KIAWAH, 
            Courses.PINEHURST, 
            Courses.PEBBLEBEACH, 
            Courses.VALHALLA, 
            Courses.WOLFCREEK,
            Courses.SCOTTSDALE,
            Courses.SAWGRASS,
            Courses.SOUTHWIND,
            Courses.YALE,
            Courses.OLYMPIAFIELDS,
            Courses.EASTLAKE,
            Courses.OLDCOURSE,
            Courses.KAPALUA
            ];
  }

  /**
   * Get number of Courses
   */
  static getNumberOfCourses() {
    return Courses.getCourses().length;
  }

  /**
   * Get par for a course
   */
  static getPar(course) {
    this._par = 
      {"Cliffs":71,
       "Alpine":71,
       "Castle Links":72,
       "Kiawah":72,
       "Pinehurst #2":72,
       "Valhalla":72,
       "Wolf Creek":72,
       "Pebble Beach":72,
       "TPC Scottsdale":71,
       "TPC Sawgrass":72,
       "TPC Southwind":71,
       "Yale":70,
       "Olympia Fields":70,
       "East Lake":70,
       "Old Course":72,
       "Kapalua":73
      };
    return this._par[course];
  }
}
  