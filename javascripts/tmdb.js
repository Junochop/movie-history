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
dom.clearDom();
 dom.domString(movieArray, imgConfig);
};

module.exports ={setKey, searchMovies};