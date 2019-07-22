require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require('axios');


var spotify = new Spotify(keys.spotify);


////////////////// GLOBAL VARIABLES ////////////////////////
var inputType = process.argv[2];
var inputSearch = process.argv;
var searchElement = "";
//loop to eliminate quotes when searching//
for(var i = 3; i < inputSearch.length; i++){
    if(i > 3 && i < inputSearch.length){
        searchElement = searchElement + "+" + inputSearch[i];
    }
    else{
        searchElement += inputSearch[i];
    }
}

console.log(inputType);
console.log(inputSearch);
console.log(searchElement);


if (inputType === "concert-this"){
    console.log("run-concert")
    concertThis();
}
if (inputType === "spotify-this-song"){
    console.log("run-spotify");
    spotifyThis();
}
if (inputType === "movie-this"){
    console.log("run-movie");
    movieThis();
}
if (inputType === "do-what-it-says"){
    console.log("run-text");
    randomText();
}
// else{
//     prompt("Not a search parameter");
// }

////////////////////////// AXIOS - BANDS ///////////////////////////
function concertThis(){
    var queryURLbands = "https://rest.bandsintown.com/artists/" + searchElement + "/events?app_id=codingbootcamp";
axios
    .get(queryURLbands)
    .then(function (response) {
        console.log(response.data);
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
function movieThis(){
    var queryURLmovie = "http://www.omdbapi.com/?t=" + searchElement + "&y=&plot=short&apikey=c0ddea2a";
axios
    .get(queryURLmovie)
    .then(function (response) {
        console.log(response.data);
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