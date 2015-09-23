var EventSource = require('eventsource');
var JsonPatch = require('fast-json-patch');
var Firebase = require('firebase');

function server() {
 // var jsonpatch = require('jsonpatch');
  var myFirebaseRef = new Firebase('https://shining-inferno-1085.firebaseio.com/Test');
  var eventSource = null;
  var articles = {};

  function connect() {
    var URL = 'https://streamdata.motwin.net/http://www.faroo.com/api?q=Atlanta%20Hawks%20&start=1&length=10&l=en&src=news&f=json&key=gbnEDrs@HPpVdWyQSAjQd6OVhqY_&X-Sd-Token=NDUzOTNjN2ItNDFlNy00MzBkLThmMGQtNzM2ZWFjYTNiZDkx';

    var eventsource = new EventSource(URL);
    eventsource.onopen = function(){
    	console.log("connected!");
    };

    eventsource.addEventListener('data', function(e) {
      articles = JSON.parse(e.data);
      console.log(articles);
      myFirebaseRef.set(articles);
    });

    eventsource.addEventListener('patch', function(patch) {
      if(patch[0].path !== "/time") {
          myFirebaseRef.push(patch.data);
       } 
    });

    eventsource.addEventListener('error', function(e) {
      console.log('ERROR!');
      eventsource.close();
    });
	}
	connect();
}

console.log('start');

server();
