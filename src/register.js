let signInButton = document.getElementById("signInButton");

signInButton.addEventListener("click", SignIn);

let createAccountButton = document.getElementById('createAccount');
createAccountButton.addEventListener('click', RegisterForm);

// if(user != null && window.location.href!="testaccpage.html"){
//   document.getElementsByTagName('body')[0].children[0].removeChild(document.getElementById('signInContainer'));
//   console.log(user)
//   GetTeamElo();
//   window.location.href="testaccpage.html";
// }

function RegisterForm(){
    document.getElementById('emailWrapper').classList.toggle('hidden');
    document.getElementById('passConfirmWrapper').classList.toggle('hidden');
    document.getElementById('leagueSelectWrapper').classList.toggle('hidden');
  
    if (createAccountButton.innerText == 'Create an account'){
        createAccountButton.innerText = "Already have an account? Log in";
      
       signInButton.innerText = "Register";
       signInButton.removeEventListener('click', SignIn);
       signInButton.addEventListener('click', SignUp);
    } else{
        createAccountButton.innerText = "Create an account";
  
        signInButton.innerText = "Sign in";
        signInButton.removeEventListener('click', SignUp);
        signInButton.addEventListener('click', SignIn);
    }
}

function SignIn(){
    let username = document.getElementById('usernameInput').value;
    let password = document.getElementById('passwordInput').value;
    
    database.collection("users").where("username", "==", username).where("password", "==", password).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        database.collection("users").doc(doc.id).get().then(doc => {curruser=doc.data(); localStorage.setItem('USER', JSON.stringify(curruser))})
        
        console.log(`tocna šifra`);
        document.getElementsByTagName('body')[0].children[0].removeChild(document.getElementById('signInContainer'));
        GetTeamElo();
        });
    });
}
  
function SignUp(){
    let usernameTaken = false;
  
    let username = document.getElementById('usernameInput').value;
    let password = document.getElementById('passwordInput').value;
    let passConfirm = document.getElementById('passConfirmInput').value;
    let email = document.getElementById('emailInput').value;

    let league = document.getElementById('leagueSelect').value;

    database.collection("users").where("username", "==", username).get().then((querySnapshot) => {
      if (querySnapshot.length != 0){usernameTaken = true;}
    });
  
    if (usernameTaken){
      alert('USERNAME TAKEN');
    } else if (password != passConfirm){
      alert('PASSWORDS NOT MATCHING');
    } else{
      database.collection("users").get().then((querySnapshot) => {
        database.collection("users").add({
          username: username,
          password: password,
          email: email,
          flwLeague: league
        });
        
        console.log("uspješna registracija");
        document.getElementsByTagName('body')[0].removeChild(document.getElementById('signInContainer'));
        console.log(user)
      });
    }
}


function GetTeamElo(){
  fetch(`http://api.clubelo.com/${user.favClubs[0]}`, requestOptions)
  .then(response => response.text())
  .then(result => parseEloData(result))
  .catch(error => console.log('error', error));
}

function parseEloData(data){
  let dataRows = data.split('\n').slice(100)
  dataRows.forEach(row => {
    if (row!=""){fullData.push(row.split(',').slice(1))}
  })
  localStorage.setItem("FAVTEAMELO", JSON.stringify(fullData))
  console.log(fullData);
}

fetch(`https://api.sportmonks.com/v3/my/leagues?api_token=${sportMonksToken}&include=`).then(response => response.json()).then(data => GetAllLeagues(data.data))

function GetAllLeagues(data){
  let selectLeague = document.getElementById('leagueSelect');
  console.log(data)

  for(let i = 0; i < data.length; i++){
    let league = data[i];
    let option = document.createElement('option');
    option.value =league.id;
    option.innerHTML = league.name;
    selectLeague.appendChild(option);
  }

}