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
  document.getElementById("leagueGamesBtn").innerText= `Današnje utakmice u ${user.flwLeague[0]}`;
  document.getElementById("leagueGamesBtn").setAttribute('href', `utakmicetest.html?data=${user.flwLeague[1]}`)
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
function SwitchNav(){
  let navbarBig = document.getElementById('navlg')
  if(user!=null){
    navbarBig.innerHTML +=`
    <div class="text-center">
    <button
      onclick="SignOut('signin')"
      class="bg-[#1bb198] border-t-0 border-y-4 border-teal-800 hover:bg-teal-700 text-black font-bold my-3 py-2 text-center w-20 rounded shadow-slate-900 shadow-md hover:shadow-teal-500/50"
    >
      Sign Out
    </button>
  </div>`
  }else{
    body.innerHTML+=`<div class="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] hidden" id="signInBox">
    <div class="flex flex-col m-auto p-4 w-96 text-slate-300 bg-stone-800 rounded-md" id="signInContainer">
        <div class="m-4">
            <input class="shadow-md shadow-slate-900 w-full p-2 bg-stone-600 text-center rounded-md" type="text"
                id="usernameInput" placeholder="Username">
        </div>
        <div class="m-4 hidden" id="emailWrapper">
            <input class="shadow-md shadow-slate-900 w-full p-2 bg-stone-600 text-center rounded-md" type="email"
                id="emailInput" placeholder="Email">
        </div>
        <div class="m-4">
            <input class="shadow-md shadow-slate-900 w-full p-2 text-center bg-stone-600 rounded-md" type="password"
                id="passwordInput" placeholder="Password">
        </div>
        <div class="m-4 hidden" id="passConfirmWrapper">
            <input class="shadow-md shadow-slate-900 w-full p-2 bg-stone-600 text-center rounded-md" type="password"
                id="passConfirmInput" placeholder="Confirm Password">
        </div>
        <div class="m-4 hidden text-center" id="leagueSelectWrapper">
            <label for="leagueSelect" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Liga</label>
            <select id="leagueSelect"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option selected hidden disabled>Izaberite nogometnu ligu</option>
            </select>
        </div>
        <div class="m-4 hidden text-center" id="teamSelectWrapper">
            <label for="teamSelect" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tim</label>
            <select id="teamSelect"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option selected hidden disabled>Izaberite Tim</option>
            </select>
        </div>
        <button
            class="my-4 mx-5 bg-[#1bb198] p-3 rounded-md shadow-slate-900  border-t-0 transition duration-300 border-y-4 border-green-800 shadow-md  font-bold text-lg [text-shadow:0_3px_3px_#000] hover:bg-green-700 text-slate-200 hover:shadow-green-500/50"
            id="signInButton">
            Sign in
        </button>
        <a class="my-2 self-center underline hover:cursor-pointer transition duration-200 hover:text-slate-700 [text-shadow:0_3px_3px_#000]"
            id="createAccount">Create an account</a>
    </div>
</div>
<script src="../src/register.js"></script>`
  navbarBig.innerHTML+=`  <div class="text-center">
    <button
      onclick="SignOut('signin')"
      class="bg-[#4b4b4f] border-t-0 border-y-4 border-stone-800 hover:bg-stone-700 font-bold my-3 py-2 text-center w-20 rounded shadow-slate-900 shadow-md hover:shadow-stone-500/50"
    >
      Sign Up
    </button>
  </div>
  <div class="text-center">
    <button
      onclick="SignOut('signin')"
      class="text-black bg-[#1bb198] border-t-0 border-y-4 border-teal-800 hover:bg-teal-700 font-bold mb-3 py-2 text-center w-20 rounded shadow-slate-900 shadow-md hover:shadow-teal-500/50"
    >
      Sign In
    </button>
  </div>`
  }

}
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
