"use strict";

(function()
{
	window.addEventListener("load", main);
}());


function main(){
	var mainSource=window.parent;
    var popup = document.getElementById('popupStartButton');
    var btnStart = document.getElementById("StartGameBtn");
	var btnRanking = document.getElementById("RankingBtn");
	var btnOptions = document.getElementById("OptionsBtn");
	var btnEasterEgg = document.getElementById("EasterEggBtn");
	var btnHelp = document.getElementById("HelpBtn");
	var loginBtn = document.getElementById("LoginBtn");
	var loadBtn = document.getElementById("LoadBtn");
	var user = document.getElementById("user");

	var startImg = new Image();
	startImg.addEventListener("load", function imgLoaded(ev){
		startImg.src = "../resources/City_Skyline.png";
	});
	var aux = document.getElementById("popup_contentStartButton").style.backgroundImage;
	aux = startImg;


	var localDataBase = JSON.parse(localStorage.getItem('items'));
	if (localDataBase != null) {
		user.innerHTML = "User >>> "+localDataBase.userName;
	}

    btnStart.onclick = function() {
        popup.style.display = "block";
    }
	btnRanking.onclick = function() {
		mainSource.postMessage('Ranking.html', '*');
    }
	btnOptions.onclick = function() {
		mainSource.postMessage('Options.html', '*');
    }
	btnEasterEgg.onclick = function() {
		if (localDataBase != null) {
			if (localDataBase.userName == "None") {
				window.alert("Must log in for acess EasterEgg menu")
			}
			else {

				mainSource.postMessage('EasterEgg.html', '*');
			}
		}
		else {
			window.alert("Must log in for acess EasterEgg menu")
		}
    }
	btnHelp.onclick = function() {
		mainSource.postMessage('Help.html', '*');
    }
	loginBtn.onclick = function() {
        mainSource.postMessage('Login.html', '*');
    }
	loadBtn.onclick = function() {
        mainSource.postMessage('Load.html', '*');
    }
    window.onclick = function(ev) {
        if (ev.target == popup) {
            popup.style.display = "none";
        }
    }
}
