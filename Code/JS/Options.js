"use strict";

(function()
{
	window.addEventListener("load", main);
}());

const path = "../resources/Sound/"

function main(){
	var mainSource=window.parent;

	var soundEfectsControlState = true;
	var menuMusicControlState = true;
	var gameMusicControlState = true;

	var exitBtn = document.getElementById("ExitBtn");

	var soundEfectsUp = document.getElementById("soundEfectsUp");
	var soundEfectsDown = document.getElementById('soundEfectsDown');
	var soundEfectsControl =document.getElementById('soundEfectsControl');
	var sliderSoundEfects = document.getElementById('sliderSoundEfectsImg');

	var menuMusicUp = document.getElementById('menuMusicUp');
	var menuMusicDown = document.getElementById('menuMusicDown');
	var menuMusicControl = document.getElementById('menuMusicControl');
	var sliderMenuMusic = document.getElementById('sliderMenuMusicImg');

	var gameMusicUp = document.getElementById('gameMusicUp');
	var gameMusicDown = document.getElementById('gameMusicDown');
	var gameMusicControl = document.getElementById('gameMusicControl');
	var sliderGameMusic = document.getElementById('sliderGameMusicImg');

	soundEfectsUp.addEventListener("click",soundEfectsListener);
	soundEfectsDown.addEventListener("click",soundEfectsListener);
	soundEfectsControl.addEventListener("click",soundEfectsListener);

	var localDataBase = JSON.parse(localStorage.getItem('items'))
	var soundEfectsVol = localDataBase.soundEfectsVol;
	var menuMusicVol = localDataBase.menuMusicVol;
	var gameMusicVol = localDataBase.gameMusicVol;

	if (soundEfectsVol == 0) {
		soundEfectsControlState = false;
		soundEfectsControl.style.backgroundImage = "url('../resources/Sound/SoundOff.png')";
	}

	if (menuMusicVol == 0) {
		menuMusicControlState = false;
		menuMusicControl.style.backgroundImage = "url('../resources/Sound/SoundOff.png')";
	}

	if (gameMusicVol == 0) {
		gameMusicControlState = false;
		gameMusicControl.style.backgroundImage = "url('../resources/Sound/SoundOff.png')";
	}

	updateSlider(sliderSoundEfects,sliderMenuMusic,sliderGameMusic,soundEfectsVol,gameMusicVol,menuMusicVol);

	function soundEfectsListener(ev){
		var aux = manageSoundEfects(ev,soundEfectsUp,soundEfectsDown,soundEfectsControl,soundEfectsVol,soundEfectsControlState,sliderSoundEfects);
		if (aux === true || aux === false) {
			soundEfectsControlState = aux;
			if (aux === false) {
				soundEfectsVol = 0;
			}
		}
		else {
			soundEfectsVol = aux;
			if (soundEfectsVol == 0) {
				soundEfectsControlState = false;
			}
			else{
				soundEfectsControlState = true;
			}
		}
		//mainSource.postMessage('SOM|EFFECTS|'+soundEfectsVol, '*');
	}


	menuMusicUp.addEventListener("click",menuMusicListener);
	menuMusicDown.addEventListener("click",menuMusicListener);
	menuMusicControl.addEventListener("click",menuMusicListener);

	function menuMusicListener(ev){
		var aux = manageMenuMusic(ev,menuMusicUp,menuMusicDown,menuMusicControl,menuMusicVol,menuMusicControlState,sliderMenuMusic);
		if (aux === true || aux === false) {
			menuMusicControlState = aux;
			if (aux === false) {
				menuMusicVol = 0
			}
		}
		else {
			menuMusicVol = aux;
			if (menuMusicVol == 0) {
				menuMusicControlState = false;
			}
			else{
				menuMusicControlState = true;
			}
		}
		mainSource.postMessage('SOM|MENU|'+menuMusicVol, '*');
	}

	gameMusicUp.addEventListener("click",gameMusicListener);
	gameMusicDown.addEventListener("click",gameMusicListener);
	gameMusicControl.addEventListener("click",gameMusicListener);

	function gameMusicListener(ev){
		var aux = manageGameMusic(ev,gameMusicUp,gameMusicDown,gameMusicControl,gameMusicVol,gameMusicControlState,sliderGameMusic);
		if (aux === true || aux === false) {
			gameMusicControlState = aux;
			if (aux === false) {
				gameMusicVol = 0
			}
		}
		else {
			gameMusicVol = aux;
			if (gameMusicVol == 0) {
				gameMusicControlState = false;
			}
			else{
				gameMusicControlState = true;
			}
		}
		//mainSource.postMessage('SOM|GAME|'+gameMusicVol, '*');
	}

	exitBtn.onclick = function() {
		localDataBase.soundEfectsVol = soundEfectsVol;
        localDataBase.menuMusicVol = menuMusicVol;
    	localDataBase.gameMusicVol = gameMusicVol;
		localStorage.setItem('items',JSON.stringify(localDataBase));
        mainSource.postMessage('MainMenu.html', '*');
    }
}
function updateSlider(sliderSoundEfects,sliderMenuMusic,sliderGameMusic,soundEfectsVol,gameMusicVol,menuMusicVol){
	sliderGameMusic.src  = path + "slider" + gameMusicVol+".png";
	sliderMenuMusic.src  = path + "slider" + menuMusicVol+".png";
	sliderSoundEfects.src  = path + "slider" + soundEfectsVol+".png";
}
function manageGameMusic(ev,gameMusicUp,gameMusicDown,gameMusicControl,gameMusicVol,gameMusicControlState,sliderGameMusic){
	switch (ev.currentTarget.id) {
		case "gameMusicUp":
			if (gameMusicVol == 0) {
				gameMusicControl.style.backgroundImage = "url('../resources/Sound/SoundOn.png')";
			}
			if (gameMusicVol != 100) {
				gameMusicVol += 25;
				let imaName = path + "slider" + gameMusicVol+".png";
				sliderGameMusic.src  = imaName;
			}
			return gameMusicVol;
		case "gameMusicDown":
			if (gameMusicVol != 0) {
				gameMusicVol -= 25
				let imaName = path + "slider" + gameMusicVol+".png";
				sliderGameMusic.src  = imaName;
			}
			if (gameMusicVol == 0) {
				gameMusicControl.style.backgroundImage = "url('../resources/Sound/SoundOff.png')";
			}
			else {
				gameMusicControl.style.backgroundImage = "url('../resources/Sound/SoundOn.png')";
			}
			return gameMusicVol;
		case "gameMusicControl":
			if (gameMusicControlState) {
				sliderGameMusic.src  = path + "slider0.png";
				gameMusicControl.style.backgroundImage = "url('../resources/Sound/SoundOff.png')";
				return false
			}
			else {
				if (gameMusicVol == 0) {
					sliderGameMusic.src  = path + "slider25.png";
					gameMusicControl.style.backgroundImage = "url('../resources/Sound/SoundOn.png')";
					return 25;
				}
				let imaName = path + "slider" + gameMusicVol+".png";
				sliderGameMusic.src  = imaName;
				gameMusicControl.style.backgroundImage = "url('../resources/Sound/SoundOn.png')";
				return true
			}
			return
	}
}
function manageMenuMusic(ev,menuMusicUp,menuMusicDown,menuMusicControl,menuMusicVol,menuMusicControlState,sliderMenuMusic){
	switch (ev.currentTarget.id) {
		case "menuMusicUp":
			if (menuMusicVol == 0) {
				menuMusicControl.style.backgroundImage = "url('../resources/Sound/SoundOn.png')";
			}
			if (menuMusicVol != 100) {
				menuMusicVol += 25;
				let imaName = path + "slider" + menuMusicVol+".png";
				sliderMenuMusic.src  = imaName;
			}
			return menuMusicVol;
		case "menuMusicDown":
			if (menuMusicVol != 0) {
				menuMusicVol -= 25
				let imaName = path + "slider" + menuMusicVol+".png";
				sliderMenuMusic.src  = imaName;
			}
			if (menuMusicVol == 0) {
				menuMusicControl.style.backgroundImage = "url('../resources/Sound/SoundOff.png')";
			}
			else {
				menuMusicControl.style.backgroundImage = "url('../resources/Sound/SoundOn.png')";
			}
			return menuMusicVol;
		case "menuMusicControl":
			if (menuMusicControlState) {
				sliderMenuMusic.src  = path + "slider0.png";
				menuMusicControl.style.backgroundImage = "url('../resources/Sound/SoundOff.png')";
				return false
			}
			else {
				if (menuMusicVol == 0) {
					sliderMenuMusic.src  = path + "slider25.png";
					menuMusicControl.style.backgroundImage = "url('../resources/Sound/SoundOn.png')";
					return 25;
				}
				let imaName = path + "slider" + menuMusicVol+".png";
				sliderMenuMusic.src  = imaName;
				menuMusicControl.style.backgroundImage = "url('../resources/Sound/SoundOn.png')";
				return true
			}
			return
	}
}

function manageSoundEfects(ev,soundEfectsUp,soundEfectsDown,soundEfectsControl,soundEfectsVol,soundEfectsControlState,sliderSoundEfects){
	switch (ev.currentTarget.id) {
		case "soundEfectsUp":
			if (soundEfectsVol == 0) {
				soundEfectsControl.style.backgroundImage = "url('../resources/Sound/SoundOn.png')";
			}
			if (soundEfectsVol != 100) {
				soundEfectsVol += 25;
				let imaName = path + "slider" + soundEfectsVol+".png";
				sliderSoundEfects.src  = imaName;
			}
			return soundEfectsVol;
		case "soundEfectsDown":
			if (soundEfectsVol != 0) {
				soundEfectsVol -= 25
				let imaName = path + "slider" + soundEfectsVol+".png";
				sliderSoundEfects.src  = imaName;
			}
			if (soundEfectsVol == 0) {
				soundEfectsControl.style.backgroundImage = "url('../resources/Sound/SoundOff.png')";
			}
			else {
				soundEfectsControl.style.backgroundImage = "url('../resources/Sound/SoundOn.png')";
			}
			return soundEfectsVol;
		case "soundEfectsControl":
			if (soundEfectsControlState) {
				sliderSoundEfects.src  = path + "slider0.png";
				soundEfectsControl.style.backgroundImage = "url('../resources/Sound/SoundOff.png')";
				return false
			}
			else {
				if (soundEfectsVol == 0) {
					sliderSoundEfects.src  = path + "slider25.png";
					soundEfectsControl.style.backgroundImage = "url('../resources/Sound/SoundOn.png')";
					return 25;
				}
				let imaName = path + "slider" + soundEfectsVol+".png";
				sliderSoundEfects.src  = imaName;
				soundEfectsControl.style.backgroundImage = "url('../resources/Sound/SoundOn.png')";
				return true
			}
			return
	}
}
