require("dotenv").config();

var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require('axios');


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
            console.log("Venue Name: " + response.data[0].venue.name);
            console.log("Venue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region + ", " + response.data[0].venue.country)
            console.log("Date of Event: " + response.data[0].datetime);
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
    spotify.search({ type: 'track', query: searchElement, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

      console.log("Artist: " + data.tracks.items[0].artists[0].name); 
      console.log("Name of Song: " + data.tracks.items[0].name); 
      console.log("Album Name: " + data.tracks.items[0].album.name); 
      console.log("Spotify Link: " + data.tracks.items[0].external_urls.spotify); 
      });

};


//////////////////////// DO WHAT IT SAYS ////////////////////
function randomText() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }



        data = JSON.stringify(data);
        data = data.split(",")
        console.log(data);
        console.log(data[0]);
        console.log(data[1]);


        inputType = data[0].replace('"', "\n");
        inputSearch = data[1].replace('"', "\n");


        console.log(inputType);
        console.log("foo");
        console.log(inputSearch);
        spotifyThis();

    });
};