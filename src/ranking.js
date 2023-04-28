let countries = [
  "Engleska",
  "Španjolska",
  "Njemačka",
  "Italija",
  "Francuska",
  "Portugal",
  "Nizozemska",
  "Austrija",
  "Rusija",
  "Belgija",
  "Švicarska",
  "Škotska",
  "Turska",
  "Srbija",
  "Ukrajna",
  "Danska",
  "Hrvatska",
  "Češka",
  "Izrael",
  "Poljska",
  "Azerbejdžan",
  "Norveška",
  "Grčka",
  "Bugarska",
  "Moldavija",
  "Mađarska",
  "Švedska",
  "Rumunjska",
  "Cipar",
  "Kazahstan",
  "Slovačka",
  "Slovenija",
  "Finska",
  "Bjelorusija",
  "Latvia",
  "Bosna i Hercegovina",
  "Litva",
  "Island",
  "Sjeverna Makedonija",
  "Irska",
  "Albanija",
  "Geruzija",
  "Kosovo",
  "Armenija",
  "Wales",
  "Estonija",
  "Malta",
  "Sjevrna Irska",
  "Luksemburg",
  "Farski Otoci",
  "Gibraltar",
  "Andora",
  "San Marino",
]
countries = countries.sort((a, b) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }})

countries.forEach(country=>{
  let countrySelect = document.getElementById('countrySelect')
  let countryOption = document.createElement('option')
  countryOption.innerText=country
  countryOption.setAttribute('value',country)
  countrySelect.appendChild(countryOption)
})

let teamsRanked = []
let filteredCountry = "all"
let searchedTeam = ""
fetch('../src/data/teamlist.json').then(res => res.json()).then(data=> {
  console.log(data.data)
  teamsRanked = data.data.sort((a, b) => {
  if (a.elo > b.elo) {
    return -1;
  }
  if (a.elo < b.elo) {
    return 1;
  }
  return 0;
}); ShowRanking()}).catch(err=>console.log(err))
function ShowRanking(){
  let rankingContainer = document.getElementById('rankingContainer');
  rankingContainer.innerHTML=""
  teamsRanked.forEach((team, index)=>{
    if((team.country_name==filteredCountry|| filteredCountry=="all") && (searchedTeam==""||team.name.toLowerCase().includes(searchedTeam.toLowerCase())))
  {let teamRow = document.createElement('tr');
  let rankTeam = index+1
  let rankEl = document.createElement('td');
  let rankSpan = document.createElement('span');
  rankSpan.innerText = rankTeam
  rankEl.appendChild(rankSpan)

  let teamNameEl = document.createElement('td');
  let teamNameSpan = document.createElement('span');
  teamNameSpan.innerText = team.name
  teamNameEl.appendChild(teamNameSpan)

  let eloEl = document.createElement('td')
  let eloSpan = document.createElement('span')
  eloSpan.innerText = team.elo
  eloEl.appendChild(eloSpan);

  let countryEl = document.createElement('td')
  let countrySpan = document.createElement('span')
  countrySpan.innerText = team.country_name
  countryEl.appendChild(countrySpan)

  teamRow.appendChild(rankEl)
  teamRow.appendChild(teamNameEl)
  teamRow.appendChild(eloEl)
  teamRow.appendChild(countryEl)
  rankingContainer.appendChild(teamRow)}
})}

function FilterCountry(event){
  let targetCountry = event.target.value
  filteredCountry = targetCountry
  ShowRanking()
}

function SearchTeam(){
  let targetTeam = document.getElementById('teamSearch').value
  searchedTeam = targetTeam
  ShowRanking()
}