"use strict";

(function()
{
	window.addEventListener("load", main);
}());

function main(){
	var mainSource=window.parent;
	var left = document.getElementById("left");
	var right = document.getElementById("right");
	var masterEE = document.getElementById("masterEE");
	var exitBtn = document.getElementById("ExitBtn");
	var mainEE = document.getElementById("mainEE");
	var pauloEE = document.getElementById("paulo");
	var seabraEE = document.getElementById("seabra");
	var marquesEE = document.getElementById("marques");
	var popup = document.getElementById('popupStartButton');
	var contentPopup = document.getElementById('popup_contentStartButton');
	var infoEE = document.getElementById('infoEE');
	var pauloInfo = "<br />Paulo Cardoso 14/05/1999<br />Born in Coimbra (Portugal)<br />Data's Hall Developer"
	var marquesInfo = "<br />Miguel Marques 01/01/1999<br /> Born in Viseu (Portugal)<br /> Data's Hall Developer"
	var seabraInfo = "<br />Miguel Seabra 20/03/1999<br /> Born in Guarda (Portugal)<br /> Data's Hall Developer"
	var mainInfo = "3 friend and collegues in the<br /> Computer Science degree<br /> in FCTUC (Coimbra)<br /> aiming to do a great game and<br /> to have a top grade in<br /> this project."
	var actPage = 1;
	var localDataBase = JSON.parse(localStorage.getItem('items'));
	var actUser = localDataBase.actUser;
	selectEasterEggs(actUser,mainEE,marquesEE,pauloEE,seabraEE,popup,contentPopup,infoEE,pauloInfo,marquesInfo,seabraInfo,mainInfo,masterEE)
	left.style.visibility='hidden'
	right.style.visibility='hidden'

	exitBtn.onclick = function() {
        mainSource.postMessage('MainMenu.html', '*');
    }

	window.onclick = function(ev) {
        if (ev.target == popup) {
            popup.style.display = "none";
			left.style.visibility='hidden'
			right.style.visibility='hidden'
			infoEE.innerHTML = "";
        }
    }

	masterEE.addEventListener("click",function (ev){
		playSlide(contentPopup,actPage,popup,infoEE,left,right)
	});


}

function playSlide(contentPopup,actPage,popup,infoEE,left,right)
{
	infoEE.innerHTML = "<span style='padding-left:80px;'>Data's Hall Art Bonus</span>";
	contentPopup.style.backgroundSize = "750px ";
	contentPopup.style.backgroundImage = "url('../resources/masterEE/"+actPage+".jpg')";
	left.style.visibility='visible'
	right.style.visibility='visible'

	popup.style.display = "block";
	left.addEventListener("click",function (ev){
		if (actPage > 1) {
			actPage--;
			contentPopup.style.backgroundSize = "750px ";
			contentPopup.style.backgroundImage = "url('../resources/masterEE/"+actPage+".jpg')";
		}
	});
	right.addEventListener("click",function (ev){
		if (actPage < 8) {
			actPage++;
			contentPopup.style.backgroundSize = "750px ";
			contentPopup.style.backgroundImage = "url('../resources/masterEE/"+actPage+".jpg')";
		}
	});
}
function selectEasterEggs(actUser,mainEE,marquesEE,pauloEE,seabraEE,popup,contentPopup,infoEE,pauloInfo,marquesInfo,seabraInfo,mainInfo,masterEE) {
	let count = 0;
	if (actUser.EasterEgg0) {
		pauloEE.addEventListener("mouseout", mouveOutPicTrue);
		pauloEE.addEventListener("click", clickPicTrue);
		pauloEE.addEventListener("mouseover", mouveOverPicTrue);
		count++;
	}
	else {
		pauloEE.style.opacity = 0;
		pauloEE.addEventListener("mouseout", mouveOutPicFalse);
		pauloEE.addEventListener("mouseover", mouveOverPicFalse);
		pauloEE.addEventListener("click", clickPicFalse);
	}
	if (actUser.EasterEgg1) {
		seabraEE.addEventListener("mouseout", mouveOutPicTrue);
		seabraEE.addEventListener("click", clickPicTrue);
		seabraEE.addEventListener("mouseover", mouveOverPicTrue);
		count++;
	}
	else {
		seabraEE.style.opacity = 0;
		seabraEE.addEventListener("mouseout", mouveOutPicFalse);
		seabraEE.addEventListener("mouseover", mouveOverPicFalse);
		seabraEE.addEventListener("click", clickPicFalse);
	}
	if (actUser.EasterEgg2) {
		marquesEE.addEventListener("mouseout", mouveOutPicTrue);
		marquesEE.addEventListener("click", clickPicTrue);
		marquesEE.addEventListener("mouseover", mouveOverPicTrue);
		count++;
	}
	else {
		marquesEE.style.opacity = 0;
		marquesEE.addEventListener("mouseout", mouveOutPicFalse);
		marquesEE.addEventListener("mouseover", mouveOverPicFalse);
		marquesEE.addEventListener("click", clickPicFalse);
	}
	if (actUser.EasterEgg3) {
		mainEE.addEventListener("mouseout", mouveOutPicTrue);
		mainEE.addEventListener("click", clickPicTrue);
		mainEE.addEventListener("mouseover", mouveOverPicTrue);
		count++;
	}
	else {
		mainEE.style.opacity = 0;
		mainEE.addEventListener("mouseout", mouveOutPicFalse);
		mainEE.addEventListener("click", clickPicFalse);
		mainEE.addEventListener("mouseover", mouveOverPicFalse);
	}
	console.log(count);
	if (count != 4) {
		masterEE.style.visibility='hidden'
	}

	function clickPicTrue(ev){
		showinfoTrue(ev,mainEE,marquesEE,pauloEE,seabraEE,popup,contentPopup,infoEE,pauloInfo,marquesInfo,seabraInfo,mainInfo)
	}
	function clickPicFalse(ev){
		showinfoFalse(ev,mainEE,marquesEE,pauloEE,seabraEE,popup,contentPopup,infoEE,pauloInfo,marquesInfo,seabraInfo,mainInfo)
	}

}

function showinfoFalse(ev,mainEE,marquesEE,pauloEE,seabraEE,popup,contentPopup,infoEE,pauloInfo,marquesInfo,seabraInfo,mainInfo){

	contentPopup.style.backgroundImage = "url('../resources/City_Skyline.png')";
	switch (ev.currentTarget) {
		case marquesEE:
			infoEE.innerHTML = "<br /><br />UNLOCK LEVEL 2 EASTER EGG";
			break;
		case pauloEE:
			infoEE.innerHTML = "<br /><br />UNLOCK LEVEL 0 EASTER EGG";;
			break;
		case seabraEE:
			infoEE.innerHTML = "<br /><br />UNLOCK LEVEL 1 EASTER EGG";;
			break;
		case mainEE:
			infoEE.innerHTML = "<br /><br />UNLOCK LEVEL 3 EASTER EGG";;
			break;
	}
	popup.style.display = "block";
}

function showinfoTrue(ev,mainEE,marquesEE,pauloEE,seabraEE,popup,contentPopup,infoEE,pauloInfo,marquesInfo,seabraInfo,mainInfo){

	switch (ev.currentTarget) {
		case marquesEE:
			contentPopup.style.backgroundImage = "url('../resources/MarquesEE.jpg')";
			infoEE.innerHTML = marquesInfo;
			break;
		case pauloEE:
			contentPopup.style.backgroundImage = "url('../resources/pauloEE.jpg')";
			infoEE.innerHTML = pauloInfo;
			break;
		case seabraEE:
			contentPopup.style.backgroundImage = "url('../resources/SeabraEE.jpg')";
			infoEE.innerHTML = seabraInfo;
			break;
		case mainEE:
			contentPopup.style.backgroundImage = "url('../resources/mainEE.jpg')";
			infoEE.innerHTML = mainInfo;
			break;
	}
	popup.style.display = "block";
}
function mouveOutPicTrue(ev){
	ev.currentTarget.style.opacity = 1;
}
function mouveOutPicFalse(ev){
	ev.currentTarget.style.opacity = 0;
}
function mouveOverPicFalse(ev){
	ev.currentTarget.style.opacity = 0.1;
}
function mouveOverPicTrue(ev){
	ev.currentTarget.style.opacity = 0.7;
}
