//creating global variables
var cityZip = "";
var resultTextEl = document.createElement('p')
var resultContentEl = document.createElement('p')
var xycords = [];

//needed to create a function to use for on click and for past search clicks
//this selecter is only on the search input
$("#searchSubmit").click(function() {
    cityZip = $("input").val();
    console.log(xycords);

    // this creates the past searches list, event listener to research them is added later
    $("#pastSearches").prepend("<li class='btn btn-info display-flex' id='"+cityZip+"'>"+cityZip+"</li>")

    findWeather(cityZip);
});

//this is the weather function that can get called by the search input as well as the past search buttons
function findWeather(cityZip) {
    //this function get the cords for each city
    //trying a new api to get latlon
    fetch("http://api.openweathermap.org/geo/1.0/direct?q="+cityZip+"&limit=1&appid=397ffb68060871749257fde6bd6eeafb")
    .then(response => {
        // error checking the response
        if (!response.ok) {
            throw response;
        }
        return response.json();
    })

    .then(data => {
        console.log(data);
        for (const lat of data) {
            xycords[0] = data[0].lat;
        }
        for (const lon of data) {
            xycords[1] = data[0].lon;
        }
        return fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + xycords[0] + "&lon=" + xycords[1] + "&units=imperial&cnt=6&appid=397ffb68060871749257fde6bd6eeafb");
    })
    
    .then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    })

    .then(data => {
        console.log(data);

        // creating a local variable for today's weather data within the object given back by the api
        var today = data.list[0];
        console.log(today);

        // creating a card from the data in the today object
        $('#searchResult').html(function() {
            //convert the unix time to js time
            var dt = new Date(today.dt * 1000); //timestamp * 1000 

            return `<div class="col-auto display-inline-block" id="todayResult">
                <div class="card col">
                    <h2 class="card-title p-2">${data.city.name}</h2>
                    <h5 class="card-title p-2">${dt.toDateString()}</h5>
                    <div class="card-body">
                        <img src="http://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png"
                            class="card-img-top"
                            alt="${today.weather[0].description}"
                        />
                        <h3 class="card-title">${today.weather[0].main}</h3>
                        <p class="card-text">
                            High: ${today.main.temp_max}&deg;F Low: ${today.main.temp_min}&deg;F
                        </p>
                        <p class="card-text">
                            Precipitation: ${today.pop * 100}%
                        </p>
                        <p class="card-text">
                            Wind: ${today.wind.speed}mph
                        </p>
                    </div>
                </div>
            </div>`;
        });

        return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + data.city.coord.lat + "&lon=" + data.city.coord.lon + "&units=imperial&cnt=6&exclude=current,minutely,hourly,alert&appid=397ffb68060871749257fde6bd6eeafb");
    })

    .then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    })

    .then(data => {
        console.log(data);

        // need to clear the area first if there is data already there, becuase i use .append here, not .html
        $('#searchForecast').empty()    ;

        // now creating a for loop for the different days of the forecast
        for (var i = 1; i < 6; i++) {
            var today = data.daily[i];
            console.log(today);
    
            // creating a card from the data in the today object
            $('#searchForecast').append(function() {
                //convert the unix time to js time
                var dt = new Date(today.dt * 1000); //timestamp * 1000 
                return `<div class="col display-inline-block" id="todayResult">
                    <div class="card col">
                        <h5 class="card-title p-2">${dt.toDateString()}</h5>
                        <div class="card-body">
                            <img src="http://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png"
                                class="card-img-top"
                                alt="${today.weather[0].description}"
                            />
                            <h3 class="card-title">${today.weather[0].main}</h3>
                            <p class="card-text">
                                High: ${today.temp.max}&deg;F Low: ${today.temp.min}&deg;F
                            </p>
                            <p class="card-text">
                                Precipitation: ${today.pop * 100}%
                            </p>
                            <p class="card-text">
                                Wind: ${today.wind_speed}mph
                            </p>
                        </div>
                    </div>
                </div>`;
            });
        }
    })
    .catch(console.error);
};


// // // annnnddd now im stuck here for now. buttons wont listen correctly and call the weather function

//then add a listener to the past searches buttons that calls the findWeather
$("li.btn").on("click", function() {
    var cityZip = $(this).text();
    findWeather(cityZip);
});