"use strict";

(function()
{
	window.addEventListener("load", main);
}());

const path = "HTML/"

function main(){


	var setUpObject = new setUp();
	var audio = document.getElementsByTagName('audio')[0];
	audio.controls = true;
	audio.onplay = function() {
		audio.controls = false;
	};
	audio.play().catch(function(){
		console.log("Audio started playing");
	});
	audio.volume = 0.5;

    var iframe = document.getElementById('mainIframe');
	var user = document.getElementsByClassName("Aux")[0];
	window.addEventListener("message", windowListener);
	if (localStorage.getItem("items") === null) {
		localStorage.setItem('items',JSON.stringify(setUpObject));
	}
	else {
		var localDataBase = JSON.parse(localStorage.getItem('items'))
		localDataBase.soundEfectsVol = 50;
		localDataBase.menuMusicVol = 50;
		localDataBase.gameMusicVol = 50;
		localStorage.setItem('items',JSON.stringify(localDataBase));
	}
    function windowListener(ev)
    {

		var message = ev.data;
		if (message.indexOf("SOM") != -1) {
			var messageSplit = message.split("|")
			if (messageSplit[1] == "MENU") {
				audio.volume = Number(messageSplit[2])/100;
			}
		}
		else {
			localDataBase = JSON.parse(localStorage.getItem('items'));
			if (message.includes("level")) {
				audio.muted = true;
			}
			else {
				audio.muted = false;
			}
			iframe.src = path+message;
		}
	}
}
