require("dotenv").config();
var fs = require('fs');
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
const axios = require('axios');

function findConcert(artist) {
    var concertInfo = [];
    var bandQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(bandQueryURL).then(function (response) {
        if (response.data.length === 0) {
            return console.log("Couldn't find any concerts!");
        } else {
            const event = response.data[0];

            const performer = event.artist.name;
            console.log("Artist: " + performer);
            concertInfo.push("\nArtist: " + performer);

            const venueName = event.venue.name;
            console.log("Venue Name: " + venueName);
            concertInfo.push("\nVenue Name: " + venueName);

            const venueLocation = event.venue.city + "," + event.venue.country;
            console.log("Venue Location: " + venueLocation);
            concertInfo.push("\nVenue Location: " + venueLocation);

            const eventDate = moment(event.datetime).format("MM/DD/YYYY");
            console.log("Event Date: " + eventDate);
            concertInfo.push("\nEvent Date: " + eventDate);

            concertInfo = concertInfo.join().replace(/,/g, " ")

            fs.appendFileSync("log.txt", "\nCONCERT INFO:" + concertInfo + "\n", "utf8");
            console.log("-------------------------");
            console.log("Results Saved to log.txt");
            console.log("-------------------------");
        }
    })
        .catch(function (error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

function findSong(song) {
    var songInfo = [];
    spotify
        .search({ type: 'track', query: song, limit: 1 })
        .then(function (response) {
            const songResult = response.tracks.items[0];

            const musician = songResult.artists[0].name;
            console.log("Artists: " + musician);
            songInfo.push("\nArtists: " + musician);

            const trackTitle = songResult.name;
            console.log("Track: " + trackTitle);
            songInfo.push("\nTrack: " + trackTitle);

            const albumName = songResult.album.name;
            console.log("Album: " + albumName);
            songInfo.push("\nAlbum: " + albumName);

            const songLink = songResult.preview_url;
            console.log("Preview Link to Song: " + songLink);
            songInfo.push("\nPreview Link to Song: " + songLink);

            songInfo = songInfo.join().replace(/,/g, " ");

            fs.appendFileSync("log.txt", "\nSONG INFO:" + songInfo + "\n", "utf8");
            console.log("-------------------------");
            console.log("Results Saved to log.txt");
            console.log("-------------------------");
        })
        .catch(function (err) {
            console.log(err);
        });
}

function findMovie(movieName) {
    var movieInfo = [];
    ;
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(
        function (response) {
            const movieTitle = response.data.Title;
            console.log("Movie Title: " + movieTitle);
            movieInfo.push("\nMovie Title: " + movieTitle);

            const releaseYear = response.data.Year;
            console.log("Release Year: " + releaseYear);
            movieInfo.push("\nRelease Year: " + releaseYear);

            const country = response.data.Country;
            console.log("Country: " + country);
            movieInfo.push("\nCountry: " + country);

            const lang = response.data.Language;
            console.log("Language(s): " + lang);
            movieInfo.push("\nLanguage(s): " + lang);

            const plot = response.data.Plot;
            console.log("Plot: " + plot);
            movieInfo.push("\nPlot: " + plot);

            const actors = response.data.Actors
            console.log("Actors: " + actors);
            movieInfo.push("\nActors: " + actors);

            movieInfo = movieInfo.join().replace(/,/g, " ")

            fs.appendFileSync("log.txt", "\nMOVIE INFO:" + movieInfo + "\n", "utf8");
            console.log("-------------------------");
            console.log("Results Saved to log.txt");
            console.log("-------------------------");
        })
        .catch(function (error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

function runTxtFile() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        data = data.split('\n');
        data.forEach(element => {
            var item = element.split(',');
            if (item[0] === "spotify-this-song") {
                findSong(item[1]);
            } else if (item[0] === "movie-this") {
                findMovie(item[1]);
            } else if (item[0] === "concert-this") {
                item[1] = item[1].replace(" ", "+").replace(/"/g, '');
                findConcert(item[1]);
            } else {
                return console.log(item);
            }

        });
    });
}

const op = process.argv[2];

if (op === "concert-this") {
    var artist = process.argv.splice(3);
    if (artist.length === 0) {
        artist = 'Chance the Rapper';
    } else {
        artist = artist.join().replace(/,/g, '%20');
    }
    findConcert(artist);
} else if (op === "spotify-this-song") {
    var song = process.argv.splice(3);
    if (song.length === 0) {
        song = '3005';
    } else {
        song = song.join(" ");
    }
    findSong(song);
} else if (op === "movie-this") {
    var movieName = process.argv.splice(3);
    if (movieName.length === 0) {
        movieName = 'Mr.+Nobody';
    } else {
        movieName = movieName.join().replace(',', '+')

    }

    findMovie(movieName);
} else if (op === "do-what-it-says") {
    runTxtFile();
}