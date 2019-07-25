require("dotenv").config();

var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var inquirer = require('inquirer');
var colors = require('colors/safe')


var spotify = new Spotify(keys.spotify);
var omdb = (keys.omdb.key);
var bands = (keys.bands.id);
var logType = " ";
var searchElement = " ";

function inputLine() {
    inquirer.prompt([
        {
            type: "input",
            name: "input",
            message: 'Input a command:'
        }
    ]).then(function (result) {
        let input = result.input.split(" "); // This puts the input into an array
        let command = input[0].toLowerCase(); // This is the command that is recognized by the IF hydra below
        var searchElement = input.slice(1).join(" "); // These are the terms that you can use to search with your functions. They are everything after the command

        if (command === "spotify-this-song" || command === "spotify" || command === "s") {
            spotifyThis(searchElement); // Be sure to call the "inputLine()" function at the end of this function
            //logRequest(result.input); // This takes in the raw input if it is a valid command and logs it to the txt file
        }
        else if (command === "concert-this" || command === "concert" || command === "c") {
            concertThis(searchElement); // Be sure to call the "inputLine()" function at the end of this function
            //logRequest(result.input); // This takes in the raw input if it is a valid command and logs it to the txt file
        }
        else if (command === "movie-this" || command === "movie" || command === "m") {
            movieThis(searchElement); // Be sure to call the "inputLine()" function at the end of this function
            //logRequest(result.input); // This takes in the raw input if it is a valid command and logs it to the txt file
        }
        else if (command === "do-what-it-says" || command === "random" || command === "dwis" || command === "r") {
            randomThis(); // Be sure to call the "inputLine()" function at the end of this function
        }
        else if (command === "return-log" || command === "log" || command === "l") {
            returnThis(); // Be sure to call the "inputLine()" function at the end of this function
        }
        else if (command === "exit" || command === "e") {
            console.log("out");// Be sure to call the "inputLine()" function at the end of this function
        }
        else {
            console.log("Command not recognized!");
            inputLine();
        }
    });
}



////////////////////////// AXIOS - BANDS ///////////////////////////
function concertThis(searchElement) {
    console.log("function: " + searchElement);
    //displays user inputs//
    logType = "concert-this";
    console.log(colors.magenta("Type of Inquiry: " + logType));
    console.log(colors.magenta("Searching For: " + searchElement));
    //sends request
    var queryURLbands = "https://rest.bandsintown.com/artists/" + searchElement + "/events?app_id=" + bands;
    axios
        .get(queryURLbands)
        .then(function (response) {
            //returns data//
            console.log(colors.blue("-----------------------------------"));
            //loops through returned objects and displays data//
            for (var x = 0; x < 5; x++) {
                console.log(colors.cyan("Venue Name: ") + response.data[x].venue.name);
                console.log(colors.cyan("Venue Location: ") + response.data[x].venue.city + ", " + response.data[x].venue.region + ", " + response.data[x].venue.country)
                var dateToFormat = response.data[x].datetime;
                var date = moment(dateToFormat).format("MM/DD/YYYY");
                console.log(colors.cyan("Date of Event: ") + date);
                console.log(colors.blue("-----------------------------------"));
            };
            //logs user input in separate file//
            logRequest(logType, searchElement);
        })
        //catches errors and displays if there is one//
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
function movieThis(searchElement) {
    //displays user inputs//
    logType = "movie-this";
    console.log(colors.magenta("Type of Inquiry: " + logType));
    console.log(colors.magenta("Searching For: " + searchElement));
    //sends request for user
    var queryURLmovie = "http://www.omdbapi.com/?t=" + searchElement + "&y=&plot=short&apikey=" + omdb;
    axios
    .get(queryURLmovie)
    .then(function (response) {
        //displays returned data//
        console.log(colors.blue("-----------------------------------"));
        console.log(colors.cyan("Movie Title: " )+ response.data.Title);
        console.log(colors.cyan("Release Year: ") + response.data.Year);
        console.log(colors.cyan("Actors: ") + response.data.Actors);
        console.log(colors.cyan("Plot: ") + response.data.Plot);
        console.log(colors.cyan("Language: ") + response.data.Language);
        console.log(colors.cyan("IMDB Rating: ") + response.data.Ratings[0].Value);
        console.log(colors.cyan("Rotteh Tomatoes Rating: ") + response.data.Ratings[1].Value);
        console.log(colors.cyan("Country: ") + response.data.Country);
        console.log(colors.blue("-----------------------------------"));
        //logs user input in separate file//
            logRequest(logType, searchElement);
        })
        //displays error if one occurs//
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
function spotifyThis(searchElement) {
    //displays user inputs//
    logType = "spotify-this-song";
    console.log(colors.magenta("Type of Inquiry: " + logType));
    console.log(colors.magenta("Searching For: " + searchElement));
    //sends request from user input//
    spotify.search({ type: 'track', query: searchElement, limit: 5 }, function (err, data) {
        //catches error if any and displays//
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        //displays returned data and loops through the entire returned results//
        console.log(colors.blue("-----------------------------------"));
        for (var j = 0; j < data.tracks.items.length; j++) {
            console.log(colors.cyan("Artist: " )+ data.tracks.items[j].artists[0].name);
            console.log(colors.cyan("Name of Song: ") + data.tracks.items[j].name);
            console.log(colors.cyan("Album Name: ") + data.tracks.items[j].album.name);
            console.log(colors.cyan("Spotify Link: ") + data.tracks.items[j].external_urls.spotify);
            console.log(colors.blue("-----------------------------------"));
        };
        //logs user input in separate file//
        logRequest(logType, searchElement);
    });
};


//////////////////////// DO WHAT IT SAYS ////////////////////
function randomThis() {
    //reads random.txt file//
    fs.readFile("random.txt", "utf8", function (err, data) {
        //displays error if any when reading file//
        if (err) {
            return console.log(err);
        }
        data = data.split(",");
        searchElement = data[1];
        spotifyThis(searchElement);
    });
};

///////////////////////// LOGS ENTRY ///////////////////////
function logRequest(logType, searchElement) {
    //displays logged user input that went to log.txt file//
    console.log("Logged: " + logType + ", " + searchElement);
    //appends user input to log.txt file//
    fs.appendFile("log.txt", logType + ", " + searchElement + "\n", function (err) {
        //returns and displays an error if one is found//
        if (err) {
            console.log(err);
        }
    });
    inputLine();
};

////////////////////////////// RETURN LOG ////////////////////////
function returnThis() {
    //reads log.txt file//
    fs.readFile("log.txt", "utf8", function (error, data) {
        //returns and displays an error if one is found//
        if (error) {
            return console.log(error);
        }
        //prints out entire log.txt file for user//
        console.log(data);
    })
    inputLine();
};

 inputLine();
