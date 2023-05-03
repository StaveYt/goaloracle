let signInButton = document.getElementById("signInButton");

let createAccountButton = document.getElementById("createAccount");

let curruser = null;

function OnLoadRegister() {
  signInButton.addEventListener("click", SignIn);
  createAccountButton.addEventListener("click", RegisterForm);
  fetch(`../src/data/leaguelist.json`)
    .then((response) => response.json())
    .then((data) => GetAllLeagues(data.data));
  CreateTeamSelect();
}

/*Dodaje sve timove u izbornik za timove na formi za registriranje*/
async function CreateTeamSelect() {
  let allTeams = [];
  let selectTeam = document.getElementById("teamSelect");
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

/*Dodaje sve lige u izbornik za lige na formi za registriranje*/
function GetAllLeagues(data) {
  let selectLeague = document.getElementById("leagueSelect");
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

/*Prikazuje formu za registraciju/ulogrianje*/
function ShowSignForm(type) {
  document.getElementById("signInBox").classList.toggle("hidden");
  document.getElementById("navbarlg").classList.toggle("blur-lg");
  document.getElementById("navbarmd").classList.toggle("blur-lg");
  document.getElementById("container").classList.toggle("blur-lg");
  if (type == "signup") {
    RegisterForm();
  }
}

/*Minja između forme za registraciju i forme za ulogiranje*/
function RegisterForm() {
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

/*Upravlja registracijom korisnika*/
function SignIn() {
  let username = document.getElementById("usernameInput").value;
  let password = document.getElementById("passwordInput").value;
  database
    .collection("users")
    .where("username", "==", username)
    .where("password", "==", password)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.length == 0) {
        alert(
          "Korisnik nije pronađen, molimo Vas provjerite šifru i korisničko ime"
        );
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

            window.location.href = "accpage.html";
          });
      });
    });
}

/*Upravlja ulogrianjem korisnika*/
function SignUp() {
  let usernameTaken = false;

  let username = document.getElementById("usernameInput").value;
  let password = document.getElementById("passwordInput").value;
  let passConfirm = document.getElementById("passConfirmInput").value;
  let email = document.getElementById("emailInput").value;
  let team = document.getElementById("teamSelect").value.split("|");
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

            window.location.href = "accpage.html";
          });
      });
  }
}
