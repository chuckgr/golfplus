/**
 * Web app functions for get/post functions.  By default the idea is that the webapp will display 
 * the current tournament leaderboard.  Buttions will provide access to the points leaderboard 
 * and to select a leaderboard by number.
 */
function doGet(e) {
  if(e.queryString !=='') {  
    console.log(e.parameter.mode);
    switch(e.parameter.mode) {
      case 'pointsboard':
        return HtmlService
          .createTemplateFromFile('pointsboard')
          .evaluate(); 
        break;
      case 'scoreboard':
         return HtmlService
          .createTemplateFromFile('scoreboard')
          .evaluate();
        break;
    }
  } else {
    return HtmlService
         .createTemplateFromFile('LeaderboardTemplate')
         .evaluate();
  }
}

/**
 * This allows the inclusion of html/script files in an html file instead of one large file
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

/**
 * Get the table data to display, includes calculating the score and score to par 
 * before it is returned to the web client
 */
function getData() {
  // Get the latest tournament number and then get that tournament object
  let tnums = tournaments.getNumbers();
  let currTourny = tournaments.getTournamentById(tnums[tnums.length-1]);
  let data = currTourny.leaderboardData;

  // Calculate the total score (with bumpers for sorting) and score to par
  let diffToPar = 0;
  let totalScore = 0;
  let courseData = tournaments.getCourseArray(tnums[tnums.length-1]);
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

  // Normalize the data after the sort to remove the bumpers
  data.forEach((r,i) =>{
    r.forEach((c,j) => {
      if (c==999) {
        data[i][j] = 0;
        data[i][5] -= 999;
      }
    });
  });

  // Turn date obj to date string, can't send Date obj
  let courseDates = courseData[2].map(d => {
    if (d != 'Date') {
      return new Date(d).toLocaleDateString();
    } else {
      return "Date";
    }
  });
  courseData[2] = courseDates;
  
  // Return the table with the par table for the courses
  return {"data":data, "courseData":courseData};
}