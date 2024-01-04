/**
 * Web app functions for get/post functions.  By default the idea is that the webapp will display 
 * the current tournament leaderboard.  Buttions will provide access to the points leaderboard 
 * and to select a leaderboard by number.
 */
function doGet(e) {
    return HtmlService
         .createTemplateFromFile('LeaderboardTemplate')
         .evaluate()
         .setTitle('Golf+ Fun Tournaments');
}

/**
 * This allows the inclusion of html/script files in an html file instead of one large file
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

/**
 * Function will load an image from Google Drive to be loaded by the webapp
 * 
 * @param {string} ID of the image file to load from Drive, if not provided 
 *                  a default image will be used
 */
function loadImageBytes(imageId) {
  const defaultId = "1__dNiEx3vdPH_SHQJw9igHyYJWY2iLt0" // TPC Scotsdale
  if (imageId === null || imageId === undefined) {
    imageId = defaultId;
  } 

  let bytes = DriveApp.getFileById(id)
    .getBlob()
    .getBytes();
  return Utilities.base64Encode(bytes);
}

/**
 * Get the table data to display, includes calculating the score and score to par 
 * before it is returned to the web client
 */
function getData(options) {
  //console.log(`getData: ${JSON.stringify(getData)}`);
  let tnums = tournaments.getNumbers();
  let tnum = tnums[tnums.length-1];

  /**  Check the request */
  switch(options.request) {
    case 'leaderboard':

      /** Save the location information of the user */
      if (options.hasOwnProperty('userInfo')) {
        if (options.userInfo.hasOwnProperty('location')) {
          saveLocation(options.userInfo.location);
        }
      }

      /** Check if it's for current tourny or previous one  */
      if (options.number !== 'current') {
        tnum = Number(options.number);
      } 

      /** Get the tournament object to gather data from */
      currTourny = tournaments.getTournamentById(tnum);
      return getLeaderboardData(options);
      break;
    case 'pointsboard':
      const plb = new PointsLeaderboard();
      return {"options": options, "pointsData":plb.getData(), "pointsEvents":plb.getNumberOfEvents()};
      break;
    case 'stats':
      const stats = new Stats(); 
      return {"options": options, "statsData":stats.getStats()};
      break;
  }
}

/**
 * Get the leaderboard data to return to the web client
 */
function getLeaderboardData(options) {
  let currTourny;
  let tnums = tournaments.getNumbers();
  let tnum = tnums[tnums.length-1];

  /** 
   * Check the request
   * 
   * TODO - remove the switch at some point since the check is being done in getData() function 
   */
  switch(options.request) {
    case 'leaderboard':
      if (options.number !== 'current') {
        tnum = Number(options.number);
      } 
      currTourny = tournaments.getTournamentById(tnum);
      //console.log(`switch on leaderboard get currTourny`);
      break;
    case 'pointsboard':
      break;
    case 'stats':
      break;
  }
  
  // Using the tournament number get that tournament object
  let data = currTourny.leaderboardData;

  /**
   * Calculate the total score (with bumpers for sorting) and score to par
   */ 
  let diffToPar = 0;
  let totalScore = 0;
  let courseData = tournaments.getCourseArray(tnum);
  data.forEach((r,i) => {
    r.forEach((s,j) => {
      if (j>0 && j<5) {
        totalScore += s;
        if (parseInt(s) != 999) {
          diffToPar = diffToPar + (parseInt(s) - courseData[1][j]);
        }
      }
    });
    data[i].push(totalScore);
    data[i].push(diffToPar);
    diffToPar = 0;
    totalScore = 0;
  });

  // Sort the array
  data.sort((a,b) => a[5]-b[5]);

  /**
   * Normalize the data after the sort to remove the bumpers
   */
  data.forEach((r,i) =>{
    r.forEach((c,j) => {
      if (c==999) {
        data[i][j] = 0;
        data[i][5] -= 999;
      }
    });
  });

  /**
   * Turn date obj to date string, can't send Date obj
   */
  let courseDates = courseData[2].map(d => {
    if (d != 'Date') {
      return new Date(d).toLocaleDateString();
    } else {
      return "Date";
    }
  });
  courseData[2] = courseDates;
  // Remove the dates 
  courseData.splice(2,1);

  /**
   * Get the tournament names/valiues for the dropdown selection
   */
  let tournys = tournaments.getTournaments();
  let tournyNameValues = [];
  tournys.forEach(t => {
    tournyNameValues.push([t.number, t.name]);
  });
  tournyNameValues.sort((a,b) => b[0]-a[0]);

  /**
   * Get the start and end dates for the tournament
   */
  let dates = currTourny.tournamentDates;
  let oneDay = (24 * 60 * 60 * 1000);
  let dateString = `${new Date(dates[0]).toLocaleDateString()} - ${new Date(new Date(dates[dates.length-1]).getTime()+(7*oneDay)).toLocaleDateString()}`;

  //console.log(`package up the data`);
  /**
   * Package up the data to return to the web client
   */
  let tournamentData = {"name": currTourny.name, 
                        "lastUpdate": currTourny.latestRoundDate,
                        "nameValues": tournyNameValues,
                        "tournyDates": dateString};
  
  // Return the reults with the original request, table data, table for the courses
  return {"options":options, "data":data, "courseData":courseData, "tournyData":tournamentData};
}

/**
 * Add the location information to the backup file
 * 
 * @param {array} - Array with the long,lat of the users browser
 */
function saveLocation(location) {
  let bkup = new Backup();
  bkup.open();
  bkup.addLocation(location);
}
