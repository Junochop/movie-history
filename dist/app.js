(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

const tmdb = require('./tmdb');
const firebaseApi = require('./firebaseApi');

const apiKeys=()=> {
//promise
return new Promise((resolve, reject) => {
	$.ajax('./db/apiKeys.json').done((data)=> {
		resolve(data.apiKeys);
	}).fail((error)=> {
		reject(error);
	});
});
};

const retrieveKeys = () => {
	console.log("results");
	apiKeys().then((results)=> {
		console.log("results", results);
		tmdb.setKey(results.tmdb.apiKey);
		firebaseApi.setKey(results.firebaseKeys);
		firebase.initializeApp(results.firebaseKeys);
		console.log("firebase app", firebase.apps);
	}).catch((error)=> {
		console.log(error);
	});
};

module.exports = {retrieveKeys};
},{"./firebaseApi":4,"./tmdb":6}],2:[function(require,module,exports){
"use strict";

const domString = (movieArray, imgConfig, divName) => {
	console.log(movieArray);
	let domString = "";
	for (let i=0; i < movieArray.length; i++) {
		if (i % 3 === 0) {
			domString += `<div class="row">`;
		}
		domString += `<div class="col-sm-6 col-md-4">`;
		domString += 	`<div class="thumbnail">`;
		domString += 		`<img src="${imgConfig.base_url}/w342/${movieArray[i].poster_path}" alt="">`;
		domString += 			`<div class="caption">`;
		domString += 			`<h3>${movieArray[i].original_title}</h3>`;
		domString += 			`<p>${movieArray[i].overview}</p>`;
		domString += 			 `<p><a href="#" class="btn btn-primary" role="button">Review</a> 
								<a href="#" class="btn btn-default" role="button">Watchlist</a></p>`;
		domString +=  		`</div>`;
		domString +=  	`</div>`;
		domString +=  `</div>`;
		if (i % 3 === 2 || i === movieArray.length -1){
		domString +=  `</div>`;
		}


	}

	printDomString(domString, divName);

};

const printDomString = (strang, divName) => {
  $(`#${divName}`).append(strang);
};

const clearDom = (divName) => {
	//$(`#${divName}`).html(""); or
	$(`#${divName}`).empty();
};

module.exports ={domString, clearDom};
},{}],3:[function(require,module,exports){
"use strict";

const tmdb = require('./tmdb');
const firebaseApi  = require('./firebaseApi');

const pressEnter = () => {
  $(document).keypress((e) => {
  	if(e.key === 'Enter'){
      let searchText = $('#searchBar').val();
      let query = searchText.replace(/\s/g, "%20");
      tmdb.searchMovies(query);
    }

  });

};

const myLinks = () => {
	$(document).click((e) => {
		if(e.target.id === "navSearch"){
			$("#search").removeClass("hide");
			$("#myMovies").addClass("hide");
			$("#authScreen").addClass("hide");

		}else if (e.target.id === "mine") {
			$("#search").addClass("hide");
			$("#myMovies").removeClass("hide");
			$("#authScreen").addClass("hide");

		}else if (e.target.id === "authenticate") {
			$("#search").addClass("hide");
			$("#myMovies").addClass("hide");
			$("#authScreen").removeClass("hide");

		}
	});

};



const googleAuth = () => {
	$('#googleButton').click((e)=>{
	firebaseApi.authenticateGoogle().then((result) =>{
		console.log("result", result);
	}).catch((err) =>{ 
		console.log("error in authent", err);
	});
  });
};








module.exports = {pressEnter, myLinks, googleAuth};
},{"./firebaseApi":4,"./tmdb":6}],4:[function(require,module,exports){
"use strict";

let firebaseKey = "";
let userUid = "";

const setKey = (key) => {
	firebaseKey = key;
};

//Firebase: GOOGLE - Use input credentials to authenticate user.
  let authenticateGoogle = () => {
    return new Promise((resolve, reject) => {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider)
        .then((authData) => {
        	userUid = authData.user.uid;
            resolve(authData.user);
        }).catch((error) => {
            reject(error);
        });
    });
  };

module.exports = {setKey, authenticateGoogle};
},{}],5:[function(require,module,exports){
"use strict";

let events = require('./events');
let apiKeys = require('./apiKeys');


apiKeys.retrieveKeys();
events.pressEnter();
events.googleAuth();
events.myLinks();






// let dom = require('./dom');


// let singleMovie = {
// 		adult:false,
// 		backdrop_path:"/c2Ax8Rox5g6CneChwy1gmu4UbSb.jpg",
// 		genre_ids:[28, 12, 878, 14],
// 		id:140607,
// 		original_language:"en",
// 		original_title:"Star Wars: The Force Awakens",
// 		overview:"Thirty years after defeating the Galactic Empire, Han Solo and his allies face a new threat from the evil Kylo Ren and his army of Stormtroopers.",
// 		popularity:49.408373,
// 		poster_path:"/weUSwMdQIa3NaXVzwUoIIcAi85d.jpg",
// 		release_date:"2015-12-15",
// 		title:"Star Wars: The Force Awakens",
// 		video:false,
// 		vote_average:7.5,
// 		vote_count:7965
// 	};

// //dom.domstring  because of object and not json.
// 	dom.domString([singleMovie, singleMovie, singleMovie, singleMovie]);

},{"./apiKeys":1,"./events":3}],6:[function(require,module,exports){
"use strict";

let tmdbKey;
let imgConfig;
const dom = require('./dom');

const searchTMDB = (query) => {
// promise search movies
console.log(tmdbKey);
return new Promise((resolve, reject) => {
	$.ajax(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}
		&language=en-US&page=1&include_adult=false&query=${query}`)
		.done((data) =>{
			console.log(data);
			resolve(data.results);
		}).fail((error) => {
			reject(error);
		});

	});

};

const tmdbConfiguration = () => {
	return new Promise((resolve, reject)=> {
		$.ajax(`https://api.themoviedb.org/3/configuration?api_key=${tmdbKey}`
		).done((data) => {
			resolve(data.images);
		}).fail((error) => {
			reject(error);
		});

	});
};

const getConfig = () => {
	tmdbConfiguration().then((results) => {
		imgConfig = results;
	}).catch((error)=>{
		console.log("error in config", error);
	});
};

const searchMovies = (query) => {
// execute search TMDB

searchTMDB(query).then((data) =>{
	showResults(data);
}).catch((error)=> {
	console.log("error", error);
});
};


const setKey = (apiKey) => {
// sets tmdbkey
tmdbKey = apiKey;
getConfig();


};


const showResults = (movieArray) => {
dom.clearDom('movies');
 dom.domString(movieArray, imgConfig, 'movies');
};

module.exports ={setKey, searchMovies};
},{"./dom":2}]},{},[5]);
