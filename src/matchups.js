let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();

function GetTodayMatchups() {
  fetch(`https://api.sportmonks.com/v3/football/fixtures/date/${yyyy}-${mm}-${dd}?api_token=${sportMonksToken}&include=scores;league;`).then(response => response.json()).then(data => ParseMatchups(data.data, 'currentmatchupslist'));
}

function ParseMatchups(fixtures, containerid) {
  let container = document.getElementById(containerid);
  fixtures.forEach(el => {
    let currentFixture = document.createElement('div');
    currentFixture.setAttribute('class', 'flex m-5 p-1 items-center dark:text-slate-300 bg-slate-900 opacity-60');
    let matchup = document.createElement('div'); matchup.setAttribute('class', 'flex m-3 flex-col');
    let teams = el.name.split(' vs ');
    teams.forEach(team => { let teamspan = document.createElement('span'); teamspan.innerText = team; matchup.appendChild(teamspan); });
    let scores = document.createElement('div'); scores.setAttribute('class', 'flex m-3 flex-col');
    if (el.scores.length != 0) {
      el.scores.forEach(el => {
        if (el.description == "CURRENT") {
          if (el.score.participant == "home") {
            let homescore = document.createElement('span'); homescore.innerText = String(el.score.goals);
            scores.appendChild(homescore);
          }
          if (el.score.participant == "away") {
            let awayscore = document.createElement('span'); awayscore.innerText = String(el.score.goals);
            scores.appendChild(awayscore);
          }
        }
      });
    } else {
      let zeroscore = document.createElement('span'); zeroscore.innerText = '0';
      scores.appendChild(zeroscore);
      scores.appendChild(zeroscore);
    }

    let prediction = document.createElement('div'); prediction.setAttribute('class', 'flex m-3 flex-col');
    let predictionlink = document.createElement('a'); predictionlink.innerText = 'Predict';
    prediction.appendChild(predictionlink);

    let league = document.createElement('div'); league.setAttribute('class', 'flex m-3 flex-col');
    let leaguename = document.createElement('span'); leaguename.innerText = el.league.name;
    league.appendChild(leaguename);

    let date = document.createElement('div'); date.setAttribute('class', 'flex flex-1 m-3 flex-col text-right');
    let datestamp = document.createElement('span'); datestamp.innerText = el.starting_at.split(" ")[0];
    date.appendChild(datestamp);

    currentFixture.appendChild(matchup);
    currentFixture.appendChild(scores);
    currentFixture.appendChild(prediction);
    currentFixture.appendChild(league);
    currentFixture.appendChild(date);

    container.appendChild(currentFixture);
  });
}