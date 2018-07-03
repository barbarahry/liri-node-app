/* Usage:
node liri.js my-tweets
node liri.js spotify-this-song '<song name here>'
node liri.js movie-this '<movie name here>'
node liri.js do-what-it-says
*/
//  Pre-requisits:
require("dotenv").config();

const myKeys = require('./keys');

// Include the  NPM packages:
var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api");  // this gives: Error: Cannot find module 'spotify'
var Twitter = require("twitter");

//  Variables:
var defaultTweets = 10;
var defaultSong = "The Sign";
var defaultMovie = "Mr. Nobody";
var liriCommands = ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"];
// Functions:
function Log(logMessage) {
    fs.appendFile("log.txt", "\n" + logMessage, function(err) {
        // If the code experiences any errors it will log the error to the console.
        if (err) {
          return console.log(err);
        }
        // Otherwise, it will print: "log.txt was updated!"
        console.log("\nlog.txt was updated with " + logMessage + " !");
      });
}
function runCommand(command, argument){
  switch (command) {
    case "my-tweets":
      myTweets(argument);
      break;
    
    case "spotify-this-song":
      spotifyThis(argument);
      break;
    
    case "movie-this":
      movieThis(argument);
      break;
    
    case "do-what-it-says":
      doThis();
      break;

    default:
      Instructions();
      break;
    }
    Log("Done with running " + command + " Type another command.")
}

function Instructions() {
  Log("Displaying Instructions");
  console.log("\nliri can understand following commands: my-tweets, spotify-this-song, movie-this, and do-what-it-says");
}
function myTweets(Count){
  Log("Getting Tweets");
  var TweetNum = Count || defaultTweets;
  
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  client.get('/statuses/user_timeline.json',
    { screen_name: "@Barba51029398", count: TweetNum},

    function(error, tweets) {
      for(i=0; i <TweetNum; i++){
        console.log("\n\nTweet: " + i);
        console.log(tweets[i].text);
      }
    }
  );

}
function spotifyThis(Name){
  SongName = Name || defaultSong;
  Log("Getting " + SongName + " from Spotify");
  var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  });
   
  spotify.search({ type: 'track', query: SongName }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    } else {
      var mySongs = data.tracks.items.length;
      console.log("\nSongs Found: " + mySongs);
      var mySong = data.tracks.items[0];
      console.log("\nArtist: " + mySong.artists[0].name);
      console.log("\nSong Title: " + mySong.name);
      console.log("\nSong URL: " + mySong.preview_url);
      console.log("\nAlbumTitle: " + mySong.album.name);
      

    }
  });
  console.log("Getting " + SongName + " from Spotify");
}
function movieThis(Name){
  movieName = Name || defaultMovie;
  Log("Getting " + movieName + " from OMDB");
  // Then run a request to the OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

// This line is just to help us debug against the actual URL.
console.log(queryUrl);

request(queryUrl, function(error, response, body) {

  // If the request is successful
  if (!error && response.statusCode === 200) {
    //console.log(body);
    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    console.log("Title: " + JSON.parse(body).Title);
    console.log("Release Year: " + JSON.parse(body).Year);
    console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
    console.log("Rotten Tomatoe Rating: " + JSON.parse(body).Ratings[1].Value);
    console.log("Plot: " + JSON.parse(body).Plot);
    console.log("Country: " + JSON.parse(body).Country);
    console.log("Language: " + JSON.parse(body).Language);
  }
});
}
function doThis(){  // LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
  Log("Doing what it says");

  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    };
    data = data.split(", ");
    runCommand(data[0], data[1])
  });
}

// Init:
Log("Checking for Arguments");
// Take in the command line arguments
var nodeArgs = process.argv;
var nodeArgsNum = nodeArgs.length;
Log("ArgumentsNum = " + nodeArgsNum);
if (nodeArgsNum<3) {
    console.log("\nToo few arguments " + nodeArgsNum + ", come again when you are more sure.\n");
    Instructions();
} else if (nodeArgsNum>4) {
    console.log("\nToo many arguments " + nodeArgsNum + ", come again when you are more sure.\n");
    Instructions();
};
var liriCommand = nodeArgs[2];
var liriCommandAttribute = nodeArgs[3];

runCommand(liriCommand, liriCommandAttribute);
