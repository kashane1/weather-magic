$("#search-submit").on("click", function(e) {
    e.preventDefault;
    console.log($("#search-input").text);
});


/*
$("#past-searches").


will need to grab all lat and lon of major cities?
or find an api that can convert city names to lat and lon

function searchApi(latitude, longitude) {


weather api:

https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

397ffb68060871749257fde6bd6eeafb

https://api.openweathermap.org/data/2.5/onecall?city=chicago&appid=397ffb68060871749257fde6bd6eeafb

*/


/*
now the api for lat and long geocoding

http://api.positionstack.com/v1/forward?access_key=e68e0f710f4b23f1a060f2539a58014b&query="+cityZip+""

e68e0f710f4b23f1a060f2539a58014b

*/