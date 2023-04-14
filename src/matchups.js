const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();

const liveGamesContainer = document.getElementById('liveGames')
const finishedGamesContainer = document.getElementById('finishedGames')
const schedualedGamesContainer = document.getElementById('schedualedGames')

function GetTodayMatchups() {
  fetch(`https://api.sportmonks.com/v3/football/fixtures/date/${yyyy}-${mm}-${dd}?api_token=${sportMonksToken}&include=scores;league;venue;statistics.type;participants;`).then(response => response.json()).then(data => ParseMatchups(data.data));
}

function ParseMatchups(fixtures, containerid) {
  fixtures.forEach(fixture => {
    let liveGame = fixture.scores.length != 0 && fixture.result_info === null ? true : false;
    let finished = fixture.result_info !== null ? true : false;
    let currentFixture = document.createElement('tr');
    let matchup = document.createElement('td');
    let teams = fixture.name.split(' vs ');
    teams.forEach(team => { let teamspan = document.createElement('p'); teamspan.innerText = team; matchup.appendChild(teamspan); });

    let scores = document.createElement('td');
    if (liveGame || finished) {
      fixture.scores.forEach(el => {
        if (el.description == "CURRENT") {
          if (el.score.participant == "home") {
            let homescore = document.createElement('p'); homescore.innerText = String(el.score.goals);
            scores.appendChild(homescore);
          }
          if (el.score.participant == "away") {
            let awayscore = document.createElement('p'); awayscore.innerText = String(el.score.goals);
            scores.appendChild(awayscore);
          }
        }
      });
    }

    let button = document.createElement('td');
    let buttonlink = document.createElement('button');  buttonlink.setAttribute('class', 'bg-[#1bb198] border-t-0 border-y-4 border-green-800 hover:bg-green-700 text-white font-bold my-3 py-2 text-center w-full rounded shadow-slate-900  shadow-md hover:shadow-green-500/50');
    button.appendChild(buttonlink);

    let league = document.createElement('td');
    let leaguename = document.createElement('p'); leaguename.innerText = fixture.league.name;
    league.appendChild(leaguename);

    let date = document.createElement('td'); date.setAttribute('class', 'flex flex-1 m-3 flex-col text-right');
    let datestamp = document.createElement('p'); datestamp.innerText = fixture.starting_at.split(" ")[0];
    date.appendChild(datestamp);

    currentFixture.appendChild(matchup);
    if(liveGame || finished){
      currentFixture.appendChild(scores);
      let possesionEl = document.createElement('td');
      let possesionTextH = document.createElement('p');
      let possesionTextA = document.createElement('p');
      let possesionStats = fixture.statistics.filter((el) => el.type.code == "ball-possession" ? true : false)

      possesionTextH.innerText = possesionStats.filter((el) => el.location == "home" ? true : false)[0].data.value+'%';
      possesionTextA.innerText = possesionStats.filter((el) => el.location == "away" ? true : false)[0].data.value+'%';
      possesionEl.appendChild(possesionTextH); possesionEl.appendChild(possesionTextA);
      currentFixture.appendChild(possesionEl)
      buttonlink.innerText = 'More info';
      buttonlink.addEventListener('click', ()=>{selectedMatch = currentFixture; window.location.href = 'info.html'})
      currentFixture.appendChild(button);
    } else{
      buttonlink.innerText = 'Predict';
      buttonlink.addEventListener('click', ()=>{selectedMatch = currentFixture; window.location.href = 'simulator.html'})
      currentFixture.appendChild(button);
    }
    currentFixture.appendChild(league);
    currentFixture.appendChild(date);

    if(liveGame){ liveGamesContainer.appendChild(currentFixture);} 
    else if(finished){finishedGamesContainer.appendChild(currentFixture);} 
    else{schedualedGamesContainer.appendChild(currentFixture);}
    
  });
}