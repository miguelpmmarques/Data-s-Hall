"use strict";

(function()
{
	window.addEventListener("load", main);
}());


function main(){
	var yesBtn = document.getElementById('Yes');
	var noBtn = document.getElementById("No");
	var localDataBase = JSON.parse(localStorage.getItem('items'));
	yesBtn.addEventListener("click", function (ev) {
		doDaStuffYouknow(localDataBase,true,localStorage)
	});
	noBtn.addEventListener("click", function (ev) {
		doDaStuffYouknow(localDataBase,false,localStorage)
	});
}
function doDaStuffYouknow(localDataBase,daDecisionYouknow,localStorage){
	var mainSource=window.parent;
	localDataBase.actUser.question1 = daDecisionYouknow;
	localStorage.setItem('items',JSON.stringify(localDataBase));
	mainSource.postMessage('../level/HTML/level1.html', '*'); 
}
