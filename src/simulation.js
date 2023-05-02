const hfa = 100.00;
const k = 10;

const urlParams = new URLSearchParams(window.location.search);
const data = JSON.parse(decodeURIComponent(urlParams.get("data")));
console.log(data);

const container = document.getElementById('infoContainer')
const statsBtn = document.getElementById("statsBtn")
const lineupBtn = document.getElementById("lineupBtn")

const buttonContainer = document.getElementById('buttons')

let fixture;
let lineupContainer;
let statsContainer
function OnLoad(){
  if(data!=null){
    buttonContainer.classList.toggle('hidden');
    container.innerHTML=""
    if(data.type=="prediction"){
      let hTeam;
      let aTeam;
      fetch('../src/data/teamlist.json').then(res => res.json()).then(teams=> teams.data.forEach(el=> {
        if(el.id == data.data.hTeam || el.name==data.data.hTeam){hTeam=el; console.log(hTeam)}
        else if(el.id == data.data.aTeam || el.name==data.data.aTeam){aTeam=el; console.log(aTeam)}
      })).then(res=>{
        if(hTeam==undefined||aTeam==undefined){
          container.innerHTML='<h1 class="text-white self-center">Trenutno nemamo ELOeve tih timova u našoj bazi</h1>'
        }else{
          Predict([hTeam.name, hTeam.id,hTeam.image_path, hTeam.elo],[aTeam.name, aTeam.id,aTeam.image_path,aTeam.elo])
        }})
    }
    else if(data.type=="gameinfo"){
      fetch(`https://api.sportmonks.com/v3/football/fixtures/${data.data}?api_token=${sportMonksToken}&include=participants;scores;statistics.type;lineups.type;`).then(res=>res.json()).then(fixtureData=>{
        fixture=fixtureData.data
        let homeLabel = document.createElement('h3');
        let containerHome = document.getElementById('homeContainer');
        let containerAway = document.getElementById('awayContainer');
        containerHome.innerHTML = ''
        homeLabel.innerHTML = fixture.participants[0].name;
        homeLabel.setAttribute('class', 'teamName');
      
        let homePic = document.createElement('img');
        homePic.setAttribute('src', `${fixture.participants[0].image_path}`);
        homePic.setAttribute('class', 'teamPic');
      
        containerHome.appendChild(homeLabel);
        containerHome.appendChild(homePic);
      
        containerAway.innerHTML = ''
        let awayLabel = document.createElement('h3');
        awayLabel.innerHTML = fixture.participants[1].name;
        awayLabel.setAttribute('class', 'teamName');
      
        let awayPic = document.createElement('img');
        awayPic.setAttribute('src', `${fixture.participants[1].image_path}`);
        awayPic.setAttribute('class', 'teamPic');

        containerAway.appendChild(awayLabel);
        containerAway.appendChild(awayPic);
      
        ShowLineup()
    })
    }
  }
  if(data==null || data.type=="prediction"){
    statsBtn.setAttribute('disabled', true)
    let classes = ['hover:bg-teal-600', 'hover:shadow-teal-400/50', 'bg-[#15caa7]', 'bg-[#2e2e2e]', 'border-teal-700', 'border-slate-900', 'text-white']
    classes.forEach(el=>statsBtn.classList.toggle(el))
    lineupBtn.setAttribute('disabled', true)
    classes.forEach(el=>lineupBtn.classList.toggle(el))
    if(data==null){
      CreateSelectTeam();
    }
  } 
  
  SwitchNav();
  

}

async function CreateSelectTeam(){
    let selectHomeTeam = document.getElementById('selectHomeTeam');
    let selectAwayTeam = document.getElementById('selectAwayTeam');
        fetch(`../src/data/teamlist.json`).then(response => response.json()).then(data => {
          let teams = [...data.data];
          teams = teams.sort((a,b)=>{
            if(a.name < b.name){ return -1 }
            if ( a.name > b.name) { return 1 }
            return 0;
          })
          for (let i = 0; i < teams.length; i++) {
            let team = teams[i];
            let option = document.createElement('option');
            option.value = `${team.name}|${team.id}|${team.image_path}|${team.elo}`;
            option.innerHTML = team.name;
            let option2 = option.cloneNode(true)
            selectAwayTeam.appendChild(option);
            selectHomeTeam.appendChild(option2);
          }
        });
      
}

function CalculateWinRate(homeElo, awayElo){
  console.log("home calc", homeElo);
  console.log("away calc", awayElo);
  let Ea = 1/(1+10**(((awayElo-hfa) - homeElo)/400))
  console.log(Ea);
  return Ea;
}

function PredictClick(){
  buttonContainer.classList.toggle('hidden');
  Predict(document.getElementById('selectHomeTeam').value.split('|'), document.getElementById('selectAwayTeam').value.split('|'))
}

async function Predict(hTeam, aTeam){
  console.log("predicting")
  console.log(hTeam,aTeam)
  let containerHome = document.getElementById('homeContainer');
  let containerAway = document.getElementById('awayContainer');
  
  
  let homeBar = document.getElementById('homeBar');
  let awayBar = document.getElementById('awayBar');

  let homeTeamElo = hTeam[3]
  let awayTeamElo = aTeam[3]

  let homeTeamWinRate = CalculateWinRate(homeTeamElo,awayTeamElo);

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
  homeLabel.innerHTML = hTeam[0];
  homeLabel.setAttribute('class', 'teamName');

  let homePic = document.createElement('img');
  homePic.setAttribute('src', `${hTeam[2]}`);
  homePic.setAttribute('class', 'teamPic');

  containerHome.appendChild(homeLabel);
  containerHome.appendChild(homePic);

  containerAway.innerHTML = ''
  let awayLabel = document.createElement('h3');
  awayLabel.innerHTML = aTeam[0];
  awayLabel.setAttribute('class', 'teamName');

  let awayPic = document.createElement('img');
  awayPic.setAttribute('src', `${aTeam[2]}`);
  awayPic.setAttribute('class', 'teamPic');

  containerAway.appendChild(awayLabel);
  containerAway.appendChild(awayPic);

  container.innerHTML=`<div class="self-center flex text-white flex-col"><h1>Domaći tim: ${hTeam[0]} ELO: ${homeTeamElo}</h1><h2>Šanse: ${parseInt(homeTeamWinRate*100)}%</h2></div>
  <div class="self-center flex flex-col text-white"><h1>Gostujući tim: ${aTeam[0]} ELO: ${awayTeamElo}</h1><h2>Šanse: ${parseInt(100-homeTeamWinRate*100)}%</h2></div>`;

}

function ShowLineup(){
  if(lineupContainer==undefined){
  teams = fixture.name.split(' vs ')
  container.innerHTML=`
  <div class="flex flex-col mx-5">
    <h1>Domaćin ${teams[0]}</h1>
    <div class="border-slate-900 border-2 h-[50%] overflow-auto" id="hFieldP">
      <h2>Prvih 11</h2>
    </div>
    <div class="border-slate-900 border-2 overflow-auto flex-1" id="hBench">
      <h2>Klupa</h2>
    </div>
  </div>
  <div class="flex flex-col mx-5">
    <h1>Gost ${teams[1]}</h1>
    <div class="border-slate-900 border-2 h-[50%] overflow-auto" id="aFieldP">
      <h2>Prvih 11</h2>
    </div>
    <div class="border-slate-900 border-2 overflow-auto" id="aBench">
      <h2>Klupa</h2>
    </div>
  </div>`

  let hTeam=fixture.participants[0].id
  let aTeam=fixture.participants[1].id
  let hBench=document.getElementById('hBench')
  let hFieldP=document.getElementById('hFieldP')
  let aBench=document.getElementById('aBench')
  let aFieldP=document.getElementById('aFieldP')
  fixture.lineups.forEach(el=>{
    
    if(el.team_id==hTeam){
      if(el.type_id==11){
        hFieldP.innerHTML+=`<p class="border-slate-800 border-[1px]">${el.player_name} ${el.jersey_number}</p>`
      }else{
        hBench.innerHTML+=`<p class="border-slate-800 border-[1px]">${el.player_name} ${el.jersey_number}</p>`
      }
    }
    if(el.team_id==aTeam){
      if(el.type_id==11){
        aFieldP.innerHTML+=`<p class="border-slate-800 border-[1px]">${el.player_name} ${el.jersey_number}</p>`
      }else{
        aBench.innerHTML+=`<p class="border-slate-800 border-[1px]">${el.player_name} ${el.jersey_number}</p>`
      }
    }
  })
  lineupContainer=container.innerHTML
  }else{
    container.innerHTML=lineupContainer
  }
}

function ShowStats(){
  if(statsContainer==undefined){
    let hTeam=fixture.participants[0].name
    let aTeam=fixture.participants[1].name
    let hTeamStats=fixture.statistics.filter(el=>el.location=="home"?true:false)
    let aTeamStats=fixture.statistics.filter(el=>el.location=="away"?true:false)
    let scores = fixture.scores.filter(el=> el.description="CURRENT"?true:false)
    let hScore = scores.filter(el=>el.score.participant=="home")[0].score.goals 
    let aScore = scores.filter(el=>el.score.participant=="away")[0].score.goals 
    container.innerHTML=`
    <div class="self-center mx-auto flex flex-col">
    <div class="grid grid-cols-3">
    <h1>${hTeam}</h1>
    <h1>Statistika</h1>
    <h1>${aTeam}</h1>
    </div>
    <div class="grid grid-cols-3">
  <h3>${hScore}</h3><h3>Golovi</h3><h3>${aScore}</h3>
</div>

<div class="grid grid-cols-3 gap-x-2">
  <h3>${hTeamStats.filter(el => el.type.name == "Passes")[0].data.value}</h3>
  <h3>Dodavanja</h3>
  <h3>${aTeamStats.filter(el => el.type.name == "Passes")[0].data.value}</h3>
</div>

<div class="grid grid-cols-3 gap-x-2">
  <h3>${hTeamStats.filter(el => el.type.name == "Ball Possession %")[0].data.value}</h3>
  <h3>Posjed lopte</h3>
  <h3>${aTeamStats.filter(el => el.type.name == "Ball Possession %")[0].data.value}</h3>
</div>

<div class="grid grid-cols-3 gap-x-2">
  <h3>${hTeamStats.filter(el => el.type.name == "Yellowcards")[0].data.value}</h3>
  <h3>Žuti Kartoni</h3>
  <h3>${aTeamStats.filter(el => el.type.name == "Yellowcards")[0].data.value}</h3>
</div>

<div class="grid grid-cols-3 gap-x-2">
  <h3>${hTeamStats.filter(el => el.type.name == "Redcards")[0].data.value}</h3>
  <h3>Crveni Kartoni</h3>
  <h3>${aTeamStats.filter(el => el.type.name == "Redcards")[0].data.value}</h3>
</div>

<div class="grid grid-cols-3 gap-x-2">
  <h3>${hTeamStats.filter(el => el.type.name == "Fouls")[0].data.value}</h3>
  <h3>Fauli</h3>
  <h3>${aTeamStats.filter(el => el.type.name == "Fouls")[0].data.value}</h3>
</div>

<div class="grid grid-cols-3 gap-x-2">
  <h3>${hTeamStats.filter(el => el.type.name == "Corners")[0].data.value}</h3>
  <h3>Korneri</h3>
  <h3>${aTeamStats.filter(el => el.type.name == "Corners")[0].data.value}</h3>
</div>

<div class="grid grid-cols-3 gap-x-2">
  <h3>${hTeamStats.filter(el => el.type.name == "Offsides")[0].data.value}</h3>
  <h3>Offside</h3>
  <h3>${aTeamStats.filter(el => el.type.name == "Offsides")[0].data.value}</h3>
</div>

<div class="grid grid-cols-3 gap-x-2">
  <h3>${hTeamStats.filter(el => el.type.name == "Saves")[0].data.value}</h3>
  <h3>Obrana</h3>
  <h3>${aTeamStats.filter(el => el.type.name == "Saves")[0].data.value}</h3>
</div>
<div class="grid grid-cols-3 gap-x-2">
  <h3>${hTeamStats.filter(el => el.type.name == "Shots Total")[0].data.value}</h3>
  <h3>Ukupno šuteva</h3>
  <h3>${aTeamStats.filter(el => el.type.name == "Shots Total")[0].data.value}</h3>
</div>

<div class="grid grid-cols-3 gap-x-2">
  <h3>${hTeamStats.filter(el => el.type.name == "Shots On Target")[0].data.value}</h3>
  <h3>Šutevi u okvir</h3>
  <h3>${aTeamStats.filter(el => el.type.name == "Shots On Target")[0].data.value}</h3>
</div>

<div class="grid grid-cols-3 gap-x-2">
  <h3>${hTeamStats.filter(el => el.type.name == "Shots Off Target")[0].data.value}</h3>
  <h3>Šutevi izvan okvira</h3>
  <h3>${aTeamStats.filter(el => el.type.name == "Shots Off Target")[0].data.value}</h3>
</div>
    </div>`
    statsContainer=container.innerHTML
  }else{
    container.innerHTML=statsContainer
  }
}