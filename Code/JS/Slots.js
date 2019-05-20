"use strict";

class Slots
{
	constructor(name,date,level,totaltime,index)
	{
        this.name = name;
        this.date = date;
        this.level = level;
		this.levelSelected = 0;
        this.totaltime = totaltime;
		this.EasterEgg0 = false;
		this.EasterEgg1 = false;
		this.EasterEgg2 = false;
		this.EasterEgg3 = false;
		this.index = 0;
		this.level0Time = 0;
		this.level1Time = 0;
		this.level2Part1Time = 0;
		this.level2Time = 0;
		this.level3Time = 0;
		this.totalSwitch = 0;
		this.level0Switch = 0;
		this.level1Switch = 0;
		this.level2Switch = 0;
		this.level3Switch = 0;
		this.question1 = null;
		this.question2 = null;
		this.question3 = null;
	}
}
