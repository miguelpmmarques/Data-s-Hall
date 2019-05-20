"use strict";

(function()
{
	window.addEventListener("load", main);
}());

function main(){
	var mainSource=window.parent;
	var exitBtn = document.getElementById("ExitBtn");


	exitBtn.onclick = function() {
        mainSource.postMessage('MainMenu.html', '*');
    }
}
