//creating global variables that are called in different functions
var cityZip = "";
var xycords = [];

//needed to create a function to use for on click and for past search clicks
//this selecter is only on the search input
$("#searchSubmit").click(function() {
    cityZip = $("input").val();

    // this creates the past searches list, event listener to research them is added later
    $("#pastSearches").prepend("<li class='btn btn-info display-flex m  -2 pastList'>"+cityZip+"</li>")
    
    //then add a listener to the past searches buttons that calls the findWeather. i first made the mistake of having this listener separated out
    $("li.pastList").on("click", function() {
        var pastCity = $(this).text();

        // recalling the main function from the past searches element
        findWeather(pastCity);
    });

    // calling the main function to fetch the APIs
    findWeather(cityZip);
});

//this is the weather function that can get called by the search input as well as the past search buttons
function findWeather(cityZip) {
    // first fetch is used to just to get the coords for the other fetches
    fetch("https://api.openweathermap.org/geo/1.0/direct?q="+cityZip+"&limit=1&appid=397ffb68060871749257fde6bd6eeafb")
    .then(response => {
        // error checking the response
        if (!response.ok) {
            throw response;
        }
        // then returning the response in .json() format, which makes it an object
        return response.json();
    })

    // .then will take the json object and pull information from it
    .then(data => {
        for (const lat of data) {
            xycords[0] = data[0].lat;
        }
        for (const lon of data) {
            xycords[1] = data[0].lon;
        }
        // the return fetch was a big place i got hung up on, but finally found the answer online
        return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + xycords[0] + "&lon=" + xycords[1] + "&units=imperial&cnt=1&exclude=current,minutely,hourly,alert&appid=397ffb68060871749257fde6bd6eeafb");
    })
    
    // always check the response is ok, and return it in .json() format
    .then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
    })

    // with the data from the second fetch, i gather the weather data for today
    .then(data => {
        // creating a local variable for today's weather data within the object given back by the api
        var today = data.daily[0];
        /* sadly I was unable to get the UVI color changing to work but I will come back to this and try more later
        var uvi = data.uvi

            if (this.hmtl < 3){
                $(this).attr("color","green");
            }
            else if (this.html < 8){
                $(this).attr("color","yellow");
            } 
            else {
                $(this).attr("color","red");
            }
        */

        // creating a card from the data in the today object
        $('#searchResult').html(function() {
            //convert the unix time to js time
            var dt = new Date(today.dt * 1000);

            // learned this return trick from stack overflow, the function will return all this html into the #searchResult
            return `<div class="col-auto display-inline-block" id="todayResult">
                <div class="card col">
                    <h2 class="card-title p-2 text-center">${cityZip}</h2>
                    <h5 class="card-title p-2 text-center">${dt.toDateString()}</h5>
                    <div class="card-body text-center">
                        <img src="https://openweathermap.org/img/wn/${today.weather[0].icon}@4x.png"
                            class="card-img-top"
                            alt="${today.weather[0].description}"
                        />
                        <h3 class="card-title">${today.weather[0].main}</h3>
                        <p class="card-text">
                            High: ${today.temp.max}&deg;F  Low: ${today.temp.min}&deg;F
                        </p>
                        <p class="card-text">
                            Precipitation: ${today.pop * 100}%
                        </p>
                        <p class="card-text">
                            Humidity: ${today.humidity}%
                        </p>
                        <p class="card-text">
                            Wind: ${today.wind_speed}mph
                        </p>
                        <p class="card-text">
                            UV Index: ${today.uvi}
                        </p>
                    </div>
                </div>
            </div>`;
        }); 
        return data;
    })

    .then(data => {
        // need to clear the area first if there is data already there, becuase i use .append here, not .html
        $('#searchForecast').empty();

        // now creating a for loop for the different days of the forecast
        for (var i = 1; i < 6; i++) {
            var today = data.daily[i];
    
            // creating a card from the data in the today object
            $('#searchForecast').append(function() {
                //convert the unix time to js time
                var dt = new Date(today.dt * 1000); //timestamp * 1000 
                return `<div class="col display-inline-block" id="todayResult">
                    <div class="card">
                        <h5 class="card-title p-2">${dt.toDateString()}</h5>
                        <div class="card-body">
                            <img src="https://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png"
                                class="card-img-top"
                                alt="${today.weather[0].description}"
                            />
                            <h3 class="card-title">${today.weather[0].main}</h3>
                            <p class="card-text">
                                High: ${today.temp.max}&deg;F  Low: ${today.temp.min}&deg;F
                            </p>
                            <p class="card-text">
                                Humidity: ${today.humidity}%
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