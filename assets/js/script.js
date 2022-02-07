//creating global variables
var cityZip = "";
var resultTextEl = document.createElement('p')
var resultContentEl = document.createElement('p')
var xycords = [];

//this is the url fetch function
$("#searchSubmit").click(function() {
    cityZip = $("input").val();
    console.log(xycords);
    
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
        $.each(data.list[0], function() {
            console.log($("dt"));
        });

    })


    .catch(console.error);

});

/*
function getTodayWeather(xycords) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + xycords[0] + "&lon=" + xycords[1] + "&units=imperial&appid=397ffb68060871749257fde6bd6eeafb")
    //https://api.openweathermap.org/data/2.5/onecall?lat=" + xycords[0] + "&lon=" + xycords[1] + "&units=imperial&appid=397ffb68060871749257fde6bd6eeafb")
    .then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    })

    .then((data) => {
        var i = 0;
        for(var i = 0; i < data.length; i++) {
            $('#searchResult').html(data.daily.map(function() {
                var dt = new Date(day.dt * 1000); //timestamp * 1000
        
            //yeah this didnt work....
            $('#searchResult').append("<div class='col-2 display-inline-block'><div class='card'><h5 class='card-title p-2'>${dt.toDateString()}</h5><div class='card-body'><img src='http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png'class='card-img-top'alt='${day.weather[0].description}'/><h3 class='card-title'>${day.weather[0].main}</h3><p class='card-text'>High: ${day.temp.max}&deg;F Low: ${day.temp.min}&deg;F</p><p class='card-text'>Precipitation: ${day.pop * 100}%</p><p class='card-text'>Wind: ${day.wind_speed}mph</p></div></div></div>");
            }));
        }
    })
    
    .catch(console.error);
}



//start hereeeeeeeee // // // // trying to combine both prints into one api call


//trying this for dealing with the response
function createResult(response) {
    console.log(response);
    
    //this will create todays weather
    // not working correctly. need to try a different loop
    /*
    $('#searchResult').html(response.daily.map((day, index) => {
        //index 0 means just 1 days data
        if (index <= 4) {
            //convert the unix time to js time
            var dt = new Date(day.dt * 1000); //timestamp * 1000  // needs a variable for day.dt

            return `<div class="col-2 display-inline-block">
                <div class="card">
                    <h5 class="card-title p-2">${dt.toDateString()}</h5>
                    <div class="card-body">
                        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"    // needs a variable for day.weather[0].icon
                            class="card-img-top"
                            alt="${day.weather[0].description}"    // needs a variable for day.weather[0].description
                        />
                        <h3 class="card-title">${day.weather[0].main}</h3>    // needs a variable for day.weather[0].main
                        <p class="card-text">
                            High: ${day.temp.max}&deg;F Low: ${day.temp.min}&deg;F    // needss 2 variables day.temp.max and day.temp.min
                        </p>
                        <p class="card-text">
                            Precipitation: ${day.pop * 100}%     // needs a variable for day.weather[0].main
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
    
        
    console.log(response);
    //this will create and print the 5 day forcast
    $('#searchForecast').html(response.daily.map((day, index) => {
        //index 4 means 5 days data
        if (index <= 4) {
            //convert the unix time to js time 
            var dt = new Date(day.dt * 1000); //timestamp * 1000

            return `<div class="col-3 display-inline-block">
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
/*
function getForecastWeather(xycords) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + xycords[0] + "&lon=" + xycords[1] + "&units=imperial&appid=397ffb68060871749257fde6bd6eeafb")
    .then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    })

    .then((response) => {
        createForecast(response);
    })
    
    .catch(console.error);
}

//defining the function for the 5day forecast
function createForecast(response) {
    //this will create and print the 5 day forcast
    $('#searchForecast').html(response.daily.map((day, index) => {
        //index 4 means 5 days data
        if (index <= 4) {
            //convert the unix time to js time 
            var dt = new Date(day.dt * 1000); //timestamp * 1000

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
                    </div>
                </div>
            </div>`;
        }
        })
        .join(' ')
    );
};
*/