
let signInButton = document.getElementById("signInButton");

signInButton.addEventListener("click", SignIn);

let createAccountButton = document.getElementById('createAccount');
createAccountButton.addEventListener('click', RegisterForm);

let curruser = null;

// if(user != null && window.location.href!="testaccpage.html"){
//   document.getElementsByTagName('body')[0].children[0].removeChild(document.getElementById('signInContainer'));
//   console.log(user)
//   GetTeamElo(user);
//   
// }

function ShowSignForm(type){
  document.getElementById("signInBox").classList.toggle('hidden');
  document.getElementById("navbar").classList.toggle('blur-lg');
  document.getElementById("container").classList.toggle('blur-lg');
  if(type == "signup"){
    RegisterForm()
  }
}

function RegisterForm() {
  console.log("pritisnuto")
  document.getElementById('emailWrapper').classList.toggle('hidden');
  document.getElementById('passConfirmWrapper').classList.toggle('hidden');
  document.getElementById('leagueSelectWrapper').classList.toggle('hidden');
  document.getElementById('teamSelectWrapper').classList.toggle('hidden');

  if (createAccountButton.innerText == 'Create an account') {
    createAccountButton.innerText = "Already have an account? Log in";

    signInButton.innerText = "Register";
    signInButton.removeEventListener('click', SignIn);
    signInButton.addEventListener('click', SignUp);
  } else {
    createAccountButton.innerText = "Create an account";

    signInButton.innerText = "Sign in";
    signInButton.removeEventListener('click', SignUp);
    signInButton.addEventListener('click', SignIn);
  }
}

/*Somewhat gotovo*/
function SignIn() {
  let username = document.getElementById('usernameInput').value;
  let password = document.getElementById('passwordInput').value;

  database.collection("users").where("username", "==", username).where("password", "==", password).get().then((querySnapshot) => {
    if (querySnapshot.length == 0) { alert("No user found, check username and password"); };

    querySnapshot.forEach((doc) => {
      database.collection("users").doc(doc.id).get().then(doc => {
        curruser = doc.data();
        localStorage.setItem('USER', JSON.stringify(curruser));
        user = { ...curruser };
        console.log(user, curruser);
        GetTeamElo(curruser).then(elo => window.location.href = "testaccpage.html");
      });
    });

  });
}

/*Još triba posla*/
function SignUp() {
  let usernameTaken = false;

  let username = document.getElementById('usernameInput').value;
  let password = document.getElementById('passwordInput').value;
  let passConfirm = document.getElementById('passConfirmInput').value;
  let email = document.getElementById('emailInput').value;
  let team = document.getElementById('teamSelect').value.split('|');
  console.log(team)
  let league = document.getElementById('leagueSelect').value.split('|');

  database.collection("users").where("username", "==", username).get().then((querySnapshot) => {
    if (querySnapshot.length != 0) { usernameTaken = true; }
  });

  if (usernameTaken) {
    alert('USERNAME TAKEN');
  } else if (password != passConfirm) {
    alert('PASSWORDS NOT MATCHING');
  } else {
    database.collection("users").get().then((querySnapshot) => {
      database.collection("users").doc(username).set({
        username: username,
        password: password,
        email: email,
        flwLeague: league,
        favClubs: team
      });
      console.log()
      database.collection("users").doc(username).get().then(doc => {
        curruser = doc.data();
        localStorage.setItem('USER', JSON.stringify(curruser));
        user = { ...curruser };
        GetTeamElo(curruser).then(elo => window.location.href = "testaccpage.html");
      });
    });
  }
}

async function GetTeamElo(usert) {
  fetch(`http://api.clubelo.com/${usert.favClubs[0]}`, requestOptions)
    .then(response => response.text())
    .then(result => {
      let fullData = [];
      let dataRows = result.split('\n').slice(100);
      dataRows.forEach(row => {
        if (row != "") { fullData.push(row.split(',').slice(1)); }
      });
      console.log(fullData);
      localStorage.setItem("FAVTEAMELO", JSON.stringify(fullData));
      return fullData;
    })
    .catch(error => console.log('error', error));
}

fetch(`https://api.sportmonks.com/v3/my/leagues?api_token=${sportMonksToken}&include=`).then(response => response.json()).then(data => GetAllLeagues(data.data));
function GetAllLeagues(data) {
  let selectLeague = document.getElementById('leagueSelect');
  console.log(data);

  for (let i = 0; i < data.length; i++) {
    let league = data[i];
    let option = document.createElement('option');
    option.value = `${league.name}|${league.id}|${league.image_path}`;
    option.innerHTML = league.name;
    selectLeague.appendChild(option);

  }
}

GetAllTeams()
function GetAllTeams() {
  let selectTeam = document.getElementById('teamSelect');
  for (let i = 1; i < 13; i++) {
    fetch(`https://api.sportmonks.com/v3/football/teams?api_token=${sportMonksToken}&page=${i}&filters=populate&per_page=1000&include=`).then(response => response.json()).then(data => {
      let teams = data.data;
      console.log(teams)
      hasmore = data.pagination.has_more;
      nextpage = data.pagination.next_page;
      for (let i = 0; i < teams.length; i++) {
        let team = teams[i];
        console.log(team)
        let option = document.createElement('option');
        option.value = `${team.name}|${team.id}|${team.image_path}`;
        option.innerHTML = team.name;
        selectTeam.appendChild(option);
      }
    });
  }
}