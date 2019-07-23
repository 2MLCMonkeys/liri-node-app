require("dotenv").config();

var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');


var spotify = new Spotify(keys.spotify);


////////////////// GLOBAL VARIABLES ////////////////////////
var inputType = process.argv[2];
var inputSearch = process.argv;
var searchElement = "";

//loop to eliminate quotes when searching//
for (var i = 3; i < inputSearch.length; i++) {
    if (i > 3 && i < inputSearch.length) {
        searchElement = searchElement + "+" + inputSearch[i];
    }
    else {
        searchElement += inputSearch[i];
    }
}

console.log(inputType);
console.log(searchElement);

function pickSearch() {
    //picks function to run on input//
    switch (inputType) {
        case "concert-this":
            concertThis();
            break;

        case "spotify-this-song":
            spotifyThis();
            break;

        case "movie-this":
            movieThis();
            break;

        case "do-what-it-says":
            randomText();
            break;
    };
};
pickSearch();

// if (inputType !== "movie-this" || inputType !== "do-what-it-says" || inputType !== "concert-this" || inputType !== "spotify-this-song"){
//     console.log("Please select a search method: spotify-this-song, do-what-it-says, movie-this, concert-this");
// }
if (!searchElement) {
    console.log("Please enter a subject to search for");

}

////////////////////////// AXIOS - BANDS ///////////////////////////
function concertThis() {
    var queryURLbands = "https://rest.bandsintown.com/artists/" + searchElement + "/events?app_id=codingbootcamp";
    axios
    .get(queryURLbands)
    .then(function (response) {
        //console.log(response.data);
        console.log("--------------------------");
            for(var x = 0; x < response.data.length; x++){
            console.log("Venue Name: " + response.data[x].venue.name);
            console.log("Venue Location: " + response.data[x].venue.city + ", " + response.data[x].venue.region + ", " + response.data[x].venue.country)
            var dateToFormat = response.data[x].datetime;
            var date = moment(dateToFormat).format("MM/DD/YYYY");
            console.log("Date of Event: " + date);
            console.log("-----------------------------------");
            };
        })

        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        })
};

////////////////////////// AXIOS - OMDB ///////////////////////////
function movieThis() {
    var queryURLmovie = "http://www.omdbapi.com/?t=" + searchElement + "&y=&plot=short&apikey=c0ddea2a";
    axios
        .get(queryURLmovie)
        .then(function (response) {
            console.log("Movie Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("Actors: " + response.data.Actors);
            console.log("Plot: " + response.data.Plot);
            console.log("Language: " + response.data.Language);
            console.log("IMDB Rating: " + response.data.Ratings[0].Value);
            console.log("Rotteh Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
        })

        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        })
};

//////////////////////// SPOTIFY ////////////////////////////
function spotifyThis() {
    spotify.search({ type: 'track', query: searchElement}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        console.log("--------------------------");
    for(var j = 0; j < data.tracks.items.length; j++){
      console.log("Artist: " + data.tracks.items[j].artists[0].name); 
      console.log("Name of Song: " + data.tracks.items[j].name); 
      console.log("Album Name: " + data.tracks.items[j].album.name); 
      console.log("Spotify Link: " + data.tracks.items[j].external_urls.spotify); 
      console.log("------------------------------");
    };
      });

};


//////////////////////// DO WHAT IT SAYS ////////////////////
function randomText() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
        data = data.split(",");
        console.log(data);
        console.log(data[0]);
        console.log(data[1]);
        
        inputType = " ";
        searchElement = " ";

        inputType = data[0]
        searchElement = data[1]
        console.log("foo: " + inputType);
        console.log("bar: " + searchElement);
        
        switch (inputType) {
            case "concert-this":
                concertThis();
                break;
    
            case "spotify-this-song":
                spotifyThis();
                break;
    
            case "movie-this":
                movieThis();
                break;
        };

    });
};