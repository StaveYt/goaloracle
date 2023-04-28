const today = new Date();
const tdd = String(today.getDate()).padStart(2, "0");
const tdm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
const tdy = today.getFullYear();
const urlParams = new URLSearchParams(window.location.search);
const data = urlParams.get("data");
console.log(data); // prints "hello"

const liveGamesContainer = document.getElementById("liveGames");
const finishedGamesContainer = document.getElementById("finishedGames");
const schedualedGamesContainer = document.getElementById("schedualedGames");

let matchupList = [];

function OnLoad() {
  if (data == null) {
    GetMatchups(tdy, tdm, tdd, 1, "all");
  } else {
    GetMatchups(tdy, tdm, tdd, 1, data);
    document.getElementById("leagueSelect").value = `${data}`;
  }
}

function GetMatchups(year, month, day, page, league) {
  fetch(
    `https://api.sportmonks.com/v3/football/fixtures/date/${year}-${month}-${day}?api_token=${sportMonksToken}&page=${page}&per_page=50&include=scores;league;venue;statistics.type;participants;`
  )
    .then((response) => response.json())
    .then((data) => {
      matchupList.push(...data.data);
      ParseMatchups(data.data, league);
      if (data.pagination.has_more) {
        GetMatchups(year, month, day, page + 1);
      } else {
        sessionStorage.setItem("SHOWNMATCHUPS", JSON.stringify(matchupList));
      }
    });
}

function ParseMatchups(fixtures, league) {
  fixtures.forEach((fixture) => {
    if (fixture.league_id == league || league == "all") {
      let liveGame =
        fixture.scores.length != 0 && fixture.result_info === null
          ? true
          : false;
      let finished = fixture.result_info !== null ? true : false;
      let fixtureData = encodeURIComponent(JSON.stringify(fixture));
      let currentFixture = document.createElement("tr");
      let matchup = document.createElement("td");
      let teams = fixture.name.split(" vs ");
      teams.forEach((team) => {
        let teamspan = document.createElement("p");
        teamspan.innerText = team;
        matchup.appendChild(teamspan);
      });

      let scores = document.createElement("td");
      if (liveGame || finished) {
      }

      let button = document.createElement("td");
      let buttonlink = document.createElement("a");
      buttonlink.setAttribute(
        "class",
        "bg-[#1bb198] border-t-0 border-y-4 border-green-800 hover:bg-green-700 text-white font-bold my-3 p-2 text-center w-full rounded shadow-slate-900  shadow-md hover:shadow-green-500/50"
      );

      button.appendChild(buttonlink);

      let league = document.createElement("td");
      let leaguename = document.createElement("p");
      leaguename.innerText = fixture.league.name;
      league.appendChild(leaguename);

      let date = document.createElement("td");
      date.setAttribute("class", "flex flex-1 m-3 flex-col text-right");
      let datestamp = document.createElement("p");
      datestamp.innerText = fixture.starting_at.split(" ")[0];
      date.appendChild(datestamp);

      currentFixture.appendChild(matchup);
      if (liveGame || finished) {
        fixture.scores.forEach((el) => {
          if (el.description == "CURRENT") {
            if (el.score.participant == "home") {
              let homescore = document.createElement("p");
              homescore.innerText = String(el.score.goals);
              scores.appendChild(homescore);
            }
            if (el.score.participant == "away") {
              let awayscore = document.createElement("p");
              awayscore.innerText = String(el.score.goals);
              scores.appendChild(awayscore);
            }
          }
        });
        currentFixture.appendChild(scores);
        let possesionEl = document.createElement("td");
        let possesionTextH = document.createElement("p");
        let possesionTextA = document.createElement("p");
        let possesionStats = fixture.statistics.filter((el) =>
          el.type.code == "ball-possession" ? true : false
        );
        console.log(possesionStats);
        if (possesionStats.length != 0) {
          possesionTextH.innerText =
            possesionStats.filter((el) =>
              el.location == "home" ? true : false
            )[0].data.value + "%";
          possesionTextA.innerText =
            possesionStats.filter((el) =>
              el.location == "away" ? true : false
            )[0].data.value + "%";
          possesionEl.appendChild(possesionTextH);
          possesionEl.appendChild(possesionTextA);
        }

        currentFixture.appendChild(possesionEl);
        buttonlink.innerText = "More info";
        buttonlink.setAttribute("href", `info.html?data=${fixture.id}`);
        currentFixture.appendChild(button);
      } else {
        buttonlink.innerText = "Predict";
        buttonlink.setAttribute("href", `simulator.html?data=${fixtureData}`);
        currentFixture.appendChild(button);
      }
      currentFixture.appendChild(league);
      currentFixture.appendChild(date);

      if (liveGame) {
        liveGamesContainer.appendChild(currentFixture);
      } else if (finished) {
        finishedGamesContainer.appendChild(currentFixture);
      } else {
        schedualedGamesContainer.appendChild(currentFixture);
      }
    }
  });
}

function DateChanged(e) {
  let date = e.target.value.split("-");
  let league = document.getElementById("leagueSelect").value;
  liveGamesContainer.innerHTML = "";
  schedualedGamesContainer.innerHTML = "";
  finishedGamesContainer.innerHTML = "";

  GetMatchups(date[0], date[1], date[2], 1, league);
}

fetch(`../src/data/leaguelist.json`)
  .then((response) => response.json())
  .then((data) => GetAllLeagues(data.data));
function GetAllLeagues(data) {
  let selectLeague = document.getElementById("leagueSelect");
  console.log(data);
  data = data.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  for (let i = 0; i < data.length; i = i + 1) {
    let league = data[i];
    let option = document.createElement("option");
    option.value = `${league.id}`;
    option.innerHTML = league.name;
    selectLeague.appendChild(option);
  }
}

function LeagueChanged(event) {
  let fixturesSelDate = JSON.parse(sessionStorage.getItem("SHOWNMATCHUPS"));
  liveGamesContainer.innerHTML = "";
  schedualedGamesContainer.innerHTML = "";
  finishedGamesContainer.innerHTML = "";
  ParseMatchups(fixturesSelDate, event.target.value);
  console.log(fixturesSelDate);
}
