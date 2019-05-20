"use strict";

(function()
{
	window.addEventListener("load", main);
}());

var mainSource=window.parent;
function main(){
    var namesLevel = ["A new start and a new Friend","Remeber who the costumer is...","Here comes the cowboy","It's up to you now..."];
    var slot1 = document.getElementById('slot1');
    var slot2 = document.getElementById('slot2');
    var slot3 = document.getElementById('slot3');

	var popup = document.getElementById('popupStartButton');
	var exitBtn = document.getElementById("ExitBtn");
	var continueBtn = document.getElementById('Continue');
	var deleteBtn = document.getElementById("Delete");
	var localDataBase = JSON.parse(localStorage.getItem('items'));
    var level0 = document.getElementById('Level0');
    var level1 = document.getElementById('Level1');
    var level2 = document.getElementById('Level2');
    var level3 = document.getElementById('Level3');
    var continueElem = document.getElementById('Continue');
    var deleteElem = document.getElementById('Delete');
    var name = document.getElementById('name');
    var startDate = document.getElementById('startDate');
	var overallTime = document.getElementById('overallTime');
	var overallSwitch = document.getElementById('overallSwitch');

    var levelImg = document.getElementById('levelImg');
    var levelName = document.getElementById('levelName');

	function loadUser(ev){
		switch (ev.currentTarget.id){
			case 'slot1':
			managePopup(localDataBase.slotLoad1,level0,level1,level2,level3,levelName,name,startDate,levelImg,namesLevel,deleteElem,popup,localDataBase,slot1,slot2,slot3,loadUser,continueBtn,overallTime,overallSwitch);
			break;
			case 'slot2':
			managePopup(localDataBase.slotLoad2,level0,level1,level2,level3,levelName,name,startDate,levelImg,namesLevel,deleteElem,popup,localDataBase,slot1,slot2,slot3,loadUser,continueBtn,overallTime,overallSwitch);
			break;
			case 'slot3':
			managePopup(localDataBase.slotLoad3,level0,level1,level2,level3,levelName,name,startDate,levelImg,namesLevel,deleteElem,popup,localDataBase,slot1,slot2,slot3,loadUser,continueBtn,overallTime,overallSwitch);
			break;
		}
		popup.style.display = "block";
	}

	slot1.addEventListener("click",loadUser);
	slot2.addEventListener("click",loadUser);
	slot3.addEventListener("click",loadUser);

	update(localDataBase,slot1,slot2,slot3,loadUser);

	exitBtn.onclick = function() {
		mainSource.postMessage('MainMenu.html', '*');
    }
	window.onclick = function(ev) {
        if (ev.target == popup) {
            popup.style.display = "none";
        }
    }
}

function managePopup(slot,level0,level1,level2,level3,levelName,name,startDate,levelImg,namesLevel,deleteElem,popup,localDataBase,slot1,slot2,slot3,loadUser,continueBtn,overallTime,overallSwitch){
    name.innerHTML = slot.name;
    startDate.innerHTML = slot.date;



	overallTime.innerHTML = "Time Counter : "+ Math.round((slot.level0Time+slot.level1Time+slot.level2Time+slot.level3Time) * 100) / 100+"s"
	overallSwitch.innerHTML = "Switch flips Overall: "+(slot.level0Switch+slot.level1Switch+slot.level2Switch+slot.level3Switch)
	if (slot.level > 3) {
		levelImg.src = "../resources/Level3.png"
		levelName.innerHTML = namesLevel[3];
	}
	else {
		levelName.innerHTML = namesLevel[slot.level];
		levelImg.src = "../resources/Level"+slot.level+".png"
	}

	continueBtn.onclick = function() {
		localDataBase.actUser = slot;
		localDataBase.userName = slot.name
		mainSource.postMessage('../level/HTML/Level'+slot.level+'.html', '*');
		localStorage.setItem('items',JSON.stringify(localDataBase));
    }
    switch (slot.level) {
        case 0:
			level0.style.color = "#3c75ad";
			level1.style.color = "#ffffff";
			level2.style.color = "#ffffff";
			level3.style.color = "#ffffff";
			enableButton(level0);
            disableButton(level1);
            disableButton(level2);
            disableButton(level3);
            break;
        case 1:
            level0.style.color = "Yellow";
			level1.style.color = "#3c75ad";
			level2.style.color = "#ffffff";
			level3.style.color = "#ffffff";
			enableButton(level0);
			enableButton(level1);
            disableButton(level2);
            disableButton(level3);
            break;
        case 2:
            level0.style.color = "Yellow";
            level1.style.color = "Yellow";
			level2.style.color = "#3c75ad";
			level3.style.color = "#ffffff";
			enableButton(level0);
			enableButton(level1);
			enableButton(level2);
            disableButton(level3);
            break;
        case 3:
			enableButton(level0);
			enableButton(level1);
			enableButton(level2);
			enableButton(level3);
            level0.style.color = "Yellow";
            level1.style.color = "Yellow";
            level2.style.color = "Yellow";
			level3.style.color = "#3c75ad";
            break;
        default:
            level0.style.color = "Yellow";
            level1.style.color = "Yellow";
            level2.style.color = "Yellow";
            level3.style.color = "Yellow";
            break;

    }
	deleteElem.addEventListener("click", deleteLoad);
	function deleteLoad(ev){
		removeLoad(slot,localDataBase,slot1,slot2,slot3,localStorage,popup,loadUser)
	}
	level0.addEventListener("mouseout", mouseOutLevels);
    level1.addEventListener("mouseout", mouseOutLevels);
    level2.addEventListener("mouseout", mouseOutLevels);
    level3.addEventListener("mouseout", mouseOutLevels);

	level0.addEventListener("click", clickZero);
    level1.addEventListener("click", clickOne);
    level2.addEventListener("click", clickTwo);
    level3.addEventListener("click", clickThree);

	function clickZero(ev){
		localDataBase.actUser = slot;
		localDataBase.userName = slot.name
		localDataBase.actUser.levelSelected = 0
		localStorage.setItem('items',JSON.stringify(localDataBase));
		mainSource.postMessage('../level/HTML/Level0.html', '*');
	}
	function clickOne(ev){
		localDataBase.actUser = slot;
		localDataBase.userName = slot.name
		localDataBase.actUser.levelSelected = 1
		localStorage.setItem('items',JSON.stringify(localDataBase));
		mainSource.postMessage('Question1.html', '*');
		//mainSource.postMessage('../level/HTML/Level1.html', '*');
	}
	function clickTwo(ev){
		localDataBase.actUser = slot;
		localDataBase.userName = slot.name
		localDataBase.actUser.levelSelected = 2
		localStorage.setItem('items',JSON.stringify(localDataBase));
		mainSource.postMessage('Question2.html', '*');
		//mainSource.postMessage('../level/HTML/Level2.html', '*');
	}
	function clickThree(ev){
		localDataBase.actUser = slot;
		localDataBase.userName = slot.name
		localDataBase.actUser.levelSelected = 3
		localStorage.setItem('items',JSON.stringify(localDataBase));
		mainSource.postMessage('../level/HTML/Level3.html', '*');
	}


	function mouseOutLevels(ev){
		levelImg.src = "../resources/Level"+ slot.level +".png";
		levelName.innerHTML = namesLevel[slot.level ];
		overallTime.innerHTML = "Time Counter : "+ Math.round((slot.level0Time+slot.level1Time+slot.level2Time+slot.level3Time) * 100) / 100+"s"
		overallSwitch.innerHTML = "Switch flips Overall: "+(slot.level0Switch+slot.level1Switch+slot.level2Switch+slot.level3Switch)
	}
	level0.addEventListener("mouseover", mouseOverLevels);
    level1.addEventListener("mouseover", mouseOverLevels);
    level2.addEventListener("mouseover", mouseOverLevels);
    level3.addEventListener("mouseover", mouseOverLevels);

    function mouseOverLevels(ev){
        switch (ev.currentTarget){
            case level0:
                if (level0.disabled == false) {
                    levelImg.src = "../resources/Level0.png"
                    levelName.innerHTML = namesLevel[0];
					overallTime.innerHTML = "Time Level 0 : "+ Math.round(slot.level0Time * 100) / 100+"s"
					overallSwitch.innerHTML = "Switch flips Level 0: "+slot.level0Switch

				}
                break;
            case level1:
                if (level1.disabled == false) {
                    levelImg.src = "../resources/Level1.png"
                    levelName.innerHTML = namesLevel[1];
					overallTime.innerHTML = "Time Level 1 : "+ Math.round(slot.level1Time * 100) / 100+"s"
					overallSwitch.innerHTML = "Switch flips Level 1: "+slot.level1Switch
                }
                break;
            case level2:
                if (level2.disabled == false) {
                    levelImg.src = "../resources/Level2.png"
                    levelName.innerHTML = namesLevel[2];
					overallTime.innerHTML = "Time Level 2 : "+ Math.round(slot.level2Time * 100) / 100+"s"
					overallSwitch.innerHTML = "Switch flips Level 2: "+slot.level2Switch
                }
                break;
            case level3:
                if (level3.disabled == false) {
                    levelImg.src = "../resources/Level3.png"
                    levelName.innerHTML = namesLevel[3];
					overallTime.innerHTML = "Time Level 3 : "+ Math.round(slot.level3Time * 100) / 100+"s"
					overallSwitch.innerHTML = "Switch flips Level 3: "+slot.level3Switch
                }
                break;
        }
    }
}
function removeLoad(slot,localDataBase,slot1,slot2,slot3,localStorage,popup,loadUser){
	switch (slot) {
		case localDataBase.slotLoad1:
			localDataBase.slotLoad1 = null;
			break;
		case localDataBase.slotLoad2:
			localDataBase.slotLoad2 = null;
			break;
		case localDataBase.slotLoad3:
			localDataBase.slotLoad3 = null;
			break;
	}
	localDataBase.userName = "None";
	update(localDataBase,slot1,slot2,slot3,loadUser);
	popup.style.display = "none";
	localStorage.setItem('items',JSON.stringify(localDataBase));
}

function disableButton(b) {
    b.disabled  = true;
    b.style.cursor = "initial"
}

function enableButton(b) {
    b.disabled  = false;
    b.style.cursor = "pointer"
}
function imgLoaded(ev)
{
	var img = ev.target;
}
function update(localDataBase,slot1,slot2,slot3,loadUser){
    if (localDataBase.slotLoad1 == null) {
		slot1.removeEventListener("click",loadUser);
        slot1.innerHTML="Empty";
    }
    else {
        slot1.innerHTML = localDataBase.slotLoad1.name + localDataBase.slotLoad1.date;
    }
    if (localDataBase.slotLoad2 == null) {
		slot2.removeEventListener("click",loadUser);
        slot2.innerHTML="Empty";
    }
    else {
        slot2.innerHTML = localDataBase.slotLoad2.name + localDataBase.slotLoad2.date;
    }
    if (localDataBase.slotLoad3 == null) {
		slot3.removeEventListener("click",loadUser);
        slot3.innerHTML="Empty";
    }
    else {
        slot3.innerHTML = localDataBase.slotLoad3.name + localDataBase.slotLoad3.date;
    }
    var startImg = new Image();
	startImg.addEventListener("load", imgLoaded);
	startImg.src = "../resources/City_Skyline.png";
	var aux = document.getElementById("popup_contentStartButton").style.backgroundImage;
	aux = startImg;
}
