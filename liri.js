//Node Modules//
require("dotenv").config();

var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var inquirer = require('inquirer');
var colors = require('colors/safe')

//global variables//
var spotify = new Spotify(keys.spotify);
var omdb = (keys.omdb.key);
var bands = (keys.bands.id);
let logType = " ";
let searchElement = " ";

//inquirer prompt function in command line//
function inputLine() {
    inquirer.prompt([
        {
            type: "input",
            name: "input",
            message: 'Input a command:'
        }
    ]).then(function (result) {
        //grabs the inputs and deciphers command used and the searchElement which goes throught the functions into the api search//
        let input = result.input.split(" "); 
        let command = input[0].toLowerCase(); 
        searchElement = input.slice(1).join(" "); 

        //deciphers command//
        if (command === "spotify-this-song" || command === "spotify" || command === "s") {
            spotifyThis(searchElement); 
        }
        else if (command === "concert-this" || command === "concert" || command === "c") {
            concertThis(searchElement);
        }
        else if (command === "movie-this" || command === "movie" || command === "m") {
            movieThis(searchElement);
        }
        else if (command === "do-what-it-says" || command === "random" || command === "dwis" || command === "r") {
            randomThis(); 
        }
        else if (command === "return-log" || command === "log" || command === "l") {
            returnThis(); 
        }
        else if (command === "exit" || command === "e") {
            console.log("out");
        }
        else {
            console.log("Command not recognized!");
            inputLine();
        }
    });
}



////////////////////////// AXIOS - BANDS ///////////////////////////
function concertThis(searchElement) {

    //displays user inputs and labels which function it went through//
    logType = "concert-this";
    console.log(colors.magenta("Type of Inquiry: " + logType));
    console.log(colors.magenta("Searching For: " + searchElement));

    //sends api request//
    var queryURLbands = "https://rest.bandsintown.com/artists/" + searchElement + "/events?app_id=" + bands;
    axios
        .get(queryURLbands)
        .then(function (response) {
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
            logRequest(logType, searchElement);
        })
};

////////////////////////// AXIOS - OMDB ///////////////////////////
function movieThis(searchElement) {

    //displays user inputs and labels which function it went through//
    logType = "movie-this";
    console.log(colors.magenta("Type of Inquiry: " + logType));
    console.log(colors.magenta("Searching For: " + searchElement));

    //sends api request//
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
            logRequest(logType, searchElement);
        })

};

//////////////////////// SPOTIFY ////////////////////////////
function spotifyThis(searchElement) {

    //displays user inputs and labels which function it went through//
    logType = "spotify-this-song";
    console.log(colors.magenta("Type of Inquiry: " + logType));
    console.log(colors.magenta("Searching For: " + searchElement));

    //sends api request//
    spotify.search({ type: 'track', query: searchElement, limit: 5 }, function (err, data) {

        //displays error if one occurs//
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
        //splits data and grabs second element//
        data = data.split(",");
        searchElement = data[1];

        //sends to spotifyThis function//
        spotifyThis(searchElement);
    });
};

///////////////////////// LOGS ENTRY ///////////////////////
function logRequest(logType, searchElement) {
    //displays logged user input that went to log.txt file//
    console.log(colors.gray("Logged: " + logType + ", " + searchElement));

    //appends user input to log.txt file//
    fs.appendFile("log.txt", logType + ", " + searchElement + "\n", function (err) {

        //returns and displays an error if one is found//
        if (err) {
            console.log(err);
        }
    });
    //runs inquirer prompt//
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
        inputLine();
    });
    //runs inquirer prompt//
};

//runs inquirer prompt to intialize app//
inputLine();
