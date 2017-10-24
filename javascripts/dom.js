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