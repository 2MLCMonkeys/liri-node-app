# LIRI NODE APPLICATION 

*https://drive.google.com/file/d/1KJJmS6YtsTdwkP3w2PY6a8EwmEPBKsv0/view?usp=sharing
(Video of Working Application)

## Description
Liri application is a program run through command line incorperating Node.js. Liri takes in set parameters and returns data about the input. Every researched input is logged in a file. Runs in command terminal, will need your own keys to use on local device in a dotenv file. On run will prompt for a command, every word after command is the search parameters for the API requests sent out. Commands will cycle through and pick correct function to follow. Returned information will then be displayed on command line. Continues through prompt until exit is intialized. 

### Modules
- node-spotify-api
- dotenv
- axios
- moment
- inquirer
- colors

#### Commands Used 
- "spotify-this-song"/"spotify": Research song name and returns 5 variations of song name information including artist's name, name of song, album containing song, and link to spotify
- "concert-this"/"concert": Research artists and returns 5 relative up and coming venues for researched artist information incluing name of the venue, location of the venue (city, region, & country), the date of the event 
- "movie-this"/"movie": Research a movie title and returns most relevant movie to researched title information including movie title, year originally released, IMDB rating, Rotten Tomatoes rating, country produced in, langauage film is in, plot, and actors
- "do-what-it-says"/"random": reads relevant text file and processes through correct function to return information on text file search
- "return-log"/"log": Will return the entire log history of liri application 
- "exit"/"e": will exit inquirer loop in command line



# LIRI Bot (Instructions)

### Overview

In this assignment, you will make LIRI. LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.
