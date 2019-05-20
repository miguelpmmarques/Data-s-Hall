var game = new Phaser.Game(2400,1300, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

//look left
//follow
var switchFlips = 0;
function preload(){
    game.load.image('loading','../assets/loading.png');
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.startSystem(Phaser.Physics.P2JS);

}
function start(){
    game.load.image('level', '../assets/level2Part2.png');
    game.load.image('ground', '../assets/platform.png');
    game.load.spritesheet('dark','../assets/dark1.png',45,21);
    game.load.image('HackPoint','../assets/HackPoint.png');
    game.load.spritesheet('elevator', '../assets/elevator.png', 120,165);
    game.load.spritesheet('spider', '../assets/spider.png',30, 18);
    game.load.spritesheet('door', '../assets/door.png',24, 159);
    game.load.spritesheet('box','../assets/box.png',66,90);
    game.load.spritesheet('camera', '../assets/securityCamera.png',963,201);
    game.load.spritesheet('player', '../assets/player.png',51, 105);
    game.load.spritesheet('powerSource', '../assets/power source.png',60, 60);
    game.load.spritesheet('switch', '../assets/switch(36x24).png',36, 24);
    game.load.spritesheet('wire', '../assets/wire(21x12).png',21, 12);
    game.load.spritesheet('lamp', '../assets/lamp(60x60).png',60, 60);
    game.load.spritesheet('and', '../assets/AND(51x30).png',51, 30);
    game.load.spritesheet('or', '../assets/OR(51x30).png',51, 30);
    game.load.spritesheet('not','../assets/Not.png',45,21);
    game.load.spritesheet('loot','../assets/lootbox(69x108).png',69,108);
    game.load.spritesheet('easterEgg','../assets/easterEgg(27x24).png',27,24);
    game.load.spritesheet('robo','../assets/Robo_punk_street.png',120,138);
    game.load.spritesheet('energyball','../assets/energy_ball.png',90,60);
    game.load.spritesheet('questionMark','../assets/QuestionMark.png',36,54);
    game.load.spritesheet('exclamationPoint','../assets/Exclamation.png',18,48);
    game.load.image('screen','../assets/pcScreen.png');
    game.load.image('laptop','../assets/laptop.png');
    // HACKER MODE
    game.load.script('BlurX', '../assets/BlurX.js');
    game.load.script('BlurY', '../assets/BlurY.js');
    game.load.script('gray', '../assets/filter.js');
    //MENU
    game.load.spritesheet('HelpMenu','../assets/HelpMenu.png',1300,675);
    game.load.spritesheet('soundGame','../assets/soundGame.png',36,54);
    game.load.spritesheet('exitGame','../assets/exitGame.png',36,54);
    game.load.spritesheet('resetGame','../assets/resetGame.png',36,54);
    game.load.spritesheet('pauseGame','../assets/pauseGame.png',36,54);
    game.load.audio('soundtrack', '../assets/soundtrack2.mp3');
    game.load.audio('soundtrackH', '../assets/soundtrack2H.mp3');

    // SOUNDTRACK
    game.load.audio('soundtrack', '../assets/soundtrack0.mp3');
    game.load.audio('soundtrackH', '../assets/soundtrack0H.mp3');
    game.load.audio('energyOn','../assets/energyOn.wav');
    game.load.audio('energyOff','../assets/energyOff.wav');
    game.load.audio('swordSlash','../assets/swordSlash.wav');
    game.load.audio('energyShot','../assets/energyShot.wav');
    game.load.audio('dieSound','../assets/die.wav');
    game.load.audio('lazerSound','../assets/lazer.wav');
    game.load.audio('elevatorSound','../assets/elevator.wav');
    game.load.audio('switchFlipOn','../assets/switchFlipOn.wav');
    game.load.audio('switchFlipOff','../assets/switchFlipOff.wav');
    game.load.audio('lightsOn','../assets/lightsOn.wav');
    game.load.audio('doorUnlock','../assets/doorUnlock.wav');
    game.load.audio('doorLock','../assets/doorlock.wav');
    game.load.audio('spiderJump','../assets/spiderJump.wav');
    game.load.audio('explosion','../assets/som.wav');

    game.load.start();
}

function loadStart(){
    //loading = new Loading(250,100, 700, 100);
    loading = new Loading(-700,-800, -300, -800);
}

function fileComplete(){
    loading.update();
}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@--Create--@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
function create(){
    loaded = false;

    game.load.onFileComplete.add(fileComplete, this);
    game.load.onLoadStart.add(loadStart, this);
    game.load.onLoadComplete.add(loadComplete, this);

    start();

    function loadComplete(){
        loaded = true;
        loading.sprite.alpha = 0;
        loading.sprite2.alpha = 0;
        game.camera.setSize(1300,675);
        game.camera.bounds.width = 2000;
        game.camera.bounds.height = 2000;
        game.camera.bounds.y = 0;

        background = game.add.sprite(0, -100, 'level');
        background.smoothed = false
        background.scale.setTo(3,3)
        background.autoColl = true;



        platforms = new Walls();
        burstPlatforms = new BurstPlatforms();

        // MAP ELEMENTS//faltam os burst jumps
        platforms.addWall(0      ,590,10,1);
        platforms.addWall(0      ,342,4.4,0.2);
        platforms.addWall(0      ,377,20,0.1);
        platforms.addWall(2635   ,80,0.01,80);
        platforms.addWall(770   ,340,0.05,3.2);
        platforms.addWall(170   ,50,0.05,50);
        platforms.addWall(980   ,90,0.08,8);
        platforms.addWall(1580   ,90,0.08,4);
        platforms.addWall(1770, 295, 0.05,1.7);
        platforms.addWall(1620   ,347,0.05,1.3);

        localDataBase = JSON.parse(localStorage.getItem('items'));
        hasEasterEgg = localDataBase.actUser.EasterEgg2;

        gray = game.add.filter('Gray');
        blurX = game.add.filter('BlurX');
        blurY = game.add.filter('BlurY');
        blurX.blur = 10;
        blurY.blur = 10;

        // Game Elements
        GameElements    = new Array();
        zeroHackPoint   = new HackPoint(1717,540,true);
        secondHackPoint = new HackPoint(1000,520,true);
        firstHackPoint  = new HackPoint(1120,290,true);
        thirdHackPoint  = new HackPoint(500,290,true);
        elevator2       = new Elevator(850, 177,850,426, false, -1);
        elevator3       = new Elevator(200, 177,200,426, true, 1);
        secondDoor      = new Door(767, 433, false, false);
        elevator        = new Elevator(1420, 177,1420,426, false, -1);
        spider          = new Spider(2000,400,false);
        player          = new Player(1800,440, true); //2200,440
        player.lookingDirection = -1
        player.makeIdle()
        player.ownSpider = true
        spider.makeIdle()
        if (!hasEasterEgg) {
            easterEgg       = new EasterEgg(1640,347,false,0);
        }
        hide            = new HiddenZone(1620,347,false,2.6,1.7);


        
        // CutScenes
        EntryTalk = new Talk([1780,200, 270,3000],[
            new ScriptAction(player, "*offAll",null,null,null,0.1),
            new ScriptAction(spider, null,null,1580,null,2),
            new ScriptAction(spider, "That key must be in here somewhere.",[-300,0],null,null,2),
            new ScriptAction(player, "Good.", [-30,-70], 1700, null,1),
            new ScriptAction(player, "I love a good treasure hunt.", [-300,-70], null, null,2),
            new ScriptAction(spider, "*off",null,null,null,0.1),
            new ScriptAction(player, "*setCam",null,null,null,0.1)
        ])

        meetingRoom = new Talk([300, 400, 500,500],[
            new ScriptAction(player,"*tp",[400,500],null,null,0.1),
            new ScriptAction(player,"*offAll",null,400,null,2),
            new ScriptAction(player,"Well, that's inconspicuous.",[15,-45],null,null,2),
            new ScriptAction(spider, "They're not really trying to hide it.", [-10,20],null,null,2),
            new ScriptAction(player, "That's the most advanced A.I. I've ever seen.", [15,-45],null,null,2),
            new ScriptAction(player, "I wonder what dataset they use to train it.", [15,-45],null,null,2)
        ])



        workOfficeTalk = new Talk(null, [
            new ScriptAction(player,"*tp",[600,320],null,null,0.1),
            new ScriptAction(player,"Damn it, of course they are!",[15,-45],null,null,2),
            new ScriptAction(player,"This database...",[15,-45],null,null,2),
            new ScriptAction(player,"It's connected to every Data's Hall User!",[15,-45],null,null,2),
            new ScriptAction(spider,"Getting brighter I see.", [-10,20],null,null,2),
        ])
        
        privateOfficeTalk = new Talk(null, [
            new ScriptAction(player, "*offAll",null,null,null,0.1),
            new ScriptAction(player,"*tp",[1300,300],null,null,0.1),
            new ScriptAction(spider,"Do you have it?",[-10,20],null,null,2),
            new ScriptAction(player,"Yeah I got the key...",[15,-25],null,null,2),
            new ScriptAction(player,"Whatever is going on in here...",[15,-25],1300,null,3),
            new ScriptAction(player,"Seems to be on the top floor.",[15,-25],null,null,3),
            new ScriptAction(player,"Something about a project 2501...",[15,-25],null,null,3),
        ])
        
        endingTalk = new Talk(null, [
            new ScriptAction(player, "*tp", [1780,560], null,null,0.1),
            new ScriptAction(player,"*offAll",null,null,null,0.1),
            new ScriptAction(spider, "I think \nI'm picking up steps...",[-80,20],null,null,2),
            new ScriptAction(spider, "!!!",[0,20],null,null,1),
            new ScriptAction(spider, "They know \nsomething's up!",[-60,20],null,null,2),
            new ScriptAction(player,"We're trapped here...",[15,-45],null,null,2),
            new ScriptAction(spider, "Not so fast.",[-30,20],null,null,2),
            new ScriptAction(spider, "Upload me that key. \nI might be able to do \nsomething about this...",[-80,20],null,null,3),
            new ScriptAction(player,"*hack",null,null,null,1),
            new ScriptAction(spider, "It won't be \npretty though.",[-70,-40],3000,null,4)
            
        ])
        
        firstDoor      = new Door(1575, 433, true, false);
        win             = new Level2Part2Win(770,350,18.1,12,endingTalk);
        pcScreen = new HackableTalk(600, 224,"screen",workOfficeTalk , thirdHackPoint,win.two)
        laptop = new HackableTalk(1052, 263,"laptop",privateOfficeTalk , firstHackPoint,win.four)


        player.onwSpider = true;
        win.two.sprite.bringToTop()

        player.sprite.bringToTop()
        spider.sprite.bringToTop()

        priorityObj = []
        soundGame       = new OptionsBtn(100,20,"soundGame")
        exitGame        = new ExitBtn(150,20,"exitGame")
        resetGame       = new ResetBtn(200,20,"resetGame")
        pauseGame       = new PauseBtn(50,20,"pauseGame")
        // Audio
        soundtrack = game.add.audio('soundtrack');
        soundtrackH = game.add.audio('soundtrackH');
        localDataBase = JSON.parse(localStorage.getItem('items'))
        soundtrack.loopFull();
        soundtrackH.loopFull();
        soundtrackH.volume = localDataBase.gameMusicVol/100;
        soundtrack.volume = localDataBase.gameMusicVol/100;
        soundtrackH.mute = true;
        //sound effects
        soundEffectsList=[];
        soundEffectsList.push(energyOn=game.add.audio('switchFlipOn'));
        soundEffectsList.push(energyOff=game.add.audio('switchFlipOff'));
        soundEffectsList.push(swordSlash=game.add.audio('swordSlash'));
        soundEffectsList.push(energyShot=game.add.audio('energyShot'));
        soundEffectsList.push(dieSound=game.add.audio('energyOn'));
        soundEffectsList.push(lazerSound=game.add.audio('lazerSound'));
        soundEffectsList.push(elevatorSound=game.add.audio('elevatorSound'));
        soundEffectsList.push(doorUnlock=game.add.audio('doorUnlock'));
        soundEffectsList.push(doorLock=game.add.audio('doorLock'));
        soundEffectsList.push(spiderJump=game.add.audio('spiderJump'));
        soundEffectsList.push(explosion=game.add.audio('explosion'));
        energyOn.volume= localDataBase.gameMusicVol/100;
        energyOff.volume= localDataBase.gameMusicVol/100;
        swordSlash.volume= localDataBase.gameMusicVol/100;
        energyShot.volume= localDataBase.gameMusicVol/100;
        dieSound.volume= localDataBase.gameMusicVol/100;
        lazerSound.volume=localDataBase.gameMusicVol/200;
        elevatorSound.volume=localDataBase.gameMusicVol/200;
        doorUnlock.volume=localDataBase.gameMusicVol/100;
        doorLock.volume=localDataBase.gameMusicVol/100;
        spiderJump.volume=localDataBase.gameMusicVol/100;
        explosion.volume=localDataBase.soundEfectsVol/100;

        // FIRST HACK
        powerSourceOneH1  = new PowerSource(1540,180)
        wires1H1 = new Wiring(true);
        wires1H1.addWire(1593,240,4,90,1.5,1);
        wires1H1.addWire(1563,240,4,90,1.5,1);
        switchOneH1       = new Switch(1573,260,true,90);
        switchTwoH1       = new Switch(1603,260,false,90);
        powerSourceOneH1.setOutput(switchOneH1)
        powerSourceOneH1.setOutput(switchTwoH1)
        orOneH1  = new Or(1538,287,false,0)
        switchOneH1.setOutput(orOneH1.halfOrR);
        switchTwoH1.setOutput(orOneH1.halfOrL);
        wires2H1 = new Wiring(true);

        wires2H1.addWire(1565,350,4,90,1,1);
        wires2H1.addWire(1595,350,4,90,4.1,1);
        wires2H1.addWire(1558, 343, 4, 0 , 1.2,1);
        wires2H1.addWire(1580, 322, 4, 90 , 1.3,1);
        wires2H1.addWire(1572, 358, 3,180 , 1,1);
        wires2H1.addWire(1580, 364, 3,-90 , 1,1);

        orOneH1.wires = wires2H1;
        notOneH1          = new Not(1567,365,false,90)
        orOneH1.setOutput(secondDoor);
        orOneH1.setOutput(notOneH1);
        orOneH1.setOutput(firstDoor);
        wires3H1 = new Wiring(true);
        wires3H1.addWire(1563,410,5,90,1,1);
        wires3H1.addWire(1542,425,2,0,1,1);
        wires3H1.addWire(1488,425,5,0,2.8,1);

        notOneH1.wires = wires3H1;
        notOneH1.setOutput(elevator);

        zeroHackPoint.addHackObject(powerSourceOneH1)
        zeroHackPoint.addHackObject(switchOneH1)
        zeroHackPoint.addHackObject(switchTwoH1)
        zeroHackPoint.addHackObject(orOneH1)
        zeroHackPoint.addHackObject(notOneH1)
        zeroHackPoint.addHackObject(wires1H1)
        zeroHackPoint.addHackObject(wires2H1)
        zeroHackPoint.addHackObject(wires3H1)
        zeroHackPoint.addGameElements(firstDoor)
        zeroHackPoint.addGameElements(elevator)

        //second Hack
        powerSourceOneH2  = new PowerSource(600,650)
        switchLeftH2       = new Switch(603,695,true,180);
        switchRightH2       = new Switch(657,662,true, 0);
        powerSourceOneH2.setOutput(switchLeftH2)
        powerSourceOneH2.setOutput(switchRightH2)

        leftWiresH2 = new Wiring(true)
        leftWiresH2.addWire(573,590, 4, 90, 7,1)
        leftWiresH2.addWire(572,737, 4, 0 ,7.4,1)
        leftWiresH2.addWire(740, 593, 4, 90 ,7,1)
        leftWiresH2.addWire(573,730, 3, 90, 1,1)
        leftWiresH2.addWire(719,737, 3, 0, 1,1)
        switchLeftH2.wires = leftWiresH2

        rightWiresH2 = new Wiring(true)
        rightWiresH2.addWire(704,575, 4, 90, 5,1)
        rightWiresH2.addWire(683,671, 3, 0, 1,1)
        rightWiresH2.addWire(610,613, 4, 0, 4,1)
        rightWiresH2.addWire(610,590, 4, 90, 1.1,1)
        rightWiresH2.addWire(610,606, 3, 90, 1,1)
        switchRightH2.wires = rightWiresH2

        leftAndH2 = new And(550, 560 , true, 0)
        rightAndH2 = new And(680, 560 , true, 0)

        switchLeftH2.setOutput(leftAndH2.halfAndL)
        switchLeftH2.setOutput(rightAndH2.halfAndR)
        switchRightH2.setOutput(leftAndH2.halfAndR)
        switchRightH2.setOutput(rightAndH2.halfAndL)

        midWiresLH2 = new Wiring(true)
        midWiresLH2.addWire(590, 535, 4, 90 ,1.5,1)
        midWiresLH2.addWire(596, 535, 3, 180 ,1,1)
        midWiresLH2.addWire(642, 485, 4, 90 ,1.8,1)
        midWiresLH2.addWire(590, 520, 4, 0 ,1.8,1)
        midWiresLH2.addWire(620, 520, 3, 0 ,1,1)

        midWiresRH2 = new Wiring(true)
        midWiresRH2.addWire(720, 535, 4, 90 ,1.5,1)
        midWiresRH2.addWire(705, 543, 3, -90 ,1,1)
        midWiresRH2.addWire(670, 485, 4, 90 ,1.8,1)
        midWiresRH2.addWire(670, 520, 4, 0 ,1.8,1)
        midWiresRH2.addWire(670, 514, 3, 90 ,1,1)
        leftAndH2.wires = midWiresLH2
        rightAndH2.wires = midWiresRH2
        orH2 = new Or(615, 460, true , 0)
        leftAndH2.setOutput(orH2.halfOrL)
        rightAndH2.setOutput(orH2.halfOrR)

        notH2 = new Not(655,425,false,0)

        orH2.setOutput(notH2)

        singleWireH2 = new Wiring(true)
        singleWireH2.addWire(657, 445, 4, 90 ,1,1)
        singleWireH2.addWire(663, 445, 3, 180 ,1,1)
        orH2.wires = singleWireH2

        outputsWiresH2 = new Wiring(false)

        outputsWiresH2.addWire(700, 430, 5, 0 ,4,1)
        outputsWiresH2.addWire(760, 425, 5, 90 ,0.5,1)
        outputsWiresH2.addWire(767, 430, 2, 180 ,1,1)
        outputsWiresH2.addWire(760, 415, 5, 0 ,5.5,1)
        outputsWiresH2.addWire(875, 437, 2, -90 ,1,1)
        notH2.wires = outputsWiresH2
        notH2.setOutput( secondDoor)
        notH2.setOutput( elevator2)

        secondHackPoint.addHackObject(powerSourceOneH2)
        secondHackPoint.addHackObject(switchLeftH2)
        secondHackPoint.addHackObject(switchRightH2)
        secondHackPoint.addHackObject(leftWiresH2)
        secondHackPoint.addHackObject(rightWiresH2)
        secondHackPoint.addHackObject(leftAndH2)
        secondHackPoint.addHackObject(rightAndH2)
        secondHackPoint.addHackObject(midWiresLH2)
        secondHackPoint.addHackObject(midWiresRH2)
        secondHackPoint.addHackObject(orH2)
        secondHackPoint.addHackObject(notH2)
        secondHackPoint.addHackObject(singleWireH2)
        secondHackPoint.addHackObject(outputsWiresH2)
        secondHackPoint.addGameElements(secondDoor)
        secondHackPoint.addGameElements(elevator2)

        //third hack

        powerSourceOneH3  = new PowerSource(600,550)
        switchLeftH3       = new Switch(603,595,true,180);
        switchRightH3       = new Switch(657,562,true, 0);
        oneNotH3 = new Not(630,635,false,0)
        powerSourceOneH3.setOutput(switchLeftH3)
        powerSourceOneH3.setOutput(switchRightH3)
        switchLeftH3.setOutput(oneNotH3)

        leftWiresH3 = new Wiring(true)
        leftWiresH3.addWire(573,490, 4, 90, 7,1)
        leftWiresH3.addWire(572,637, 4, 0 ,3,1)
        leftWiresH3.addWire(573,630, 3, 90, 1,1)
        switchLeftH3.wires = leftWiresH3

        leftTwoWiresH3 = new Wiring(false)
        leftTwoWiresH3.addWire(670, 637, 5,0,3,1 )
        leftTwoWiresH3.addWire(740, 493, 5, 90 ,7,1)
        leftTwoWiresH3.addWire(719,637, 2, 0, 1,1)
        oneNotH3.wires = leftTwoWiresH3



        rightWiresH3 = new Wiring(true)
        rightWiresH3.addWire(704,475, 4, 90, 5,1)
        rightWiresH3.addWire(683,571, 3, 0, 1,1)
        rightWiresH3.addWire(672,513, 4, 0, 1,1)

        twoNotH3 = new Not(630,510,false,0)
        switchRightH3.setOutput(twoNotH3)
        switchRightH3.wires = rightWiresH3

        rightTwoWiresH3 = new Wiring(false)
        rightTwoWiresH3.addWire(610,513, 5, 0, 1,1)
        rightTwoWiresH3.addWire(610,490, 5, 90, 1.1,1)
        rightTwoWiresH3.addWire(610,506, 2, 90, 1,1)
        twoNotH3.wires = rightTwoWiresH3

        leftAndH3 = new And(550, 460 , false, 0)
        rightAndH3 = new And(680, 460 , false, 0)

        switchLeftH3.setOutput(leftAndH3.halfAndL)
        oneNotH3.setOutput(rightAndH3.halfAndR)
        twoNotH3.setOutput(leftAndH3.halfAndR)
        switchRightH3.setOutput(rightAndH3.halfAndL)

        midWiresLH3 = new Wiring(false)
        midWiresLH3.addWire(590, 435, 5, 90 ,1.5,1)
        midWiresLH3.addWire(596, 435, 2, 180 ,1,1)
        midWiresLH3.addWire(642, 385, 5, 90 ,1.8,1)
        midWiresLH3.addWire(590, 420, 5, 0 ,1.8,1)
        midWiresLH3.addWire(620, 420, 2, 0 ,1,1)

        midWiresRH3 = new Wiring(false)
        midWiresRH3.addWire(720, 435, 5, 90 ,1.5,1)
        midWiresRH3.addWire(705, 443, 2, -90 ,1,1)
        midWiresRH3.addWire(670, 385, 5, 90 ,1.8,1)
        midWiresRH3.addWire(670, 420, 5, 0 ,1.8,1)
        midWiresRH3.addWire(670, 414, 2, 90 ,1,1)
        leftAndH3.wires = midWiresLH3
        rightAndH3.wires = midWiresRH3
        orH3 = new Or(615, 360, false , 0)
        leftAndH3.setOutput(orH3.halfOrL)
        rightAndH3.setOutput(orH3.halfOrR)


        singleWireH3 = new Wiring(false)
        singleWireH3.addWire(657, 355, 5, 90 ,0.5,1)
        singleWireH3.addWire(664, 355, 2, 180 ,1,1)
        singleWireH3.addWire(657, 340, 5, 0 ,1,1)
        singleWireH3.addWire(684, 280, 5, 90 ,3.2,1)
        singleWireH3.addWire(668, 259, 5, 45 ,1,1)
        singleWireH3.addWire(663, 340, 2, 0 ,1,1)
        singleWireH3.addWire(660, 250, 2, 90 ,1,1)
        orH3.wires = singleWireH3
        orH3.setOutput(pcScreen)

        thirdHackPoint.addHackObject(powerSourceOneH3)
        thirdHackPoint.addHackObject(switchLeftH3)
        thirdHackPoint.addHackObject(switchRightH3)
        thirdHackPoint.addHackObject(oneNotH3)
        thirdHackPoint.addHackObject(leftWiresH3)
        thirdHackPoint.addHackObject(leftTwoWiresH3)
        thirdHackPoint.addHackObject(rightWiresH3)
        thirdHackPoint.addHackObject(twoNotH3)
        thirdHackPoint.addHackObject(rightTwoWiresH3)
        thirdHackPoint.addHackObject(leftAndH3)
        thirdHackPoint.addHackObject(rightAndH3)
        thirdHackPoint.addHackObject(midWiresLH3)
        thirdHackPoint.addHackObject(midWiresRH3)
        thirdHackPoint.addHackObject(orH3)
        thirdHackPoint.addHackObject(singleWireH3)
        thirdHackPoint.addGameElements(pcScreen)

        //fourth hack


        powerSourceOneH4  = new PowerSource(1040,550)
        switchLeftH4       = new Switch(1043,595,true,180);

        oneNotH4 = new Not(1070,635,false,0)
        powerSourceOneH4.setOutput(switchLeftH4)

        switchLeftH4.setOutput(oneNotH4)

        leftWiresH4 = new Wiring(true)
        leftWiresH4.addWire(1013,490, 4, 90, 7,1)
        leftWiresH4.addWire(1012,637, 4, 0 ,3,1)
        leftWiresH4.addWire(1013,630, 3, 90, 1,1)
        switchLeftH4.wires = leftWiresH4

        switchRightH4 = new Switch(1155, 635,false,-90)
        oneNotH4.setOutput(switchRightH4)
        leftTwoWiresH4 = new Wiring(false)
        leftTwoWiresH4.addWire(1110, 637, 5,0,3,1 )
        leftTwoWiresH4.addWire(1159,637, 2, 0, 1,1)
        oneNotH4.wires = leftTwoWiresH4
        leftThreeWiresH4 = new Wiring(true)
        leftThreeWiresH4.addWire(1180, 493, 5, 90 ,5.3,1)
        switchRightH4.wires = leftThreeWiresH4


        rightWiresH4 = new Wiring(true)
        rightWiresH4.addWire(1144,475, 4, 90, 5,1)
        rightWiresH4.addWire(1123,571, 3, 0, 1,1)
        rightWiresH4.addWire(1112,513, 4, 0, 1,1)
        rightWiresH4.addWire(1100,572, 4, 0, 1.4,1)

        twoNotH4 = new Not(1070,510,false,0)
        powerSourceOneH4.setOutput(twoNotH4)
        powerSourceOneH4.wires = rightWiresH4

        rightTwoWiresH4 = new Wiring(false)
        rightTwoWiresH4.addWire(1050,513, 5, 0, 1,1)
        rightTwoWiresH4.addWire(1050,490, 5, 90, 1.1,1)
        rightTwoWiresH4.addWire(1050,506, 2, 90, 1,1)
        twoNotH4.wires = rightTwoWiresH4

        leftAndH4 = new And(990, 460 , false, 0)
        rightAndH4 = new And(1120, 460 , false, 0)

        switchLeftH4.setOutput(leftAndH4.halfAndL)
        switchRightH4.setOutput(rightAndH4.halfAndR)
        twoNotH4.setOutput(leftAndH4.halfAndR)
        powerSourceOneH4.setOutput(rightAndH4.halfAndL)

        midWiresLH4 = new Wiring(false)
        midWiresLH4.addWire(1030, 435, 5, 90 ,1.5,1)
        midWiresLH4.addWire(1036, 435, 2, 180 ,1,1)
        midWiresLH4.addWire(1082, 385, 5, 90 ,1.8,1)
        midWiresLH4.addWire(1030, 420, 5, 0 ,1.8,1)
        midWiresLH4.addWire(1060, 420, 2, 0 ,1,1)

        midWiresRH4 = new Wiring(false)
        midWiresRH4.addWire(1160, 435, 5, 90 ,1.5,1)
        midWiresRH4.addWire(1145, 443, 2, -90 ,1,1)
        midWiresRH4.addWire(1110, 385, 5, 90 ,1.8,1)
        midWiresRH4.addWire(1110, 420, 5, 0 ,1.8,1)
        midWiresRH4.addWire(1110, 414, 2, 90 ,1,1)
        leftAndH4.wires = midWiresLH4
        rightAndH4.wires = midWiresRH4
        orH4 = new Or(1055, 360, false , 0)
        leftAndH4.setOutput(orH4.halfOrL)
        rightAndH4.setOutput(orH4.halfOrR)


        singleWireH4 = new Wiring(false)
        singleWireH4.addWire(1097, 290, 5, 90 ,3.7,1)

        orH4.wires = singleWireH4
        orH4.setOutput(laptop)


        firstHackPoint.addHackObject(powerSourceOneH4)
        firstHackPoint.addHackObject(switchLeftH4)
        firstHackPoint.addHackObject(oneNotH4)
        firstHackPoint.addHackObject(leftWiresH4)
        firstHackPoint.addHackObject(leftTwoWiresH4)
        firstHackPoint.addHackObject(rightWiresH4)
        firstHackPoint.addHackObject(twoNotH4)
        firstHackPoint.addHackObject(rightTwoWiresH4)
        firstHackPoint.addHackObject(leftAndH4)
        firstHackPoint.addHackObject(rightAndH4)
        firstHackPoint.addHackObject(midWiresLH4)
        firstHackPoint.addHackObject(midWiresRH4)
        firstHackPoint.addHackObject(orH4)
        firstHackPoint.addHackObject(singleWireH4)
        firstHackPoint.addHackObject(leftThreeWiresH4)
        firstHackPoint.addHackObject(switchRightH4)
        firstHackPoint.addGameElements(laptop)


        GameElements = [player,elevator,elevator2,elevator3,zeroHackPoint,firstHackPoint,secondHackPoint,thirdHackPoint,firstDoor,secondDoor,win, pcScreen , laptop,spider,hide]
           if (!hasEasterEgg) {
    
               GameElements.push(easterEgg)
           }

        
        cutScenes = [workOfficeTalk,privateOfficeTalk,EntryTalk,meetingRoom, endingTalk]
        
        //if (!hasEasterEgg) {
        //    GameElements.push(easterEgg)
        //}
        controls = {
            right:      this.input.keyboard.addKey(Phaser.Keyboard.D),
            left:       this.input.keyboard.addKey(Phaser.Keyboard.A),
            up:         this.input.keyboard.addKey(Phaser.Keyboard.W),
            down:       this.input.keyboard.addKey(Phaser.Keyboard.S),
            interact:   this.input.keyboard.addKey(Phaser.Keyboard.E),
            spacebar:   this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
        };
    }
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@--Update---@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
function update(){

    if(loaded){
        game.camera.update();
        game.physics.arcade.collide(firstDoor.sprite, player.sprite);
        game.physics.arcade.collide(secondDoor.sprite, player.sprite);

        if(spider!=null){
            game.physics.arcade.collide(firstDoor.sprite, spider.sprite);
            game.physics.arcade.collide(secondDoor.sprite, spider.sprite);
            var hitPlatform2 = game.physics.arcade.collide(spider.sprite,platforms.platforms);
            burstPlatforms.update()
        }

        var hitPlatform = game.physics.arcade.collide(player.sprite,platforms.platforms);
        //var bustJump = game.physics.arcade.collide(player.sprite,platformsbustJump);

        for(let i = 0; i < GameElements.length; i++){
            GameElements[i].update();
        }
        for(let i = 0; i < cutScenes.length; i++){
            cutScenes[i].update()
        }

    }
}

function render() {
    game.debug.text('Timer: ' + Math.round(this.game.time.totalElapsedSeconds() * 100) / 100, 1170, 10);
    game.debug.text('Switch flips : ' + switchFlips, 1150, 30);


}
