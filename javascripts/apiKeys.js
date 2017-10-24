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