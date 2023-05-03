/*Dohvaća spremljenog korisnika*/
let user =
  localStorage.getItem("USER") !== null &&
  localStorage.getItem("USER") != "undefined"
    ? JSON.parse(localStorage.getItem("USER"))
    : null;

const sportMonksToken =
  "WRQ2rljTRFJABZamseStggeOoiP1GMzvBCqMw7Ox6jq2LrPKUGdZqKOpRjod";

/*Firebase inicijalizacija*/
const requestOptions = {
  method: "GET",
  redirect: "follow",
};

const firebaseConfig = {
  apiKey: "AIzaSyC53RtA4CcnEAzVIpNJq0jCoUkGSD8Uwtw",
  authDomain: "editnogonet.firebaseapp.com",
  databaseURL:
    "https://editnogonet-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "editnogonet",
  storageBucket: "editnogonet.appspot.com",
  messagingSenderId: "411313607141",
  appId: "1:411313607141:web:eca032267a53c7198c1f0c",
  measurementId: "G-N51E01Y79Y",
};
const app = firebase.initializeApp(firebaseConfig);
let database = app.firestore();

/*Učitava informacije ulogiranog korisnika na početnoj stranici*/
function LoadInfo() {
  let teamPic = user.favClubs[2];
  let username = user.username;
  let teamElo = JSON.parse(localStorage.getItem("FAVTEAMELO"));

  document.getElementById("teamPic").setAttribute("src", teamPic);
  document.getElementById("teamElo").innerHTML = teamElo;
  document.getElementById("username").innerText = username;
  document.getElementById(
    "leagueGamesBtn"
  ).innerText = `Današnje utakmice u ${user.flwLeague[0]}`;
  document
    .getElementById("leagueGamesBtn")
    .setAttribute("href", `utakmice.html?data=${user.flwLeague[1]}`);

  LoadFixtures(user.favClubs[1]);
}

/*Provjerava je li korisnik ulogiran i ako je vodi ga na početnu stranicu te učitava njegove infomacije, ako nije onda ga vodi na stranicu za registriranje*/
function CheckUser() {
  user =
    localStorage.getItem("USER") !== null &&
    localStorage.getItem("USER") != "undefined"
      ? JSON.parse(localStorage.getItem("USER"))
      : null;

  if (user != null) {
    window.location.href = "html/accpage.html";
  } else {
    window.location.href = "html/homepage.html";
  }
}

/*Mijenja navbar između prikazivanja botuna za registiranje/ulogiranje i odjave*/
function SwitchNav() {
  let signout = document.getElementById("signout");
  let signin = document.getElementById("signin");
  if (user != null) {
    document.getElementById("signout").classList.toggle("hidden");
    document.getElementById("signoutsm").classList.toggle("hidden");
  } else {
    document.getElementById("signin").classList.toggle("hidden");
    document.getElementById("signinsm").classList.toggle("hidden");
    document.getElementById("signup").classList.toggle("hidden");
    document.getElementById("signupsm").classList.toggle("hidden");
  }
}

/*Učitava utakmice tima kojeg korisnik prati*/
function LoadFixtures(teamid) {
  let latestGamesTable = document.getElementById("latestGames");
  let upcomingMatchesContainer = document.getElementById("upcomingMatches");

  /*Dobiva zadnje i buduće utakmie od tima utakmice*/
  fetch(
    `https://api.sportmonks.com/v3/football/teams/${teamid}?api_token=${sportMonksToken}&include=latest;upcoming;`
  )
    .then((res) => res.json())
    .then((data) => {
      let latestGames = data.data.latest.slice(0, 5); /*Sprema zadjih 5 utakmica u listu*/
      let upcomingMatches = data.data.upcoming.slice(0, 3); /*Sprema buduće 3 najbliže utakmie u listu*/

      /*Za svaku utakmicu u listi latestGames napravi novi redak u tablici za prošle utakmice*/
      latestGames.forEach((el) => {
        /*Dobivamo dodatne informacije o toj utakmici kao statistika, liga i rezultat*/
        fetch(
          `https://api.sportmonks.com/v3/football/fixtures/${el.id}?api_token=${sportMonksToken}&include=scores;statistics.type;league`
        )
          .then((res) => res.json())
          .then((data) => {
            let fixture = data.data;

            let teams = fixture.name.split(" vs ");
            let results = fixture.scores.filter((el) =>
              el.description == "CURRENT" ? true : false
            );
            let possesionStats = fixture.statistics.filter((el) =>
              el.type.code == "ball-possession" ? true : false
            );

            let fixtureItem = document.createElement("tr");
            let teamsEl = document.createElement("td");
            let teamH = document.createElement("p");
            teamH.innerText = teams[0];
            let teamA = document.createElement("p");
            teamA.innerText = teams[1];
            AppendChildren(teamsEl, [teamH, teamA]);

            let resultEl = document.createElement("td");
            let resultH = document.createElement("p");
            resultH.innerText = results.filter((el) =>
              el.score.participant == "home" ? true : false
            )[0].score.goals;
            let resultA = document.createElement("p");
            resultA.innerText = results.filter((el) =>
              el.score.participant == "away" ? true : false
            )[0].score.goals;
            AppendChildren(resultEl, [resultH, resultA]);

            let possesionEl = document.createElement("td");
            let possesionTextH = document.createElement("p");
            let possesionTextA = document.createElement("p");
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
            let moreInfoEl = document.createElement("td");
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
            let linkData = { data: fixture.id, type: "gameinfo" };
            let encodedLinkData = encodeURIComponent(JSON.stringify(linkData));
            buttonlink.innerText = "Više";
            buttonlink.setAttribute(
              "href",
              `simulator.html?data=${encodedLinkData}`
            );
            AppendChildren(fixtureItem, [
              teamsEl,
              resultEl,
              possesionEl,
              button,
              league,
              date,
            ]);

            latestGamesTable.appendChild(fixtureItem);
          });
      });

      /*Za svaku utakmicu u listi upcomingMatches stavlja novi botun koji vodi na simulator za predviđanje*/
      upcomingMatches.forEach((el) => {
        let linkData = {
          data: {
            hTeam: el.name.split(" vs ")[0],
            aTeam: el.name.split(" vs ")[1],
          },
          type: "prediction",
        };
        let encodedLinkData = encodeURIComponent(JSON.stringify(linkData));
        upcomingMatchesContainer.innerHTML += `
          <div class="h-[240px] text-center flex flex-col items-center m-2 justify-center w-[251px]">
            <p>${el.name}</p>
            <img src="../assets/imgs/hajduk.jpeg" alt="tim" />
            <a
              href="simulator.html?data=${encodedLinkData}"
              class="bg-[#15caa7] border-t-0 border-y-4 border-teal-700 hover:bg-teal-600 text-black font-bold my-3 p-2 text-center w-full rounded shadow-slate-900 shadow-md hover:shadow-teal-400/50"
            >
              Quick simulate
            </a>
        </div>`;
      });
    });
}

/*Prikazuje ostatak navbara kada je mali ekran */
function ShowNavSm() {
  document.getElementById("navsm").classList.toggle("hidden");
  document.getElementById("navbarmd").classList.toggle("blur-lg");
  document.getElementById("container").classList.toggle("blur-lg");
}

/*Briše taj ostatak*/
function CloseNavSm() {
  document.getElementById("navsm").classList.toggle("hidden");
  document.getElementById("navbarmd").classList.toggle("blur-lg");
  document.getElementById("container").classList.toggle("blur-lg");
}

/*Odjavljuje korisnika i briše ga iz local storagea*/
function SignOut() {
  localStorage.setItem("USER", null);
  window.location.href = "homepage.html";
}

/*Funkcija koju koristimo za dodavat više child elemenata nekom parentu*/
function AppendChildren(parent, children) {
  children.forEach((el) => parent.appendChild(el));
  return parent;
}