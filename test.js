var EventSource = require('eventsource');
var JsonPatch = require('fast-json-patch');
var Firebase = require('firebase');
var sleep = require('sleep');

function server() {
  //connect to firebase node
  var myFirebaseRef = new Firebase('https://shining-inferno-1085.firebaseio.com/');
  var teamName = null;
  var eventSource = null;

  function connectStream(teamStream, teamName){
    var streamdata = "https://streamdata.motwin.net/http://www.faroo.com/api?q=";
    var streamtoken = "&start=1&length=10&l=en&src=news&f=json&key=gbnEDrs@HPpVdWyQSAjQd6OVhqY_&X-Sd-Token=NDUzOTNjN2ItNDFlNy00MzBkLThmMGQtNzM2ZWFjYTNiZDkx";
    var teamStream = new EventSource(streamdata + teamName + streamtoken);
      
      teamStream.onopen = function(){
        console.log(teamStream + " connected!");
      };

      teamStream.addEventListener('data', function(item) {
      //set teamName as the query sent to api
      var data = JSON.parse(item.data);
      teamName = data.query;
      console.log('got data from ' + teamName);
      //set firebase node as the query sent to api
      var myFirebaseRef = new Firebase('https://shining-inferno-1085.firebaseio.com/' + teamName);
      //set initial data with returned api data
      myFirebaseRef.set(data);
    });

      teamStream.addEventListener('patch', function(patch) {
      var item = JSON.parse(patch.data);
      console.log("patch is " + item);
      if(patch.data[0].path !== "/time") {
          myFirebaseRef.push(patch.data);
       }
    });

    teamStream.addEventListener('error', function(e) {
      console.log('ERROR!');
      console.log(e.data);
      teamStream.close();
    });
  }

  function connect() {
    //set eventsource url connection
    var URL = 'https://streamdata.motwin.net/http://www.faroo.com/api?q=Atlanta%20Hawks%20&start=1&length=10&l=en&src=news&f=json&key=gbnEDrs@HPpVdWyQSAjQd6OVhqY_&X-Sd-Token=NDUzOTNjN2ItNDFlNy00MzBkLThmMGQtNzM2ZWFjYTNiZDkx';
    
    var teamList = ["Atlanta%20Hawks", "Boston%20Celtics", 
                      "Brooklyn%20Nets",
                      "Charlotte%20Hornets",
                      "Chicago%20Bulls",
                      "Cleveland%20Cavaliers", 
                      "Dallas%20Mavericks",
                      "Denver%20Nuggets",
                      "Detroit%20Pistons",
                      "Golden%20State%20Warriors", "Houston%20Rockets", 
                      "Indiana%20Pacers",
                      "LA%20Clippers",
                      "LA%20Lakers",
                      "Memphis%20Grizzlies", 
                      "Miami%20Heat",
                      "Milwaukee%20Bucks",
                      "Minnesota%20Timberwolves",
                      "New%20Orleans%20Pelicans",
                      "New%20York%20Knicks",
                      "Oklahoma%20City%20Thunder",
                      "Orlando%20Magic",
                      "Philadelphia%20Sixers",
                      "Phoenix%20Suns",
                      "Portland%20Trail%20Blazers",
                      "Sacramento%20Kings",
                      "San%20Antonio%20Spurs",
                      "Toronto%20Raptors",
                      "Utah%20Jazz", "Washington%20Wizards"];

      var eventsource = ["Atlanta Hawks", "Boston Celtics", 
                      "Brooklyn Nets",
                      "Charlotte Hornets",
                      "Chicago Bulls",
                      "Cleveland Cavaliers", 
                      "Dallas Mavericks",
                      "Denver Nuggets",
                      "Detroit Pistons",
                      "Golden State Warriors", "Houston Rockets", 
                      "Indiana Pacers",
                      "LA Clippers",
                      "LA Lakers",
                      "Memphis Grizzlies", 
                      "Miami Heat",
                      "Milwaukee Bucks",
                      "Minnesota Timberwolves",
                      "New Orleans Pelicans",
                      "New York Knicks",
                      "Oklahoma City Thunder",
                      "Orlando Magic",
                      "Philadelphia Sixers",
                      "Phoenix Suns",
                      "Portland Trail Blazers",
                      "Sacramento Kings",
                      "San Antonio Spurs",
                      "Toronto Raptors",
                      "Utah Jazz", "Washington Wizards"];

    for(var i=0; i<teamList.length; i++){
      console.log(i);
      var teamStream = global[eventsource[i]];
      
      var streamdata = "https://streamdata.motwin.net/http://www.faroo.com/api?q=";
    var streamtoken = "&start=1&length=10&l=en&src=news&f=json&key=gbnEDrs@HPpVdWyQSAjQd6OVhqY_&X-Sd-Token=NDUzOTNjN2ItNDFlNy00MzBkLThmMGQtNzM2ZWFjYTNiZDkx";
    var teamStream = new EventSource(streamdata + teamList[i] + streamtoken);
      setTimeout(function() {
        console.log('hello')
      }, 3000);
      teamStream.onopen = function(){
        console.log(teamStream + " connected!");
      };

      teamStream.addEventListener('data', function(item) {
      //set teamName as the query sent to api
      var data = JSON.parse(item.data);
      teamName = data.query;
      console.log('got data from ' + teamName);
      //set firebase node as the query sent to api
      var myFirebaseRef = new Firebase('https://shining-inferno-1085.firebaseio.com/' + teamName);
      //set initial data with returned api data
      myFirebaseRef.set(data);
    });

      teamStream.addEventListener('patch', function(patch) {
      var item = JSON.parse(patch.data);
      console.log("patch is " + item);
      if(patch.data[0].path !== "/time") {
          myFirebaseRef.push(patch.data);
       }
    });

    teamStream.addEventListener('error', function(e) {
      console.log('ERROR!');
      console.log(e.data);
      teamStream.close();
    });
    
      
  }
    }

	connect();
}

console.log('start');

server();
