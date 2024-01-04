/**
 * Test sourting a multi-dimentioned array (courses played)
 */
function test_sortMultiArray() {
  /** First the courses played and put them in an array */
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

}

/**
 * test the new TournyStats class
 */
function test_tournystats() {
  let ts = new TournyStats();
  let results = ts._getCoursesPlayed();
  console.log(`${results}`);
}
/**
 * Test saving the location information to backup file
 */
function test_locationSave() {
  let location = [ 38.0084519, -84.7723677 ];
  //const locRec = [new Date().toLocaleDateString(), location[0].toString(), location[1].toString()];
  //console.log(`${locRec}`);
  let bkup = new Backup();
  bkup.open();
  bkup.addLocation(location);
}

/**
 * test getting tournaments in progress
 */
function test_inprogress() {
  let ip = tournaments.getInprogressTournament();
  console.log(`Tournament ${ip._number} - ${ip._name}\n`);
  ip._rounds.forEach((r,i) => {
    console.log(`Round ${i+1} - ${r._course}, ${r._tees} tees, ${r._pins} pins, ${r._wind} wind, ${r._greens} greens, ${r._level}\n`);
  });
  //console.log(ip);
}

/**
 * Test getting items from object using array index
 */
function test_getObjFromAry() {
  const data =[
    ["Course","Olympia Fields","TPC Sawgrass"],
    ["Par",70,72],
    ["Difficulty","Amateur","Amateur"],
    ["Tees","Front","Middle"],
    ["Pins","Medium","Easy"],
    ["Wind","High","Low"],
    ["Green Speed","Pro","Pro"]
  ];
  const titles = ["Tees", "Pins", "Wind", "Green Speed"];
  const teeLocation = {
    "Front":`<svg width="8" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 27">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M.36 0c3.67.53 7.4.53 11.08 0v1.88L8.86 4.65a4.7 4.7 0 0 0-1.26 3.6H4.2a5.4 5.4 0 0 0-1.38-3.6A93.1 93.1 0 0 1 .36 1.88V0Z" fill="#C44242"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.2 7.6h3.4v14.2l-1.7 4.8-1.7-4.8V7.6Z" fill="#C44242"></path>
    </svg>`,
    "Middle":`<svg width="8" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 27">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M.36 0c3.67.53 7.4.53 11.08 0v1.88L8.86 4.65a4.7 4.7 0 0 0-1.26 3.6H4.2a5.4 5.4 0 0 0-1.38-3.6A93.1 93.1 0 0 1 .36 1.88V0Z" fill="white"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.2 7.6h3.4v14.2l-1.7 4.8-1.7-4.8V7.6Z" fill="white"></path>
    </svg>`,
    "Back": `<svg width="8" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 27">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M.36 0c3.67.53 7.4.53 11.08 0v1.88L8.86 4.65a4.7 4.7 0 0 0-1.26 3.6H4.2a5.4 5.4 0 0 0-1.38-3.6A93.1 93.1 0 0 1 .36 1.88V0Z" fill="black"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.2 7.6h3.4v14.2l-1.7 4.8-1.7-4.8V7.6Z" fill="black"></path>
    </svg>`
    };
    const pinLocation = {
      "Easy": `<svg width="13" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27">
        <path d="M0 5.22 10.92 0v23.95h2.73v-2.3c2.44.46 4.09 1.31 4.09 2.3 0 1.47-3.66 2.66-8.19 2.66-4.52 0-8.19-1.2-8.19-2.66 0-1.32 2.96-2.41 6.83-2.62V9.29L0 5.22Z" fill="#C44242"></path>
    </svg>`,
      "Medium": `<svg width="13" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27">
        <path d="M0 5.22 10.92 0v23.95h2.73v-2.3c2.44.46 4.09 1.31 4.09 2.3 0 1.47-3.66 2.66-8.19 2.66-4.52 0-8.19-1.2-8.19-2.66 0-1.32 2.96-2.41 6.83-2.62V9.29L0 5.22Z" fill="white"></path>
    </svg>`,
      "Hard": `<svg width="13" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27">
        <path d="M0 5.22 10.92 0v23.95h2.73v-2.3c2.44.46 4.09 1.31 4.09 2.3 0 1.47-3.66 2.66-8.19 2.66-4.52 0-8.19-1.2-8.19-2.66 0-1.32 2.96-2.41 6.83-2.62V9.29L0 5.22Z" fill="black"></path>
    </svg>`
    };
    const windSpeed = {
      "Low":` <svg width="13" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 27">
        <path d="M0 5.22 10.92 0v23.95h2.73v-2.3c2.44.46 4.09 1.31 4.09 2.3 0 1.47-3.66 2.66-8.19 2.66-4.52 0-8.19-1.2-8.19-2.66 0-1.32 2.96-2.41 6.83-2.62V9.29L0 5.22Z" fill="#C44242"></path>
    </svg>`,
      "Moderate": `<svg width="18" height="10" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 38">
        <path fill-rule="evenodd" clip-rule="evenodd" d="m3.8 8.63-2.35-2.6a3.5 3.5 0 0 0 4.67 5.21h.01v-.01M3.8 8.63l2.35 2.6m-2.35-2.6-2.34-2.6.01-.01.02-.02a7.74 7.74 0 0 1 .74-.6 26.3 26.3 0 0 1 8.8-4.21c6.03-1.6 14.3-1.5 23.74 4.43 7.7 4.84 13.96 4.72 18.22 3.6a19.33 19.33 0 0 0 6.35-3.02 8.6 8.6 0 0 0 .34-.27l-.01.01h.01a3.5 3.5 0 0 1 4.67 5.2l-2.32-2.57 2.32 2.58h-.01l-.02.02a5.82 5.82 0 0 1-.21.18c-.13.11-.3.26-.53.43a26.33 26.33 0 0 1-8.8 4.21c-6.03 1.59-14.3 1.49-23.74-4.44-7.7-4.84-13.97-4.72-18.21-3.6a19.3 19.3 0 0 0-6.36 3.02 8.51 8.51 0 0 0-.34.27m53.54-5.3L62 8.55l-2.34-2.6ZM3.8 29.62l-2.35-2.6a3.5 3.5 0 0 0 4.67 5.21h.01v-.01m-2.34-2.6 2.35 2.6m-2.35-2.6-2.34-2.6.01-.01.02-.02a10.44 10.44 0 0 1 .74-.6 26.31 26.31 0 0 1 8.8-4.21c6.03-1.6 14.3-1.5 23.74 4.44 7.7 4.83 13.96 4.71 18.22 3.59a19.32 19.32 0 0 0 6.35-3.02l.3-.22.04-.05-.01.01h.01a3.5 3.5 0 0 1 4.67 5.2l-2.32-2.56 2.32 2.57-.01.01-.02.02a5.82 5.82 0 0 1-.21.18l-.53.42a26.33 26.33 0 0 1-8.8 4.21c-6.03 1.59-14.3 1.49-23.74-4.44-7.7-4.84-13.97-4.72-18.21-3.6a19.3 19.3 0 0 0-6.36 3.02 8.38 8.38 0 0 0-.34.27m53.54-5.3 2.34 2.6-2.34-2.6Z" fill="white"></path>
    </svg>`,
      "High": `<svg width="18" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 26">
        <path d="M1.6 13.32c3.35-3.03 7.42-3.03 12.2-.02 4.79 3.02 8.85 3.02 12.2-.01M1.6 4.5c3.35-3.04 7.42-3.04 12.2-.02 4.79 3.01 8.85 3 12.2-.02M1.6 22.15c3.35-3.03 7.42-3.04 12.2-.02 4.79 3.02 8.85 3.01 12.2-.02" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>`
    };
    const greenSpeed = {
      "Fast":`<svg width="35" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 26">
        <path d="M7 17c0-1.1.9-2 2-2h9a2 2 0 1 1 0 4H9a2 2 0 0 1-2-2Z" fill="#fff"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M35 26a13 13 0 1 0 0-26 13 13 0 0 0 0 26Zm2.9-8.6c-.3 0-.5 0-.8.2-1.1.6-1.6 2-1 3a2.2 2.2 0 0 0 3.7.6c-1 .1-1.8-.4-2.3-1.2-.4-1-.2-2 .4-2.6Zm-4-6.4c-.3 0-.5.2-.8.4-1 1-1.2 2.5-.3 3.6a2.4 2.4 0 0 0 4-.4c-.9.3-2 0-2.6-.8-.7-.8-.8-2-.3-2.8Zm-2.5 7.2c-.3 0-.5.2-.8.3-1 .7-1.3 2.2-.6 3.2a2.2 2.2 0 0 0 3.7 0c-.8.3-1.8 0-2.3-.9-.6-.8-.5-1.8 0-2.6Zm-4.8-9.6.6-.5c-.3.9 0 1.9.7 2.5.8.6 1.8.7 2.6.2l-.4.7c-.8 1-2.2 1.2-3.2.4-1-.8-1.1-2.3-.3-3.3Zm-.6 5.2-.7.5c-.8 1-.8 2.4.2 3.3a2.2 2.2 0 0 0 3.6-.9c-.8.4-1.8.3-2.6-.3-.7-.7-.9-1.7-.5-2.6Z" fill="#fff"></path>
        <path d="M0 24c0 1.1.9 2 2 2h23.5c-1.5-.5-2-1-3-2-.6-.6-1.5-2-1.5-2H2a2 2 0 0 0-2 2ZM14 10c0-1.1.9-2 2-2h2a2 2 0 1 1 0 4h-2a2 2 0 0 1-2-2ZM3 10c0-1.1.8-2 1.8-2h5.4c1 0 1.8.9 1.8 2s-.8 2-1.8 2H4.8c-1 0-1.8-.9-1.8-2Z" fill="#fff"></path>
    </svg>`,
      "Pro":`<svg width="35" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49 29">
        <path fill-rule="evenodd" clip-rule="evenodd" d="m7.9 2 .1.3L8 2Zm23.7-.8C26.8-1 22.8.2 17.1 2l-1 .4c-6.1 1.8-7.7.6-8 0 3.1 7 9.5 4.6 9.5 4.6S16 10 13 11C6.4 12.9 0 9.2 0 9.2s.7 5.1 4.4 8.3c3.8 3.2 10.8 2 10.8 2s-2 .6-4.6 2c-3.1 1.6-4.9 5.4-4.9 5.4S9.6 24 14.3 25c3 .5 4 1 5.7 1.6l3.7 1.4c3.3 1 8.3.9 8.3.9s-1.8-.2-2.9-.6a8.7 8.7 0 0 1-3.5-2c-1.2-1-2.4-2.8-3.7-4-2.5-2-5-1.4-6.5-.6 2.3-2.8 4.6-4.6 6.2-5.5-6.4 3.2-11.7 0-13.6-2.2.8.8 4.8 2 9.8-3L19 10c4.1-4.1 8-8.4 12.5-8.7Z" fill="#fff"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M36 28a13 13 0 1 0 0-26 13 13 0 0 0 0 26Zm2.9-8.6c-.3 0-.5 0-.8.2-1.1.6-1.6 2-1 3a2.2 2.2 0 0 0 3.7.6c-1 .1-1.8-.4-2.3-1.2-.4-1-.2-2 .4-2.6Zm-4-6.4c-.3 0-.5.2-.8.4-1 1-1.2 2.5-.3 3.6a2.4 2.4 0 0 0 4-.4c-.9.3-2 0-2.6-.8-.7-.8-.8-2-.3-2.8Zm-2.5 7.2c-.3 0-.5.2-.8.3-1 .7-1.3 2.2-.6 3.2a2.2 2.2 0 0 0 3.7 0c-.8.3-1.8 0-2.3-.9-.6-.8-.5-1.8 0-2.6Zm-4.8-9.6.6-.5c-.3.9 0 1.9.7 2.5.8.6 1.8.7 2.6.2l-.4.7c-.8 1-2.2 1.2-3.2.4-1-.8-1.1-2.3-.3-3.3Zm-.6 5.2-.7.5c-.8 1-.8 2.4.2 3.3a2.2 2.2 0 0 0 3.6-.9c-.8.4-1.8.3-2.6-.3-.7-.7-.9-1.7-.5-2.6Z" fill="#fff"></path>
    </svg>`
    };

  data.forEach((r,i) => { 
    if (titles.includes(r[0])) {
      console.log(`r=${r} r[1]=${r[1]}`);
      let loc = "";
      let ary = [];
      switch(r[0]) {
        case "Tees":
          ary = teeLocation;
          break;
        case "Pins":
          ary = pinLocation;
          break;
        case "Wind":
          ary = windSpeed;
          break;
        case "Green Speed":
          ary = greenSpeed;
          break;
        default:
          ary = teeLocation;
          break;
      }

      r.forEach((c,j) => {
        if (j>0) {
          loc = r[j];
          console.log(`loc=${loc} ary[loc]= ${ary[loc]}`);
        }
      });

/*
      r.forEach((c,j) => {
        if (j>0) {
          loc = r[j];
          console.log(`loc=${loc} teeLocation[loc]= ${teeLocation[loc]}`);
        }
      });
      */
    }
  });

}


/**
 * test getting player data from Players class
 */
function test_playerByName() {
  let player = players.getPlayerData("Chuck Grieshaber")[0];
  console.log(`Player: ${player.name} username: ${player.userName} json: ${JSON.stringify(player)}`);
}

/**
 * test new Player class
 */
function test_playerClass() {
  let ps = new Players();
  const plrs = ps.getPlayers();
  let plrData = [];
  plrData.push("Chuck Grieshaber");
  plrData.push("chuckgrieshaber");
  plrData.push(-1);
  let p = new Player(plrData);
  console.log(`${p.toString()}`);
  plrData = [];
  plrData.push("Jason Lipman");
  plrData.push("jlip32");
  plrData.push(-1);
  p = new Player(plrData);
  console.log(`${p.toString()}`);
  plrData = [];
  plrData.push("Chris Wilder");
  plrData.push("Movermafia");
  plrData.push(13.3);
  p = new Player(plrData);
  console.log(`${p.toString()}`);
}


/**
 * Test creating data for reports
 */
function test_reports() {
  let t = new Tournaments();
  let coursesPlayed = new Map();
  let ta = t.getTournaments();
  let rounds = [];
  let rData = {};
  let tmpData = {};
  console.log(`Course.  Times Played.  last Played`);
  ta.forEach(t => {
    rounds = t.rounds;
    rounds.forEach(r => {
      if (coursesPlayed.has(r.course)) {
        tmpData = coursesPlayed.get(r.course);
        tmpData.count = tmpData.count+1;
        tmpData.date = Math.max(tmpData.date, r.date);
        //console.log(`r.course= ${r.course} r.date= ${r.date}`);
        //tmpData.date = Math.max(tmpData.date.getTime(), r.date.getTime());
        coursesPlayed.set(r.course, tmpData);
      } else {
        coursesPlayed.set(r.course, {"count":1, "date":r.date});
      }
    });
  }); 

  for (const [key, value] of coursesPlayed) {
    console.log(`${key}  \t${value.count} \t${new Date(value.date).toLocaleDateString()}`);
  } 
}

/**
 * Tournament by number
 */
function test_tournyByNumber() {
  tournamentByNumber(23.13);
}

/**
 * Test pointsleaderboard 
 */
function test_pointsBoard() {
  let plb = new PointsLeaderboard();
  plb.build();
}

/**
 * Test new Settings class
 */
function test_settingsClass() {
  let settings = new Settings();
  //settings.getSetting
  console.log(`getSetting() ${JSON.stringify(settings.getSetting('MATCHPLAYWINNERS').value)}`);
  console.log(`getSetting() ${JSON.stringify(settings.getSetting('PLAYERS').value)}`);
  console.log(`getSetting() ${JSON.stringify(settings.getSetting('ROUNDDATES').value)}`);
  console.log(`getSetting() ${JSON.stringify(settings.getSetting('TOURNAMENTNUMBERS').value)}`);
}

/**
 * 
 */
function test_lessThan4() {
  let ts = new Tournaments();
  let t = ts.getTournamentById(23.13);
  console.log(`Number of tournaments ${ts.toString()}`);
}

/**
 * Test getNumberOfEvents() method in PointsLeaderBoard class
 */
function test_getNumberOfEvents() {
  const pb = new PointsLeaderboard();
  console.log(`Number of events = ${pb.getNumberOfEvents()}`);
}

/**
 * Test getting all the players rounds
 */
function test_getPlayerRounds() {
  const pr = new PlayerRounds();
  let plyers = new Map();
  let pArray = [];

  // Loop for all of the rounds
  for (const r of pr) {
    if (plyers.has(r.getName())) {
      pArray = plyers.get(r.getName());
      pArray.push(r);
    } else {
      pArray.push(r);
    }
    plyers.set(r.getName(), pArray);
    pArray = [];
  }

  plyers.forEach( (k,v) => { 
    console.log(`>> ${v}`);
    k.sort((a,b) => a.getTimeStamp() - b.getTimeStamp());
    k.forEach(r => console.log(` ${new Date(r.getTimeStamp()).toLocaleDateString()} \t${tournaments.getTournamentNameById(r.getNumber())}  \t${r.getScore()}`));
  });

}

/**
 * Test getting the player lisrt from the PlayerRounds class
 */
function test_getPlayerListFromPRS() {
  const prs = new PlayerRounds();
  console.log(`${JSON.stringify(prs.getPlayers())}`);
}

/**
 * Test getting all the players with at least one round
 */
function test_getPlayersWithARound() {
  const pr = new PlayerRounds();
  let plyers = new Set();
  let pArray = [];

  // Loop for all of the rounds
  for (r of pr) {
    plyers.add(r.getName());
  }

  plyers.forEach( v => pArray.push(v));
  pArray.sort();

  console.log(`${pArray.length}`);
  console.log(`${JSON.stringify(pArray)}`);
}

/**
 * 
 */
function test_multiArray() {
  let currTourny = tournaments.getTournamentById(23.04);
  let [date1, date2, date3, date4] = currTourny.tournamentDates;
  console.log(date1);
  console.log(date2);
  console.log(date3);
  console.log(date4);
  let oneDay = (24 * 60 * 60 * 1000);
  let startDate = new Date(date1).toLocaleDateString();
  let endDate = new Date(new Date(date4).getTime()+(7*oneDay)).toLocaleDateString();
  let dateString = `${startDate} - ${endDate}`;
  console.log(dateString);

  let courseData = tournaments.getCourseArray(23.10);
  let newCourseData = courseData.splice(2,1);
  console.log(`${JSON.stringify(newCourseData)}`);
  console.log(`${JSON.stringify(courseData)}`);
}

/**
 * Test getLeaderboardData in Tournament class
 */
function test_getLeaderboardData() {
  let res = tournaments.getTournamentById(23.10);
  let data = res.leaderboardData;
  data.forEach(r => console.log(`${r}`));
}

/**
 * Lets create a new way to sort out the leaderboard data in Tournament class, currently we use the player list and only
 * allow a score if their name is in the player list... this is not right.
 */
function test_leaderboardRewrite() {
  let currentTourny = tournaments.getTournamentById(23.09);
  let rounds = [];
  let playerMap = new Map();  // key=name, value=[r1,r2,r3,r4]
  let leaderboard = [];
  const pr = new PlayerRounds();

  // Get the records for each of the tournament rounds and the course data for the footer
  currentTourny.rounds.forEach((r) => {
    rounds = [...rounds, ...pr.getRoundsByNumber(r.number)];
  });

  // Loop for all of the rounds logged for this tournament
  let tmpPlr = [];
  rounds.forEach(r => {
    if (playerMap.has(r.getName())) {
      tmpPlr = playerMap.get(r.getName());
    } else {
      tmpPlr = [999,999,999,999];
    }
    tmpPlr[r.getRound()-1] = r.getScore();
    playerMap.set(r.getName(), tmpPlr);
  });

  // Convert from a map to array for leaderboard
  let playerData = [];
  let newName ="";
  for (const [name, scores] of playerMap) {
    playerData = players.getPlayerData(name)[0];
    console.log(`playerData: ${playerData.userName}`);
    playerData.userName == "" ?  newName=name : newName = `${name} (${playerData.userName})`;
    leaderboard.push([newName, ...scores]);
  }

  leaderboard.forEach(r => console.log(`${r}`));
}


/**
 * Get the value for the admin sheet
 */
function test_getValue() {
  let result;
  const nameFields = ["E4", "E5", "E6", "D4", "D5", "D6", "F4", "F5", "F6"];
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let newPlayer;
  let sheet = ss.getSheetByName('Admin');
  nameFields.forEach(r => {
    console.log(`${r}: "${sheet.getRange(r).getValue()}"`);
  });
}

/**
 * Test add player in Players
 */
function test_addPlayer() {
  let plyrs = new Players();
  console.log(`Add new player "Landon Davis" rc=${plyrs.add("Landon Davis")}`);
  //console.log(`Add existing player "Chuck Grieshaber" rc=${plyrs.add("Chuck Grieshaber")}`);
}

/**
 * 
 */
function test_pointsTournySetting() {
  let pb = new PointsLeaderboard()
  let ret = pb._getSettings();
  console.log(`${ret}`);
}

/**
 * 
 */
function test_pointsSliceDice() {
  let ptsAry = new PointsLeaderboard().getData()
  //let ptsAry = pb.getData();
  ptsAry.forEach(p => console.log(`${p}`));
}

/**
 * Test hide/show method
 */
function test_hideShow() {
  let name = 'leaderboard';
  let screens = ["loading", "leaderboard", "pointsboard"];
  let ids = ["loading", "tableDiv", "pointsDiv"];
  ids.forEach(e => {
    //document.getElementById(e).style.display = "none";
    console.log(`hiding ${e}`);
  });
  //document.getElementById(ids[screens.indexOf(name)]);
  console.log(`showing ${ids[screens.indexOf(name)]}`);
}

/**
 * Test completed tournaments
 */
function test_completedTournaments() {
  let ct = tournaments.getCompletedTournaments();
  ct.forEach(t => console.log(`${t.number} ${t.name}`));
}

/**
 * Slicer function from Pointsleaderboard to call the pointsCalculations
 */
function test_pointsSlicer() {
  const playerRounds = new PlayerRounds();
  let numRounds = 0;
  let totalByPlayer = [];
  let total = 0;
  let fedex = new Map();
  let tournamentNumbers = [23.02,23.03,23.04,23.05,23.06,23.07];

  // Loop for all of the tournaments eligble for leaderboard
  tournamentNumbers.forEach( (t,i) => {
    let tournyRes = playerRounds.filter(PlayerRound.NUMBER, t);
    let plyrResults;
    // Loop for all players (players is a global Players object)
    for (let p of players) {
      // Grab all records from tournament for this player
      plyrResults = tournyRes.filter(PlayerRound.PLAYER, p);
      // We only count if there are 4 rounds played
      if (plyrResults.getNumRounds() == 4) { 
        for (let r of plyrResults) {
          total+= r.getScore();
        }
        numRounds = numRounds + plyrResults.getNumRounds();
        totalByPlayer.push({"name": p, "score": total});
      }    
      total = 0;
    }
    totalByPlayer.sort((a, b) => parseInt(a.score) - parseInt(b.score));
    fedex.set(t, totalByPlayer);
    totalByPlayer = [];
  });

  test_pointsCalculations(fedex);
}

/**
 * Work on the points leaerboard calculating correct values
 */
function test_pointsCalculations(tournyData) {
  let points = [8, 6, 4, 1];
    let pp;
    let tmpPP;
    let seen = {}; 
    let scoreIdx = 0;
    let _tableData = [];
    
    // Look at each tournament and calculate points
    tournyData.forEach( (v,k,m) => {
      console.log(`## New Tourny ${k} ##`);
      // Loop for all the tournament data that is already sorted
      v.forEach( (t,i) => {
        // See if we have this player yet
        tmpPP = _tableData.findIndex(p => p._name == t.name);
        if (tmpPP != -1) {
          pp = _tableData[tmpPP];
        } else {
          pp = new PlayerPoints(t);
        }

        // Increment events and determine if top three
        pp.events = pp.events+1;
        if (i < 3) {
          pp.topfive = pp.topfive+1;  
        } 

        // Find any dups and rescore
        if (i!=0) {
          if (t.score in seen) {
            seen[t.score]++;
            scoreIdx--;
            console.log(`1 dup ${t.name} ${t.score} idx:${scoreIdx} point:${points[Math.min(scoreIdx,3)]} seen:${seen[t.score]}`);
            pp.points = pp.points + points[Math.min(scoreIdx,3)];
            if (scoreIdx==0) {
              console.log(`1 win ${t.name}`);
              pp.wins = pp.wins+1;
            } 
            //pp.topfive = pp.topfive+1; 
            scoreIdx++;
          }
          else { 
            seen[t.score] = 1;
            console.log(`2 no dup ${t.name} ${t.score} idx:${scoreIdx} points:${points[Math.min(scoreIdx,3)]} seen:${seen[t.score]}`);
            pp.points = pp.points + points[Math.min(scoreIdx,3)];
            //scoreIdx < 3 ? pp.topfive = pp.topfive+1 :  
            scoreIdx++;
          }
        } else {
          seen[t.score] = 1;
          pp.wins = pp.wins+1;
          console.log(`Winner 10 ${t.name} ${t.score} idx:${scoreIdx} points:${points[Math.min(scoreIdx,3)]} seen:${seen[t.score]}`);
          pp.points = pp.points + points[0];
          //pp.topfive = pp.topfive+1;
          scoreIdx++;
        }

        if (tmpPP > -1) {
          _tableData.splice(tmpPP,1,pp);
        } else {
          _tableData.push(pp);
        }
      });
      scoreIdx = 0;
      seen = {};
    });
    _tableData.sort((a,b) => b.points - a.points);
    let tableData = _tableData;
    return _tableData;
}

/**
 * Get the tounament names and number for web page
 */
function test_tournyNameValue() {
  let res = tournaments.getTournaments();
  res.forEach(t => console.log(`${t.number} ${t.name}`))
}

/**
 * Test getting the last timestamp of a round in a tournament
 */
function test_getTimestamp() {
  let tourny = tournaments.getTournamentById(23.07);
  let lastDate = tourny.latestRoundDate;
  console.log(`Latest date for tournament ${23.07} is ${new Date(lastDate).toLocaleString('en-US')}`);
}

/**
 * Test spliting score to par
 */
function test_splitToPar() {
  let c = "(-17)";
  let parts = c.slice(1,c.length-1);
  console.log(`parts ${JSON.stringify(parts)}`);
}

/**
 * Test array of numbers
 */
function test_arrayNumber() {
  [...Array(10).keys()].forEach(n => console.log(`Number ${n}`));
}

/**
 * Test converting the dates in course data to strings
 */
function test_convertDates() {
  let tnums = tournaments.getNumbers();
  let ct = tournaments.getTournamentById(tnums[tnums.length-1]);
  let data = ct.leaderboardData;

  let diffToPar = 0;
  let totalScore = 0;
  let courseData = tournaments.getCourseArray(tnums[tnums.length-1]);

  console.log(`Date field: ${courseData[2]}`);
  // Turn date obj to date string
  let courseDates = courseData[2].map(d => {
    if (d != 'Date') {
      return new Date(d).toLocaleDateString();
    } else {
      return "Date";
    }
  });
  //console.log(`courseDates: ${courseDates}`);
  courseData[2] = courseDates;
  console.log(`${courseData[2]}`);

}

/**
 * Test building the leaderboard data in the Tournament class
 */
function test_createLeaderboardData() {
  let tnums = tournaments.getNumbers();
  let ct = tournaments.getTournamentById(tnums[tnums.length-1]);
  let data = ct.leaderboardData;

  let diffToPar = 0;
  let totalScore = 0;
  let footerData = tournaments.getCourseArray(tnums[tnums.length-1]);
  data.forEach((r,i) => {
    r.forEach((s,j) => {
      if (j>0 && j<5) {
        totalScore += s;
        if (parseInt(s) != 999) {
          diffToPar = diffToPar + (parseInt(s) - footerData[1][j]);
        }
      }
    });
    data[i].push(totalScore);
    data[i].push(diffToPar);
    diffToPar = 0;
    totalScore = 0;
  });
  //console.log(`${JSON.stringify(data)}`);
  let sdata = data.sort((a,b) => a[5]-b[5]);
  //data.forEach(r => console.log(r));

  // Normalize the data after the sort
  data.forEach((r,i) =>{
    r.forEach((c,j) => {
      if (c==999) {
        data[i][j] = 0;
        data[i][5] -= 999;
      }
    });
  });

  console.log(`data length [${data.length}]`);
  let msg = '';
  let plyMsg = 'Players';
  let courMsg = 'Courses';
  let limit = data.length;
  [...data,...footerData].forEach( (r,i) => {
    i < limit ? msg = plyMsg : msg = courMsg;
    console.log(`Record number [${i}] [${msg}] value [${r}]`);
  });
  //console.log(`${JSON.stringify(data)}`);;
}

/**
 * Test new createScoreToPar method
 */
function test_createScoreToPar() {
  let num = 23.05
  let tourny = tournaments.getTournamentById(num);
  let courseData = tournaments.getCourseArray(num);
  let lb = new Leaderboard(buildLeaderBoard(tourny));
  let res = lb._createScoreToPar(courseData);
  console.log(`createSocreToPar: ${JSON.stringify(res)}`);
}

/**
 * Test incremental backup
 */
function test_incrementalBackup() {
  let record = JSON.parse('["1/1/2021 22:49:36","1/1/2021","22.01","1","Bob Dylan","77"]');
  let bk = new Backup();
  bk.open();
  bk.add(record);
  //if (bk.findFile(bk.fileName)) {
  //  bk.add(record);
  //}
}

/**
 * Create file in folder test
 */
function test_createSpreadsheet() {
  /*
  // Works but has a depricated method addFile(), the Drive API works, so we go with that!
  var destination = DriveApp.getFolderById('1PUUa99wncEhzpMHdnGvpWDgXsLTB7Ran');
  var newFile = SpreadsheetApp.create('Golf+ tournaments - BACKUP').getId();
  destination.addFile(DriveApp.getFileById(newFile));
  */
  let backup = new Backup();
  backup.createFile(`Golf tournaments - backup`);
}

/**
 * Backup class test
 */
function test_backupClass() {
  //let bk = new Backup();
  //bk._findFile("Golf tournaments - dev");

  let backup = new Backup();
  let backupSS = backup.findFile(backup.fileName);
  let formRespSheet = SpreadsheetApp.getActive().getSheetByName("Form Responses");
  if (!backupSS) {
    backupSS = backup.createFile(backup.fileName);
    backup.fullBackup(formRespSheet);
  }
}

/**
 * Test Trigger class
 */
function test_triggerClass() {
  // Lets create an installable trigger to see if we can find it
  const ss = SpreadsheetApp.getActive();
  //let triggerID = ScriptApp.newTrigger("postFormSubmit")
  //                  .forSpreadsheet(ss)
  //                  .onChange()
  //                  .create();

  let trig = new Triggers(ss);
  let found = trig.find("14752940");
  console.log(`Trigger found? ${found != null} `);
  //trig._saveTriggerID("3756437776730826077");
  console.log(` ${parseInt(trig._getTriggerID())}`);
  if (triggers.find(triggers._getTriggerID())) {
    console.log(`Found it: ${trig._getTriggerID()}`);
  }
}

/**
 * Used as a destination of the trigger
 */
function triggerCatcher(e) {
  // Print the results
  console.log(`${JSON.stringify(e)}`);
} 

/**
 * Test new method to get tounament name
 */
function test_getTournyName() {
  let tourny = tournaments.getTournamentById(23.03);
  console.log(`Name=${tourny.name}`);
  console.log(`"${tournaments.getTournamentNameById(23.03)}"`);
}

/**
 * Test 'instanceof' keyword on my classes
 */
function test_instanceOf() {
  let lb = new Leaderboard();
  console.log(`is lb an instanceof LeaderBoard class? ${lb instanceof Tournament}`);
  let currentTourny = tournaments.getTournamentById(Number(23.11));
  if (currentTourny instanceof Tournament) {
    console.log(`currentTourny is an instance of Tournament`);
  } else {
    console.log(`NOT an instance of `);
  }
}

/**
 * Test the new utility createValueArray() function
 */
function test_createValueArray() {
  let out = createValueArray(3,2, "test");
  console.log(out);
}

/**
 * Test PlayerPoints class
 */
function test_playerPoints() {
  //let data = new Map();
  let tourn = 23.10;
  const ps = [
    {"name":"Rory McAroy", "score":268},
    {"name":"Tiger Woods", "score":278},
    {"name":"Jordan Speith", "score":276},
    {"name":"Chuck Grieshaber", "score":308},
    {"name":"Kari Grieshaber", "score":318},
    {"name":"Bob Dyland", "score":338},
  ];
  //data.set(tourn, data);

  let pp = new PlayerPoints(ps[0], tourn);
  console.log(`PlayerPoints.name ${pp.name}`);
  console.log(`toArray: ${pp.toArray()}`)
}


/**
 * Test assuring I can get all player records
 */
function test_getAllPlayerRecs() {
  const prs = new PlayerRounds();

  // Get all of the records for one tournament
  //let tournyRes = prs.filter(PlayerRound.NUMBER, number);
  //let minRes;
  let minRes = prs.filter(PlayerRound.PLAYER, "George Boyd");
  for (let r of minRes) {
    console.log(`"${r.getName()}" ${r.getNumber()} ${new Date(r.getDate()).toLocaleDateString()} ${r.getScore()}`);
  }
}

/**
 * Test filtering down records for determining fedex points
 */
function test_filterRecords() {
  const prs = new PlayerRounds();
  let number = 23.01;
  let total = 0;
  let numRounds = 0;
  //let cnt = 0;
  let totalByPlayer = [];
  let fedex = new Map();

  console.log(`${tournaments.getNumbers()}`);
  // Loop for all tournament numbers
  tournaments.getNumbers().forEach( t => {
    console.log(`Tournament ${t}`);
    // Get all of the records for one tournament
    let tournyRes = prs.filter(PlayerRound.NUMBER, t);
    let minRes;

    // Loop for all players
    for (let p of players) {
      // Grab all records from tournament for this player
      minRes = tournyRes.filter(PlayerRound.PLAYER, p);
    
      // We only count if there are 4 rounds played
      if (minRes.getNumRounds() == 4) { 
        for (let r of minRes) {
          total+= r.getScore();
          //cnt++;
        }
        numRounds = numRounds + minRes.getNumRounds();
        totalByPlayer.push({"name": p, "score": total});
        console.log(`Player "${p}"" has ${minRes.getNumRounds()} rounds in this tournament`);
      }    
      total = 0;
      //cnt = 0;
    }
  
    console.log(`Total rounds found = ${numRounds}`);
    //console.log(`${JSON.stringify(totalByPlayer)}`);
    totalByPlayer.sort((a, b) => parseInt(a.score) - parseInt(b.score));
    console.log(`${JSON.stringify(totalByPlayer)}`);
    fedex.set(t, totalByPlayer);
  });

  console.log(`${fedex.keys()}`);
}

/**
 * Test the iterator in PlayerRounds
 */
function test_iteratorPR() {
  const prs = new PlayerRounds();
  for (let pr of prs) {
    console.log(pr.getName());
  }
}

/**
 * Test the filter function of the PlayerRounds class 
 */
function test_playerRounds() {
  const prs = new PlayerRounds();
  console.log(`getNumRounds() ${prs.getNumRounds()}`);
  //console.log(`getField(NAME) ${prs[0].getField(4)}`);
  let fpr = [];
  fpr = prs.filter(PlayerRound.PLAYER, "Chuck Grieshaber");
  console.log(`Number of rounds = ${fpr.getNumRounds()}`);
  for (let r of fpr) {
    console.log(`${r.getName()} ${r.getScore()} ${r.getRound()}`);
  }
}

/**
 * Get player rounds by number
 */
function test_getRoundsById() {
  let rounds = [];
  let leaderboard = [];
  let found = false;
  let playerName;
  let playerScores = new Array(4);
  const pr = new PlayerRounds();
  const players = new Players();  
  rounds = [...pr.getRoundsByNumber(23.01)];
  rounds.forEach(r => console.log(`${r.getName()} ${r.getRound()} ${r.getScore()}`));
  // Get the records for each of the tournament rounds and the course data for the footer
  //currTourny.rounds.forEach((r) => {
    //rounds = [...rounds, ...pr.getRoundsByDate(r.date)];
    //rounds = [...rounds, ...pr.getRoundsByNumber(23.02)];
  //});
}

/**
 * get col widths
 */
function test_getColWidth() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Leaderboard 23.01");
  console.log(`7=${sheet.getColumnWidth(7)} 8=${sheet.getColumnWidth(8)}`);
}
/**
 * Column number to letter test
 */
function test_col2Letter(){
  console.log(`col=2, letter=${columnToLetter(2)}`);
  console.log(`col=5, letter=${columnToLetter(5)}`);
  console.log(`col=55, letter=${columnToLetter(55)}`);
}

/**
 * Test getting all tournament numbers
 */
function test_getTournyNums() {
  console.log(`${tournaments.getNumbers()}`);
}

/**
 * Test exporting the leaderboard sheet
 */
function test_exportToHTML() {
  let url ="https://docs.google.com/spreadsheets/d/1nriQ4L8Qm3bFqJxTD9kCb9I37AsTBmez_Wum9MBJE-E/export#gid=79002314&format=zip&gridlines=false"
  exportSpreadsheet();

}

/**
 * Test getting tournament numbers 
 */
function test_getTournyNumbers() {
  let tournys = getTournamentNumbers();
  tournys.forEach((t,i) => console.log(`T#${i} ${t}`));
  let tmp = [...tournys];
  console.log(`replaceChildren(): "${tmp}"`);
}

/**
 * Text select tournament by number
 */
function test_tournamentById() {
  const number = "23.02";
  let currentTourny = tournaments.getTournamentById(Number(number));
  console.log(`${typeof currentTourny}`);
  if (typeof currentTourny === "object") {
    console.log(` ${currentTourny.number} ${number}`);
  } else {
    console.log(`Could not find the tournament`);
  }
}

/**
 * Test font aray
 */
function test_fontArray(){
  let lb = new Leaderboard();
  console.log(`${JSON.stringify(lb._createFontArray(12, 7))}`);
  //console.log(`${JSON.stringify(lb._createFontArray2(12, 7))}`);
  let rows = 12;
  let cols = 7;
  let fontAry = [];
  let rowAry = [];
  [...Array(rows)].forEach(r => {
    [...Array(cols)].forEach( c => {
      rowAry.push("Comfortaa");
    });
    fontAry.push(rowAry); 
    rowAry = new Array();
  });
  console.log(JSON.stringify(fontAry));
}

/**
 * 
 */
function text_arraylen() {
  let horizAlignCourses = [["right"],["right"],["right"],["right"],["right"],["right"],["right"],["right"]];
  console.log(`${horizAlignCourses.length} ${horizAlignCourses[0].length}`);
}
/**
 * Check out sumScoreToPar()
 */
function test_sumScoreToPar() {
  let lb = new Leaderboard();
  console.log(`${lb._createScoreToParFormulas(1,13)}`);
}

/**
 * Get the rounds by tournament number
 */
function test_getRoundsByNumber() {
  let tournamentByNumber = tournaments.getTournamentById(22.13);
  let tournamentDates = tournamentByNumber.tournamentDates;
  pr = new PlayerRounds();
  let rounds = pr.getRoundsByNumber(22.13);
  console.log(`${rounds}`);
}
/**
 * Test getting the formula
 */
function test_getFormulas() {
  let lb = new Leaderboard();
  let formulas = lb._createSumFormulas(4);
  console.log(`${JSON.stringify(formulas)}`);
  formulas = lb._createParFormulas(4);
  console.log(`${formulas}`);
  formulas = lb._createTotalScoreFormat(4);
  console.log(formulas);
  let trophys = ["🥇","🥈", "🥉"];
}

/**
 * Test setting sheet formatting options 
 */
function test_sheetFormatting() {
  let headerValues = [["Name", "Round 1", "Round 2", "Round 3", "Round 4", "Total", " ", "+/-"]];
  let footerValues = [
    ["Course", "Kiawah", "Pebble Beach", "Wolf Creek", "Castle Links"],
    [ "Par", 72, 72, 71, 72]
  ];
  let data = [
    ["Jim Morrison","72","73","74","75"],
    ["Bob Dylan","64","73","84","75"],
    ["Tom Petty","77","78","69","101"]
  ];
  let horizAlign = [["left", "right", "right", "right", "right", "right","center"]];
  let lb = new Leaderboard();
  let formulas; //= [["=SUM(A2:E2)"],["=SUM(A3:E3)"],["=SUM(A4:E4)"],["=SUM(A5:E5)" ]];

  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Test formatting");
  // lb._clearSheet();
  if (sheet.getLastRow()>0) {
    sheet
       .getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn())
//        .getRange(1, 1, 50, 10)
       .clear();
  }

  console.log(`${sheet.getLastRow()} ${sheet.getLastColumn()}`);

  sheet.insertRows(2, data.length+1);     
  sheet.getRange(2,1,data.length,5)
      .setValues(data);
  sheet.getRange(sheet.getLastRow()+1, 1, 2, 5)
      .setValues(footerValues);

  sheet.getRange(1, 1, 1, 8)
          .setBackground("yellow")
          .setBorder(false, false, true, false, false, false)
          .setValues(headerValues);

  sheet.getRange(sheet.getLastRow()-1, 1, 1, 8)
       .setBorder(true, false, false, false, false, false)
       .setBackground("white"); 

  sheet.getRange(2, 6, 4, 1).setFormulas(lb._createSumFormulas(data.length+1));
  sheet.getRange(2, 8, 4, 1).setNumberFormats(lb._createTotalScoreFormat(data.length+1));
  sheet.getRange(1, 1, 1, 7).setHorizontalAlignments(horizAlign);
  sheet.autoResizeColumns(1,9);

}

/**
 * Getting the current tournament
 */
function test_getCurrentTournament() {
  const tournaments = new Tournaments();
  let currTourny = tournaments.getCurrentTournament();
  console.log(`Get Current Tourny ${currTourny.number}`)
}

/**
 * Get the tounaments 
 */
function test_getTournaments() {
  let tournies = tournaments.getTournaments();
  let rounds;
  tournies.forEach(t => {
    console.log(`${t.number}`)
    rounds = t.rounds;
    rounds.forEach(r => {
      console.log(`. ${r.date}`);
    });
  });  
}

/**
 * Get tournament by ID (e.g. 23.1)
 */
function test_getTournamentById() {
  let tourny = new Map();
  tourny = tournaments.getTournamentById(22.13);
  let rounds = tourny.getRounds();
  rounds.forEach((r) => console.log(`${r.course} ${r.date}`));
  //console.log(tourny.getRounds());
}

/**
 * Test gettinbg rounds by name
 */
function test_getRoundsByName() {
  let pr = new PlayerRounds()
  let rounds = pr.getRoundsByName("Chuck Grieshaber");
  console.log(`${rounds}`);
}

/**
 * Test getting player records by date
 */
function test_getScoresByDate(){
  let ps = new PlayerRounds();
  let pr = new Array();
  pr = [...ps.getRoundsByDate("12/5/2022")];
  pr = [...pr, ...ps.getRoundsByDate("12/12/2022")];
  pr = [...pr, ...ps.getRoundsByDate("12/19/2022")];
  pr = [...pr, ...ps.getRoundsByDate("12/26/2022")];

  pr.forEach( p => console.log(`${p.getName()} ${p.getScore()} ${p.getRound()}`))
}

function test_getPlayers() {
  let players = new Players();
  let list = players.getPlayers();
  console.log(`Number of players = ${list.length}`);
  list.forEach((p,i) =>{
      console.log(`${i}  ${p}`);
  });
}

function test_GetFormUrl() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheets = ss.getSheets();
  let sheetName = "";
  sheets.forEach((s) => {
    sheetName = s.getSheetName();
    console.log(`Checking sheet "${sheetName}"`);
    if (sheetName.startsWith('Form Responses')) {
      console.log(s.getFormUrl());
    }
  });
  /*
  var formUrl = SpreadsheetApp.getActive().getActiveSheet().getFormUrl();
  if (formUrl) {
    console.log(formUrl);
  } else {
    console.log('No form is linked');
  }
  */
}

function test_UpdateForm() {
  let players = new Players();
  let mform = new Form(['Chuckster']);
  mform.update(players.getPlayers());
}

function test_getDateOfWeek() {
  console.log(`Week 5 : ${getDateOfWeek(1,2023)}`);
  console.log(`Week 5 : ${getDateOfWeek(5,2023)}`);
  console.log(`Week 52 : ${getDateOfWeek(52,2023)}`);
  console.log(`Week 52 : ${getDateOfWeek(52,2022)}`);
}

function getDateOfWeek(w, y) {
    var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week
    return new Date(y, 0, d);
}

function test_getCourses() {
  console.log(`${Courses.getCourses()}`);
  let ta = [];
  ta.push(Courses.getPar("Alpine"));
  console.log(`${Courses.getPar("Kiawah")} ${ta}`);
}

/**
 * Test Tournament class
 */
function test_tournamentsClass() {
  let t = new Tournaments();
  t.toString();
  
}

/**
 * Text getting par for a course
 */
function test_getPar() {
  console.log(`${Courses.getPar(Courses.CLIFFS)}`);
  console.log(`${Courses.getPar(Courses.PINEHURST)}`);
}