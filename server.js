
var JsonPatch = require('fast-json-patch');
var Firebase = require('firebase');
var async = require('async');
var EventSource = require('eventsource');
var express = require('express');
var app = express();
var myFirebaseRef = new Firebase('https://articleserver.firebaseio.com/');
var teamName = null;
var eventSource = null;
var streamdata = null;
var streamtoken = null;



function connectStream(TeamItem, callback) {
   
    streamdata = "https://streamdata.motwin.net/http://www.faroo.com/api?q=";
    streamtoken = "&start=1&length=10&l=en&src=news&f=json&key=gbnEDrs@HPpVdWyQSAjQd6OVhqY_&X-Sd-Token=NDUzOTNjN2ItNDFlNy00MzBkLThmMGQtNzM2ZWFjYTNiZDkx";
    //opens eventsource for current url
    var TeamName = TeamItem.Name;
    var link = streamdata + TeamItem.Team + streamtoken;
    TeamItem.info = new EventSource(link);
    // log opening of eventsource
    TeamItem.info.onopen = function() {
      
    };
    // add event listener for current url
    TeamItem.info.addEventListener('data', function(item) {
        //set teamName as the query sent to api
        var data = JSON.parse(item.data);
        teamName = data.query;

        console.log(data);
 
        //set firebase node as the query sent to api
        var myFirebaseRef = new Firebase('https://articleserver.firebaseio.com/' + TeamName);
        //set initial data with returned api data
        myFirebaseRef.set(data);
        
    });
    //add event listener to listen for updates on current url
    TeamItem.info.addEventListener('patch', function(patch) {
         var item = JSON.parse(patch.data);
         item = item[0];
        
        if (item.op == "add") {
            var myFirebaseRef = new Firebase('https://articleserver.firebaseio.com/' + TeamName + "/results");
            //push update to database
            myFirebaseRef.push(item.value);
        } else if (item.op == "replace" && item.path == "/time") {
            var myFirebaseRef = new Firebase('https://articleserver.firebaseio.com/' + TeamName + item.path);
            myFirebaseRef.set(item.value);
        }

    });
    //add listener for errors
    TeamItem.info.addEventListener('error', function(e) {
        console.log('ERROR!');
        console.log(e.data);
        TeamItem.info.close();
    });
    
}



function connect() {
    
        //set eventsource url connection
    var URL = 'https://streamdata.motwin.net/http://www.faroo.com/api?q=Atlanta%20Hawks%20&start=1&length=10&l=en&src=news&f=json&key=gbnEDrs@HPpVdWyQSAjQd6OVhqY_&X-Sd-Token=NDUzOTNjN2ItNDFlNy00MzBkLThmMGQtNzM2ZWFjYTNiZDkx';
    
    var TeamList = [{"Team": "Atlanta%20Hawks", "info": {}, "Name": "Atlanta Hawks"}, {"Team": "Boston%20Celtics", "info": {}, "Name":"Boston Celtics"}, {"Team": "Brooklyn%20Nets", "info": {}, "Name":"Brooklyn Nets"}, {"Team": "Charlotte%20Hornets", "info": {}, "Name":"Charlotte Hornets"}, {"Team": "Chicago%20Bulls", "info": {}, "Name":"Chicago Bulls"}, {"Team": "Cleveland%20Cavaliers", "info": {}, "Name":"Cleveland Cavaliers"}, {"Team": "Dallas%20Mavericks", "info": {}, "Name":"Dallas Mavericks"}, {"Team": "Denver%20Nuggets", "info": {}, "Name":"Denver Nuggets"}, {"Team": "Detroit%20Pistons", "info": {}, "Name":"Detroit Pistons"}, {"Team": "Golden%20State%20Warriors", "info": {}, "Name":"Golden State Warriors"}, {"Team": "Houston%20Rockets", "info": {}, "Name":"Houston Rockets"}, {"Team": "Indiana%20Pacers", "info": {}, "Name":"Indiana Pacers"}, {"Team": "LA%20Clippers", "info": {}, "Name":"LA Clippers"}, {"Team": "LA%20Lakers", "info": {}, "Name":"LA Lakers"}, {"Team": "Memphis%20Grizzlies", "info": {}, "Name":"Memphis Grizzlies"}, {"Team": "Miami%20Heat", "info": {}, "Name":"Miami Heat"}, {"Team": "Milwaukee%20Bucks", "info": {}, "Name":"Milwaukee Bucks"}, {"Team": "Minnesota%20Timberwolves", "info": {}, "Name":"Minnesota Timberwolves"}, {"Team": "New%20Orleans%20Pelicans", "info": {}, "Name":"New Orleans Pelicans"}, {"Team": "New%20York%20Knicks", "info": {}, "Name":"New York Knicks"}, {"Team": "Oklahoma%20City%20Thunder", "info": {}, "Name":"Oklahoma City Thunder"}, {"Team": "Orlando%20Magic", "info": {}, "Name":"Orlando Magic"}, {"Team": "Philadelphia%2076ers", "info": {}, "Name":"Philadelphia Sixers"}, {"Team": "Phoenix%20Suns", "info": {}, "Name":"Phoenix Suns"}, {"Team": "Portland%20Trail%20Blazers", "info": {}, "Name":"Portland Trail Blazers"}, {"Team": "Sacramento%20Kings", "info": {}, "Name":"Sacramento Kings"}, {"Team": "San%20Antonio%20Spurs", "info": {}, "Name":"San Antonio Spurs"}, {"Team": "Toronto%20Raptors", "info": {}, "Name":"Toronto Raptors"}, {"Team": "Utah%20Jazz", "info": {}, "Name":"Utah Jazz"}, {"Team": "Washington%20Wizards", "info": {}, "Name":"Washington Wizards"}];
    
    var currentTime = null, elapsedTime = null;
    var index = 0;

    var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000
    var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
     
    app.listen(server_port, server_ip_address, function () {
      console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
    });

    async.eachLimit(TeamList, 5, function(team, callback){
        setTimeout(function(){
        connectStream(team);
        callback();
       }, (5000));
        }, function(err){
                if(err) {console.log(err);}
                
    });

}




    


function server() {
    //connect to firebase node
    //connect to each url
    connect();
}
console.log('start');
server();