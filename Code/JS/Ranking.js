"use strict";

(function()
{
	window.addEventListener("load", main);
}());

function main(){
	var mainSource=window.parent;
	var exitBtn = document.getElementById("ExitBtn");
	var rank = document.getElementsByTagName('H1');
	var localDataBase = JSON.parse(localStorage.getItem('items'));
	writeDaStuffYouKnow(rank,localDataBase)
	exitBtn.onclick = function() {
        mainSource.postMessage('MainMenu.html', '*');
    }
}

function writeDaStuffYouKnow(rank,localDataBase) {
	let slot1=  localDataBase.slotLoad1;
	let slot2=  localDataBase.slotLoad2;
	let slot3=  localDataBase.slotLoad3;
	if (slot1) {
		localDataBase.ranking = insersion(slot1,localDataBase.ranking)
	}
	if (slot2) {
		localDataBase.ranking = insersion(slot2,localDataBase.ranking)
	}
	if (slot3) {
		localDataBase.ranking = insersion(slot3,localDataBase.ranking)
	}
	if (localDataBase.ranking.length >= 8) {
		localDataBase.ranking = localDataBase.ranking.slice(0,8);
	}
	for (var i = 0; i < rank.length; i++) {
		if (localDataBase.ranking[i] != undefined) {
			rank[i].innerHTML =localDataBase.ranking[i].name+" | Level - "+localDataBase.ranking[i].level +" | Switch flips - "+localDataBase.ranking[i].totalSwitch+" | Time - "+localDataBase.ranking[i].totaltime;
		}
		else {
			rank[i].innerHTML = "Empty";
		}
	}
	localStorage.setItem('items',JSON.stringify(localDataBase));
}
function find(userName,ranking) {
	for (var i = 0; i < ranking.length; i++) {
		if (ranking[i].name == userName) {
			return true;
		}
	}
	return false
}
function remove(newUser,ranking) {
	for (var i = 0; i < ranking.length; i++) {
		if (ranking[i].name == newUser.name) {
			ranking.splice(i, 1)
		}
	}
	return ranking
}
function insersion(newUser,ranking) {
	var findIt = find(newUser.name,ranking)
	if (findIt) {
		ranking = remove(newUser,ranking);
	}
	let index = 0;
	for (var i = 0; i < ranking.length; i++) {
		if (ranking[i].level > newUser.level ) {
			index++;
		}
		else if (ranking[i].level == newUser.level ) {

			if (ranking[i].totalSwitch < newUser.totalSwitch ) {
				index++;
			}
			else if (ranking[i].totalSwitch == newUser.totalSwitch ) {

				if (ranking[i].totaltime < newUser.totaltime ) {
					index++;
				}
				else if (ranking[i].totaltime == newUser.totaltime ) {
					index++;
				}
				else {
					break
				}
			}
			else {
				break
			}
		}
		else {
			break
		}
	}
	ranking.splice(index,0,newUser);
	return ranking
}
