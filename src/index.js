let fullData = [];

var requestOptions = {
  method: 'GET',
  redirect: 'follow',
};

fetch("http://api.clubelo.com/Hajduk", requestOptions)
  .then(response => response.text())
  .then(result => parseData(result))
  .catch(error => console.log('error', error));

function parseData(data){
  let dataRows = data.split('\n').slice(100)
  dataRows.forEach(row => {
    if (row!=""){fullData.push(row.split(',').slice(1))}
  })

  console.log(fullData);
}

const firebaseConfig = {
  apiKey: "AIzaSyC53RtA4CcnEAzVIpNJq0jCoUkGSD8Uwtw",
  authDomain: "editnogonet.firebaseapp.com",
  databaseURL: "https://editnogonet-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "editnogonet",
  storageBucket: "editnogonet.appspot.com",
  messagingSenderId: "411313607141",
  appId: "1:411313607141:web:eca032267a53c7198c1f0c",
  measurementId: "G-N51E01Y79Y"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
let database = app.firestore();

let signInButton = document.getElementById("signInButton");

signInButton.addEventListener("click", SignIn);

let createAccountButton = document.getElementById('createAccount');
createAccountButton.addEventListener('click', ChangeToSignUp);

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`)

function ChangeToSignUp(){

  let emailWrapper = document.getElementById('emailWrapper')
  emailWrapper.classList.toggle('hidden');

  let passConfirmWrapper = document.getElementById('passConfirmWrapper')
  passConfirmWrapper.classList.toggle('hidden');

  createAccountButton.removeEventListener('click', ChangeToSignUp)
  createAccountButton.addEventListener('click', ChangeToSignIn)
  createAccountButton.innerText = "Already have an account? Log in";

 signInButton.innerText = "Register";
 signInButton.removeEventListener('click', SignIn);
 signInButton.addEventListener('click', SignUp);
}

function ChangeToSignIn(){
  let signInContainer = document.getElementById('signInContainer');

  let emailWrapper = document.getElementById('emailWrapper')
  emailWrapper.classList.toggle('hidden');

  let passConfirmWrapper = document.getElementById('passConfirmWrapper')
  passConfirmWrapper.classList.toggle('hidden');

  createAccountButton.removeEventListener('click', ChangeToSignIn);
  createAccountButton.addEventListener('click', ChangeToSignUp);
  createAccountButton.innerText = "Create an account";

  signInButton.innerText = "Sign in";
  signInButton.removeEventListener('click', SignUp);
  signInButton.addEventListener('click', SignIn);
}

function SignIn(){
  let username = document.getElementById('usernameInput').value;
  let password = document.getElementById('passwordInput').value;
  
  database.collection("users").where("username", "==", username).where("password", "==", password).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {

      console.log(`tocna šifra`);
      document.getElementsByTagName('body')[0].removeChild(document.getElementById('signInContainer'))
      });
  });
}

function SignUp(){
  let usernameTaken = false;

  let username = document.getElementById('usernameInput').value;
  let password = document.getElementById('passwordInput').value;
  let passConfirm = document.getElementById('passConfirmInput').value;
  let email = document.getElementById('emailInput').value;

  database.collection("users").where("username", "==", username).get().then((querySnapshot) => {
    if (querySnapshot.length != 0){usernameTaken = true}
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
      })
      
      console.log("uspješna registracija");
      document.getElementsByTagName('body')[0].removeChild(document.getElementById('signInContainer'));
    });
  }
}