/*Dobivanje današnjeg datuma*/
const today = new Date();
const tdd = String(today.getDate()).padStart(2, "0");
const tdm = String(today.getMonth() + 1).padStart(2, "0");
const tdy = today.getFullYear();

/*Parametri od linka kroz kojeg dobivamo informacije od drugih stranica*/
const urlParams = new URLSearchParams(window.location.search);
const data = urlParams.get("data");

const liveGamesContainer = document.getElementById("liveGames");
const finishedGamesContainer = document.getElementById("finishedGames");
const scheduledGamesContainer = document.getElementById("scheduledGames");

/*Lista prikazanih utakmica koju koristimo za sortiranje utakmica u datumu/ligi*/
let matchupList = []; 

function OnLoadMatchups() {
  /*Provjerava postoji li data parametar, ako postoji liga u parametru se stavlja kao liga u dobivanju utakmica, ako ne postoji liga je "all"*/
  if (data == null) {
    GetMatchups(tdy, tdm, tdd, 1, "all");
  } else {
    GetMatchups(tdy, tdm, tdd, 1, data);
    document.getElementById("leagueSelect").value = `${data}`;
  }

  /*Stavlja sve lige u izbornik za lige*/
  fetch(`../src/data/leaguelist.json`)
    .then((response) => response.json())
    .then((data) => GetAllLeagues(data.data));
}

/*Stavlja lige u izbornik*/
function GetAllLeagues(data) {
  let selectLeague = document.getElementById("leagueSelect");

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

/*Dobiva utakmice u određenom datumu i ligi (page argument je kako bi mogli ići kroz sve utakmice jer inače možemo maksimalno 50)*/
function GetMatchups(year, month, day, page, league) {
  fetch(
    `https://api.sportmonks.com/v3/football/fixtures/date/${year}-${month}-${day}?api_token=${sportMonksToken}&page=${page}&per_page=50&include=scores;league;venue;statistics.type;lineups;participants;`
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

/*Prikazuje utakmice*/
function ParseMatchups(fixtures, league) {
  fixtures.forEach((fixture) => {
    if (fixture.league_id == league || league == "all") {
      /*Provjerava je li utakmica uživo ili nije*/
      let liveGame =
      fixture.scores.length != 0 && fixture.result_info === null
      ? true
      : false;
      
      /*Provjerava je li utakmica gotova ili nije*/
      let finished = fixture.result_info !== null ? true : false;

      /*DOM element koji je redak trenutne utakmice */
      let currentFixture = document.createElement("tr"); 

      let matchup = document.createElement("td");
      let teams = fixture.name.split(" vs ");
      teams.forEach((team) => {
        let teamspan = document.createElement("p");
        teamspan.innerText = team;
        matchup.appendChild(teamspan);
      });
      currentFixture.appendChild(matchup);

      let button = document.createElement("td");
      let buttonlink = document.createElement("a");
      buttonlink.setAttribute(
        "class",
        "bg-[#1bb198] border-t-0 border-y-4 border-green-800 hover:bg-green-700 text-white font-bold my-3 p-2 text-center w-full rounded shadow-slate-900  shadow-md hover:shadow-green-500/50"
      );
      button.appendChild(buttonlink);
      
      /*Ako je utakmica uživo ili je gotova ima rezultate i statistiku za posjed te ih dodajemo na element currentFixture kako bi ih mogli prikazat*/
      if (liveGame || finished) {
        /*Dobiva rezultate utakmice i dodaje rezultate u redak*/
        let scores = document.createElement("td");
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
        
        /*Dobivamo i dodajemo statistiku posjeda*/
        let possesionEl = document.createElement("td");
        let possesionTextH = document.createElement("p");
        let possesionTextA = document.createElement("p");
        let possesionStats = fixture.statistics.filter((el) =>
          el.type.code == "ball-possession" ? true : false
        );
        /*Neke utakmice nemaju statistike iako su uživo ili gotove pa za svaki slučaj provjeravamo postoje li i dodajemo ih*/
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

        /*Mijenja botun na botun za više informacija o utakmici */
        let linkData = { data: fixture.id, type: "gameinfo" };
        let encodedLinkData = encodeURIComponent(JSON.stringify(linkData));
        buttonlink.innerText = "Više";
        buttonlink.setAttribute(
          "href",
          `simulator.html?data=${encodedLinkData}`
          );

        AppendChildren(currentFixture, [scores, possesionEl])
      } else {
        /*Mijenja botun na botun za predviđanje utakmice*/
        let linkData = {
          data: {
            hTeam: fixture.participants[0].id,
            aTeam: fixture.participants[1].id,
          },
          type: "prediction",
        };
        let encodedLinkData = encodeURIComponent(JSON.stringify(linkData));
        buttonlink.innerText = "Predvidi";
        buttonlink.setAttribute(
          "href",
          `simulator.html?data=${encodedLinkData}`
        );
      }

      /*Dodaje ligu u kojoj se utakmica igra u redak*/
      let league = document.createElement("td");
      let leaguename = document.createElement("p");
      leaguename.innerText = fixture.league.name;
      league.appendChild(leaguename);

      /*Dodaje datum na kojem se utakmica igra u redak*/
      let date = document.createElement("td");
      date.setAttribute("class", "flex flex-1 m-3 flex-col text-right");
      let datestamp = document.createElement("p");
      datestamp.innerText = fixture.starting_at.split(" ")[0];
      date.appendChild(datestamp);

      AppendChildren(currentFixture, [button, league, date])

      /*Provjerava koja je vrsta utakmice te ju stavlja u određenu tablicu*/
      if (liveGame) {
        liveGamesContainer.appendChild(currentFixture);
      } else if (finished) {
        finishedGamesContainer.appendChild(currentFixture);
      } else {
        scheduledGamesContainer.appendChild(currentFixture);
      }
    }
  });
}

/*Kada korisnik promjeni željeni datum koristeći izabranu ligu stavlja sve te utakmice (u toj ligi naravno) i prikazuje ih*/
function DateChanged(e) {
  let date = e.target.value.split("-");
  let league = document.getElementById("leagueSelect").value;
  liveGamesContainer.innerHTML = "";
  scheduledGamesContainer.innerHTML = "";
  finishedGamesContainer.innerHTML = "";

  GetMatchups(date[0], date[1], date[2], 1, league);
}

/*Kada korisnik promjeni ligu i filteru filtrira kroz već prikazane lige i njih prikazuje*/
function LeagueChanged(event) {
  let fixturesSelDate = JSON.parse(sessionStorage.getItem("SHOWNMATCHUPS"));
  liveGamesContainer.innerHTML = "";
  scheduledGamesContainer.innerHTML = "";
  finishedGamesContainer.innerHTML = "";
  ParseMatchups(fixturesSelDate, event.target.value);
}