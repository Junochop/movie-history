"use strict";

const tmdb = require('./tmdb');

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

	}).catch((error)=> {
		console.log(error);
	});
};

module.exports = {retrieveKeys};