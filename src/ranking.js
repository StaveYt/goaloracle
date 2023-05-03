let countries;

let teamsRanked = [];
let filteredCountry = "all";
let searchedTeam = "";

async function OnLoadRanking(){
  /*Dobivamo sve države za čije timove imamo elo i sortiramo ih po njihovom nazivu i dodavamo u izbornik*/
  await fetch('../src/data/countrylist.json').then(res=>res.json()).then((data)=>countries=data.data)
  countries = countries.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
  });
  countries.forEach((country) => {
    let countrySelect = document.getElementById("countrySelect");
    let countryOption = document.createElement("option");
    countryOption.innerText = country;
    countryOption.setAttribute("value", country);
    countrySelect.appendChild(countryOption);
  });
  
  /*Dobivamo sve timove za čije imamo ELO te ih sortiramo po njihovom ELOu i prikazujemo*/
  fetch("../src/data/teamlist.json")
  .then((res) => res.json())
  .then((data) => {
    teamsRanked = data.data.sort((a, b) => {
      if (a.elo > b.elo) {
        return -1;
      }
      if (a.elo < b.elo) {
        return 1;
      }
      return 0;
    });
    ShowRanking();
  })
  .catch((err) => console.log(err));
}

/*Prikazuje ljestvicu*/
function ShowRanking() {
  let rankingContainer = document.getElementById("rankingContainer");
  rankingContainer.innerHTML = "";

  /*Dodava timove u tablicu ako imaju točnu državu i imaju ime koje je korisnik pretražio*/
  teamsRanked.forEach((team, index) => {
    if (
      (team.country_name == filteredCountry || filteredCountry == "all") &&
      (searchedTeam == "" ||
        team.name.toLowerCase().includes(searchedTeam.toLowerCase()))
    ) {
      let teamRow = document.createElement("tr");
      let rankTeam = index + 1;
      let rankEl = document.createElement("td");
      let rankSpan = document.createElement("span");

      /*Dodaje rank tima*/
      rankSpan.innerText = rankTeam;
      rankEl.appendChild(rankSpan);

      /*Dodaje ime tima*/
      let teamNameEl = document.createElement("td");
      let teamNameSpan = document.createElement("span");
      teamNameSpan.innerText = team.name;
      teamNameEl.appendChild(teamNameSpan);

      /*Dodaje Elo tima*/
      let eloEl = document.createElement("td");
      let eloSpan = document.createElement("span");
      eloSpan.innerText = team.elo;
      eloEl.appendChild(eloSpan);

      /*Dodaje državu tima*/
      let countryEl = document.createElement("td");
      let countrySpan = document.createElement("span");
      countrySpan.innerText = team.country_name;
      countryEl.appendChild(countrySpan);

      AppendChildren(teamRow, [rankEl,teamNameEl,eloEl,countryEl]);
      rankingContainer.appendChild(teamRow);
    }
  });
}

/*Upravlja filtracijom timova kroz države*/
function FilterCountry(event) {
  let targetCountry = event.target.value;
  filteredCountry = targetCountry;
  ShowRanking();
}

/*Upravlja filtracijom timova pretraživanjem*/
function SearchTeam() {
  let targetTeam = document.getElementById("teamSearch").value;
  searchedTeam = targetTeam;
  ShowRanking();
}