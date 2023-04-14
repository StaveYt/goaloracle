let user =
  localStorage.getItem("USER") !== null &&
  localStorage.getItem("USER") != "undefined"
    ? JSON.parse(localStorage.getItem("USER"))
    : null;

console.log(user);

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

const sportMonksToken =
  "WRQ2rljTRFJABZamseStggeOoiP1GMzvBCqMw7Ox6jq2LrPKUGdZqKOpRjod";

const app = firebase.initializeApp(firebaseConfig);
let database = app.firestore();

let selectedMatch = {};

function LoadInfo() {
  console.log(user);
  let teamPic = user.favClubs[2];
  let username = user.username;
  let teamElo = JSON.parse(localStorage.getItem("FAVTEAMELO"));
  console.log(teamElo)
  document.getElementById("teamPic").setAttribute("src", teamPic);
  document.getElementById("teamElo").innerHTML = teamElo;
  document.getElementById("username").innerText = username;
  LoadLastGames(user.favClubs[1]);
}
{/* <tr>
<td class="">
  <p>Dinamo</p>
  <p>Hajduk</p>
</td>
<td class="">
  <p>0</p>
  <p>4</p>
</td>
<td class="">
  <p>0%</p>
  <p>100%</p>
</td>
<td>90+12</td>
<td>Feb 6, 2023.</td>
</tr>  */}
function LoadLastGames(teamid){
  let latestGamesTable = document.getElementById("latestGames");
  fetch(`https://api.sportmonks.com/v3/football/teams/${teamid}?api_token=${sportMonksToken}&include=latest;`).then(res => res.json()).then(data => {
    let latestGames = data.data.latest.slice(0,5);
    latestGames.forEach(el => {
      fetch(`https://api.sportmonks.com/v3/football/fixtures/${el.id}?api_token=${sportMonksToken}&include=scores;statistics.type;`).then(res=>res.json()).then(data=>{
        let fixture = data.data
        console.log(fixture)
        let teams = fixture.name.split(' vs ');
        let results = fixture.scores.filter(el=>el.description=="CURRENT" ? true : false)
        let possesionStats = fixture.statistics.filter((el) => el.type.code == "ball-possession" ? true : false)
        console.log(results);
        console.log(results.filter(el => el.score.participant == "home"? true : false))
        
        let fixtureItem = document.createElement('tr');
  
        let teamsEl = document.createElement('td');
        let teamH = document.createElement('p'); teamH.innerText = teams[0];
        let teamA = document.createElement('p'); teamA.innerText = teams[1];
        AppendChildren(teamsEl,[teamH, teamA]);
  
        let resultEl = document.createElement('td');
        let resultH = document.createElement('p'); resultH.innerText = results.filter(el => el.score.participant == "home"? true : false)[0].score.goals;
        let resultA = document.createElement('p'); resultA.innerText = results.filter(el => el.score.participant == "away"? true : false)[0].score.goals;
        AppendChildren(resultEl,[resultH, resultA]);

        let possesionEl = document.createElement('td');
        let moreInfoEl = document.createElement('td');
        let leagueEl = document.createElement('td');
        let dateEl = document.createElement('td');
  
        AppendChildren(fixtureItem, [teamsEl,resultEl,possesionEl,moreInfoEl,leagueEl,dateEl])
  
        latestGamesTable.appendChild(fixtureItem);
      })
    })
  })
}

function AppendChildren(parent, children){
  children.forEach(el=>parent.appendChild(el))
  return parent;
}


function CheckUser() {
  user =
  localStorage.getItem("USER") !== null &&
  localStorage.getItem("USER") != "undefined"
    ? JSON.parse(localStorage.getItem("USER"))
    : null;
  
  if (user != null) {
    window.location.href = "html/testaccpage.html";
  } else {
    window.location.href = "signintest.html";
  }
}

function SignOut() {
  localStorage.setItem("USER", null);
  window.location.href = "../signintest.html";
}

function GoToSimulator() {
  window.location.href = "simulator.html";
}
