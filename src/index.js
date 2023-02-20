
let fullData = []

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

  console.log(fullData)
}