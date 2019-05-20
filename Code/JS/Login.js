"use strict";

(function()
{
	window.addEventListener("load", main);
}());

function main(){
	var mainSource=window.parent;
	var popup = document.getElementById('popupStartButton');
	var exitBtn = document.getElementById("ExitBtn");
	var userInput = document.getElementById('userInput')
	var yesBtn = document.getElementById('Yes');
	var noBtn = document.getElementById("No");
	var startBtn = document.getElementById("StartGameBtn");
	var localDataBase = JSON.parse(localStorage.getItem('items'));
	var startImg = new Image();
	var actUser;
	startImg.addEventListener("load", imgLoaded);
	startImg.src = "../resources/City_Skyline.png";
	document.getElementById("popup_contentStartButton").style.backgroundImage = startImg;
	startBtn.addEventListener("click", startClick);
	yesBtn.addEventListener("click", yesClick);
	noBtn.addEventListener("click", noClick);
	exitBtn.addEventListener("click", exitClick);

	function startClick(ev) {
		var flag = saveUser(mainSource,actUser,localStorage,userInput,localDataBase)
		if (!flag) {
			mainSource.postMessage('../level/HTML/Level0.html', '*');
		}
	}
	function yesClick(ev) {
		saveUser(mainSource,actUser,localStorage,userInput,localDataBase)
	}
	function exitClick() {
		goBack(userInput,mainSource,popup)
	}
}
function goBack(userInput,mainSource,popup) {
	if (userInput.value === "") {
		mainSource.postMessage('MainMenu.html', '*');
	}
	else {
		popup.style.display = "block";
	}
	window.onclick = function(ev) {
        if (ev.target == popup) {
            popup.style.display = "none";
        }
    }
}
function noClick() {
	mainSource.postMessage('MainMenu.html', '*');
}
function saveUser(mainSource,actUser,localStorage,userInput,localDataBase) {
	var actUser = userInput.value;
	var d = new Date();
	var month = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July","Aug.","Sept.","Oct.","Nov.","Dec.",];
	var day = d.getDate();
	switch (day) {
		case 1:
			day = day+"st"
			break;
		case 2:
			day = day+"nd"
			break;
		case 3:
			day = day+"rd"
			break;
		default:
			day = day+"th"
			break;
	}
	var flag = true;
	for (var i = 0; i < localDataBase.ranking.length; i++) {
		console.log( localDataBase.ranking[i]);
		if (localDataBase.ranking[i].name == actUser) {
			flag = false;
		}
	}

	if (flag) {
		var data = " "+day+" " + month[d.getMonth()] +" " + d.getFullYear();
		var newUser = new Slots(actUser,data,0,0);
		if (localDataBase.slotLoad1 ==  null) {
			localDataBase.slotLoad1 = newUser;
			localDataBase.slotLoad1.index = 1;
			localDataBase.userName = actUser;
			localDataBase.actUser = newUser;
			localStorage.setItem('items',JSON.stringify(localDataBase));
			mainSource.postMessage('MainMenu.html', '*');
		}
		else if (localDataBase.slotLoad2 ==  null) {
			localDataBase.slotLoad2 = newUser;
			localDataBase.slotLoad2.index = 2;
			localDataBase.userName = actUser;
			localDataBase.actUser = newUser;
			localStorage.setItem('items',JSON.stringify(localDataBase));
			mainSource.postMessage('MainMenu.html', '*');
		}
		else if (localDataBase.slotLoad3 ==  null) {
			localDataBase.slotLoad3 = newUser;
			localDataBase.slotLoad3.index = 3;
			localDataBase.userName = actUser;
			localDataBase.actUser = newUser;
			localStorage.setItem('items',JSON.stringify(localDataBase));
			mainSource.postMessage('MainMenu.html', '*');
		}
		else {
			alert("ALL SLOTS ARE FULL, DELETE ONE TO CREATE A NEW USER!");
		}

	}
	else {
		alert("NAME ALREADY IN USE, PLEASE TRY ANOTHER ONE!");
		return true
	}
}
function imgLoaded(ev)
{
	var img = ev.target;
}
