let fullData = [];
let user = localStorage.getItem('USER') !== null ? JSON.parse(localStorage.getItem('USER')) : nul;

const requestOptions = {
  method: 'GET',
  redirect: 'follow',
};

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

const sportMonksToken = 'WRQ2rljTRFJABZamseStggeOoiP1GMzvBCqMw7Ox6jq2LrPKUGdZqKOpRjod';

const app = firebase.initializeApp(firebaseConfig);
let database = app.firestore();

function LoadInfo(){
  let teamPic = user.favClubs[2];
  let teamName = user.favClubs[1];
  let username = user.username;
  let teamElo = JSON.parse(localStorage.getItem('FAVTEAMELO'));
  teamElo = teamElo[teamElo.length-1]
  document.getElementById('teamPic').setAttribute('src', teamPic);
  document.getElementById('teamelo').innerHTML = teamElo[3];
  document.getElementById('username').innerText = username;
}