//creating global variables
var cityZip = "";
var resultTextEl = document.createElement('p')
var resultContentEl = document.createElement('p')
var xycords = [];

//this is the url fetch function
$("#searchSubmit").click(function() {
    cityZip = $("input").val();
    xycords = getCityCoords(cityZip);
    console.log(xycords);

    //xycords = [41.8781, -87.6298];
    //start hereeeeeeeee // // //
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + xycords[0] + "&lon=" + xycords[1] + "&units=imperial&appid=397ffb68060871749257fde6bd6eeafb")
    .then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
  
        //console.log(response.json());
        return response.json();
    })

    .then((data) => {
        searchResult(data);
    })

    .then((data) => {
        searchForecast(data);
    })
    
    .catch(console.err);
});

//trying this for dealing with the response
function searchResult(response) {
    console.log(response);
    //this will create todays weather
    $('#searchResult').html(response.daily.map((day, index) => {
        //index 0 means just 1 days data
        if (index <= 0) {
            //convert the unix time to js time
            var dt = new Date(day.dt * 1000); //timestamp * 1000
            var sr = new Date(day.sunrise * 1000).toTimeString();
            var ss = new Date(day.sunset * 1000).toTimeString();

            return `<div class="col-8 display-inline-block">
                <div class="card">
                    <h5 class="card-title p-2">${dt.toDateString()}</h5>
                    <div class="card-body">
                        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
                            class="card-img-top"
                            alt="${day.weather[0].description}"
                        />
                        <h3 class="card-title">${day.weather[0].main}</h3>
                        <p class="card-text">
                            High: ${day.temp.max}&deg;F Low: ${day.temp.min}&deg;F
                        </p>
                        <p class="card-text">
                            Precipitation: ${day.pop * 100}%
                        </p>
                        <p class="card-text">
                            Wind: ${day.wind_speed}mph
                        </p>
                    </div>
                </div>
            </div>`;
        }
        })
        .join(' ')
    );
};

//defining the function for the 5day forecast
function searchForecast(response) {
    //this will create and print the 5 day forcast
    $('#searchForecast').html(response.daily.map((day, index) => {
        //index 4 means 5 days data
        if (index <= 4) {
            //convert the unix time to js time
            var dt = new Date(day.dt * 1000); //timestamp * 1000
            var sr = new Date(day.sunrise * 1000).toTimeString();
            var ss = new Date(day.sunset * 1000).toTimeString();

            return `<div class="col-2 display-inline-block">
                <div class="card">
                    <h5 class="card-title p-2">${dt.toDateString()}</h5>
                    <div class="card-body">
                        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
                            class="card-img-top"
                            alt="${day.weather[0].description}"
                        />
                        <h3 class="card-title">${day.weather[0].main}</h3>
                        <p class="card-text">
                            High: ${day.temp.max}&deg;F Low: ${day.temp.min}&deg;F
                        </p>
                        <p class="card-text">
                            Precipitation: ${day.pop * 100}%
                        </p>
                        <p class="card-text">
                            Wind: ${day.wind_speed}mph
                        </p>
                        <p class="card-text">
                            Sunrise ${sr}
                        </p>
                        <p class="card-text">
                            Sunset ${ss}
                        </p>
                    </div>
                </div>
            </div>`;
        }
        })
        .join(' ')
    );
};

//this function get the cords for each city
function getCityCoords(input) {
    //trying a new api to get latlon
    fetch("https://api.tomtom.com/search/2/structuredGeocode.json?key=3KGaX0rwxv1WUDYPM8eGAyyh01HbGcFC&countryCode=US&limit=1&municipality="+input)
    .then(function(response) {
        if (!response.ok) {
            throw response;
        }
  
        console.log(response);
        return response;        
    })

    .then(function(data) {
        searchLatLon(data);
        return xycords;
    })
    
    /*
    //start testing for all lat and lon major cities
    console.log(input);
    if (input = "chicago"){
        return [41.8781, -87.6298];
    }
    else if(input = "los angeles"){
        return xycords = [34.0522, -118.2437];
    }
    else {
        return xycords = "Sorry, this city is in the database."
    }
    */
    return xycords;
};

function searchLatLon(response) {
    var test = response.summary.map(geoBias, index) => {
        
        test[0] = geoBias.lat;
        test[1] = geoBias.lon;
    };
    console.log(test);
    /*
    xycords[0] = response.summary.geoBase.lat;
    xycords[1] = response.summary.geoBase.lon;
    return xycords;
    */
}


/*
$("#pastSearches").


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

"https://api.tomtom.com/search/2/structuredGeocode.json?key=3KGaX0rwxv1WUDYPM8eGAyyh01HbGcFC&countryCode=US&limit=1&municipality="+cityZip

ill need to use results.position for latlon

3KGaX0rwxv1WUDYPM8eGAyyh01HbGcFC

*/
