var mymap = L.map('mapid').setView([41.08394699999999,  -74.176609], 15);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiYXNocmVzMTYiLCJhIjoiY2toeTZraHYyMDJ2ajJybDZ4YmMzNm9jNiJ9.XkhK85KFZMtEN_iiC0_gwQ'
}).addTo(mymap);

// create a list of lists to save the entered location,lat,long data
var searchHistory = [];
var addressElement = document.getElementById("addressBarId");
document.getElementById("errorLabelId").className = 'hidden';

$(document).ready(function() {
  if(searchHistory.length<1){
      document.getElementById("addressHeader").className = 'hidden';
  }
  $("#addBtn").click(function(){
    on_add(addressElement);
  });
  $( "#addressBarId" ).keypress(function(event) {
    if (event.keyCode === 13) {
    // 13 is Enter's key code
      event.preventDefault();
      on_add(addressElement);
    }
  });
});

const on_add = (input_address_id)=>{
  document.getElementById("errorLabelId").className = 'hidden';
  var text = input_address_id.value;
  if(text != " " && !listIncludes(text)){
    input_address_id.value = " ";
    findAddress(text);
  }
}

var listIncludes = (text)=>{
  for(let i = 0; i < searchHistory.length;i++){
    if(searchHistory[i].includes(text)){
      let lat = searchHistory[i][1], long = searchHistory[i][2];
      mymap.flyTo([ lat , long ], 15);
      return true;
    }
  }
  return false;
}

async function findAddress(text) {
  let result;
  let lat = 41.08394699999999, long = -74.176609;
  const access_token = 'pk.eyJ1IjoiYXNocmVzMTYiLCJhIjoiY2toeTZraHYyMDJ2ajJybDZ4YmMzNm9jNiJ9.XkhK85KFZMtEN_iiC0_gwQ';
  var textUrlFormat = encodeURIComponent(text);
  const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + textUrlFormat + ".json?access_token=" + access_token;
  try{
    await $.get(url, function(data){
      try{
      lat = data.features[0].center[1];
      long = data.features[0].center[0];
      mymap.flyTo([ lat, long ], 15);
      var marker = L.marker([lat,long]).addTo(mymap);
      searchHistory.push([text,lat,long]);
      generateList();
      }catch(error){
        console.log(error);
        document.getElementById("errorLabelId").className = ' ';
      }
    });
  }
  catch(error) {
    console.log(error);
  }
}

const generateList = () =>{
  var list = document.getElementById("list");
  list.innerHTML = '';
  var ul = document.createElement('ul');
  ul.setAttribute('style', 'padding: 0; margin: 0;');
  ul.setAttribute('id', 'addressList');

  for (i = 0; i <= searchHistory.length - 1; i++) {
    var li = document.createElement('li');
    var button = document.createElement('button');
    button.innerHTML = searchHistory[i][0];
    button.type="button";
    button.id = "element"+ i;
    button.class = "listClass";
    button.setAttribute("onclick", "lookupAddress(event)");
    li.appendChild(button);
    ul.appendChild(li);
  }
  list.appendChild(ul);
}

const lookupAddress = (event)=>{
  var elementID = event.srcElement.id;
  var idNumber = parseInt(elementID[elementID.length-1]);
  mymap.flyTo([searchHistory[idNumber][1], searchHistory[idNumber][2]], 15);
}
