let signInButton = document.getElementById("signInButton");

signInButton.addEventListener("click", SignIn);

let createAccountButton = document.getElementById("createAccount");
createAccountButton.addEventListener("click", RegisterForm);

let curruser = null;

function ShowSignForm(type) {
  document.getElementById("signInBox").classList.toggle("hidden");
  document.getElementById("navbarlg").classList.toggle("blur-lg");
  document.getElementById("navbarmd").classList.toggle("blur-lg");
  document.getElementById("container").classList.toggle("blur-lg");
  if (type == "signup") {
    RegisterForm();
  }
}

function RegisterForm() {
  console.log("pritisnuto");
  document.getElementById("emailWrapper").classList.toggle("hidden");
  document.getElementById("passConfirmWrapper").classList.toggle("hidden");
  document.getElementById("leagueSelectWrapper").classList.toggle("hidden");
  document.getElementById("teamSelectWrapper").classList.toggle("hidden");

  if (createAccountButton.innerText == "Napravite račun") {
    createAccountButton.innerText = "Već imate račun? Ulogirajte se";

    signInButton.innerText = "Registrirajte se";
    signInButton.removeEventListener("click", SignIn);
    signInButton.addEventListener("click", SignUp);
  } else {
    createAccountButton.innerText = "Napravite račun";

    signInButton.innerText = "Ulogirajte se";
    signInButton.removeEventListener("click", SignUp);
    signInButton.addEventListener("click", SignIn);
  }
}

function SignIn() {
  let username = document.getElementById("usernameInput").value;
  let password = document.getElementById("passwordInput").value;
  console.log("pritisnuto")
  database
    .collection("users")
    .where("username", "==", username)
    .where("password", "==", password)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.length == 0) {
        alert("Korisnik nije pronađen, molimo Vas provjerite šifru i korisničko ime");
      }
      querySnapshot.forEach((doc) => {
        database
          .collection("users")
          .doc(doc.id)
          .get()
          .then((doc) => {
            curruser = doc.data();
            localStorage.setItem("USER", JSON.stringify(curruser));
            user = {
              ...curruser,
            };
            console.log(user, curruser);
            window.location.href = "accpage.html"
          });
      });
    });
}

function SignUp() {
  let usernameTaken = false;

  let username = document.getElementById("usernameInput").value;
  let password = document.getElementById("passwordInput").value;
  let passConfirm = document.getElementById("passConfirmInput").value;
  let email = document.getElementById("emailInput").value;
  let team = document.getElementById("teamSelect").value.split("|");
  console.log(team);
  let league = document.getElementById("leagueSelect").value.split("|");

  database
    .collection("users")
    .where("username", "==", username)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.length != 0) {
        usernameTaken = true;
      }
    });

  if (usernameTaken) {
    alert("Ime iskorišteno");
  } else if (password != passConfirm) {
    alert("Šifre se ne podudaraju");
  } else {
    console.log("test")
    database
      .collection("users")
      .get()
      .then((querySnapshot) => {
        database.collection("users").doc(username).set({
          username: username,
          password: password,
          email: email,
          flwLeague: league,
          favClubs: team,
        });
        database
          .collection("users")
          .doc(username)
          .get()
          .then((doc) => {
            curruser = doc.data();
            localStorage.setItem("USER", JSON.stringify(curruser));
            user = {
              ...curruser,
            };
            localStorage.setItem("FAVTEAMELO", JSON.stringify(team[3]));
            console.log("gotovo")
            window.location.href = "accpage.html";
          });
      });
  }
}

fetch(
  `../src/data/leaguelist.json`
)
  .then((response) => response.json())
  .then((data) => GetAllLeagues(data.data));
function GetAllLeagues(data) {
  let selectLeague = document.getElementById("leagueSelect");
  console.log(data);
  data = data.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  for (let i = 0; i < data.length; i = i + 1) {
    let league = data[i];
    
    let option = document.createElement("option");
    option.value = `${league.name}|${league.id}|${league.image_path}`;
    option.innerHTML = league.name;
    selectLeague.appendChild(option);
  }
}

CreateTeamSelect();
async function CreateTeamSelect() {
  let allTeams = [];
  let selectTeam = document.getElementById("teamSelect");
  for (let i = 1; i < 13; i = i + 1) {
    await fetch(`../src/data/teamlist.json`)
      .then((response) => response.json())
      .then((data) => {
        let teams = data.data;
        teams = teams.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        allTeams.push(teams);
        for (let i = 0; i < teams.length; i = i + 1) {
          let team = teams[i];
          let option = document.createElement("option");
          option.value = `${team.name}|${team.id}|${team.image_path}|${team.elo}`;
          option.innerHTML = team.name;
          selectTeam.appendChild(option);
        }
      });
  }
}
