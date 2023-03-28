const hfa = 100;
const k = 10;

CreateSelectTeam()
async function CreateSelectTeam(){
    let selectHomeTeam = document.getElementById('selectHomeTeam');
    let selectAwayTeam = document.getElementById('selectAwayTeam');
      for (let i = 1; i < 13; i++) {
        fetch(`https://api.sportmonks.com/v3/football/teams?api_token=${sportMonksToken}&page=${i}&filters=populate&per_page=1000&include=`).then(response => response.json()).then(data => {
          let teams = data.data;
          for (let i = 0; i < teams.length; i++) {
            let team = teams[i];
            let option = document.createElement('option');
            option.value = `${team.name}|${team.id}|${team.image_path}`;
            option.innerHTML = team.name;
            let option2 = option.cloneNode(true)
            selectAwayTeam.appendChild(option);
            selectHomeTeam.appendChild(option2);
          }
        });
      }
}


function CalculateWinRate(homeElo, awayElo){
  console.log("home calc", homeElo);
  console.log("away calc", awayElo);
    let Ea = 1/(1+10**((awayElo - (homeElo+hfa))/400));
    console.log(Ea);
    return Ea;
}


async function Predict(){
  let homeTeam = document.getElementById('selectHomeTeam').value.split('|');
  let awayTeam = document.getElementById('selectAwayTeam').value.split('|');

  console.log(homeTeam)
  let containerHome = document.getElementById('homeContainer');
  document.getElementById('infoContainer').removeChild(document.getElementById('selectHomeTeam'));
  
  let containerAway = document.getElementById('awayContainer');
  document.getElementById('infoContainer').removeChild(document.getElementById('selectAwayTeam'));

  document.getElementById('predictButton').parentElement.removeChild(document.getElementById('predictButton'))

  let buttonContiainer = document.getElementById('buttons')
  buttonContiainer.classList.toggle('hidden');
  let homeBar = document.getElementById('homeBar');
  let awayBar = document.getElementById('awayBar');

  let homeTeamElo = await GetTeamElo(homeTeam[0]);
  let awayTeamElo = await GetTeamElo(awayTeam[0]);
  alert("Elo je dobiven")
  console.log("home elo",homeTeamElo[homeTeamElo.length-1][3])
  console.log("away elo",awayTeamElo[awayTeamElo.length-1][3])

  let homeTeamWinRate = CalculateWinRate(homeTeamElo[homeTeamElo.length-1][3], awayTeamElo[awayTeamElo.length-1][3]);

  if (parseInt(homeTeamWinRate*100) >= 50) {
    homeBar.innerText = parseInt(homeTeamWinRate*100);
  } else{
    awayBar.innerText = 100 - parseInt(homeTeamWinRate*100); 
  }
  homeBar.classList.toggle('h-[50%]');
  homeBar.style.height = `${parseInt(homeTeamWinRate*100)}%`
  
  awayBar.classList.toggle('h-[50%]');
  awayBar.style.height = `${100 - parseInt(homeTeamWinRate*100)}%`
  
  containerHome.innerHTML = ''
  let homeLabel = document.createElement('h3');
  homeLabel.innerHTML = homeTeam[0];
  homeLabel.setAttribute('class', 'teamName');

  let homePic = document.createElement('img');
  homePic.setAttribute('src', `${homeTeam[2]}`);
  homePic.setAttribute('class', 'teamPic');

  containerHome.appendChild(homeLabel);
  containerHome.appendChild(homePic);

  containerAway.innerHTML = ''
  let awayLabel = document.createElement('h3');
  awayLabel.innerHTML = awayTeam[0];
  awayLabel.setAttribute('class', 'teamName');

  let awayPic = document.createElement('img');
  awayPic.setAttribute('src', `${awayTeam[2]}`);
  awayPic.setAttribute('class', 'teamPic');

  containerAway.appendChild(awayLabel);
  containerAway.appendChild(awayPic);
}

async function GetTeamElo(teamName) {
  let team = teamName.split(" ").join("");
  if(teamName == "Hajduk Split"){team = "Hajduk"}
  else if(teamName == "FC Barcelona"){team ="Barcelona"}
  let fullData = []
  await fetch(`http://api.clubelo.com/${team}`, requestOptions)
    .then(response => response.text())
    .then(result => {
      let dataRows = result.split('\n').slice(1000);
      dataRows.forEach(row => {
        if (row != "") { fullData.push(row.split(',').slice(1)); }
      });
      console.log(fullData);
    })
    .catch(error => console.log('error', error));
    return fullData
}
