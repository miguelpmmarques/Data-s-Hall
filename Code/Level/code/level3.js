var game = new Phaser.Game(2000,880, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

//look left
//follow
var switchFlips = 0;
function preload(){
    game.load.image('loading','../assets/loading.png');
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.startSystem(Phaser.Physics.P2JS);

}
function start(){
    game.load.image('level', '../assets/level3.png');
    game.load.image('ground', '../assets/platform.png');
    game.load.spritesheet('dark','../assets/dark1.png',45,21);
    game.load.image('HackPoint','../assets/HackPoint.png');
    game.load.spritesheet('elevator', '../assets/elevator.png', 120,165);
    game.load.spritesheet('spider', '../assets/spider.png',30, 18);
    game.load.spritesheet('yes', '../assets/yes.png',15, 9);
    game.load.spritesheet('no', '../assets/no.png',15, 9);
    game.load.spritesheet('player', '../assets/player.png',51, 105);
    game.load.spritesheet('powerSource', '../assets/power source.png',60, 60);
    game.load.spritesheet('switch', '../assets/switch(36x24).png',36, 24);
    game.load.spritesheet('wire', '../assets/wire(21x12).png',21, 12);
    game.load.spritesheet('lamp', '../assets/lamp(60x60).png',60, 60);
    game.load.spritesheet('and', '../assets/AND(51x30).png',51, 30);
    game.load.spritesheet('or', '../assets/OR(51x30).png',51, 30);
    game.load.spritesheet('not','../assets/Not.png',45,21);
    game.load.spritesheet('easterEgg','../assets/easterEgg(27x24).png',27,24);
    game.load.spritesheet('robo','../assets/Robo_punk_street.png',120,138);
    game.load.spritesheet('energyball','../assets/energy_ball.png',90,60);
    game.load.spritesheet('p2051','../assets/AiRebirth.png',42,159);
    game.load.spritesheet('idleTransform','../assets/Idletransform.png',22,39);
    //MENU
    game.load.spritesheet('HelpMenu','../assets/HelpMenu.png',1300,675);
    game.load.spritesheet('soundGame','../assets/soundGame.png',36,54);
    game.load.spritesheet('exitGame','../assets/exitGame.png',36,54);
    game.load.spritesheet('resetGame','../assets/resetGame.png',36,54);
    game.load.spritesheet('pauseGame','../assets/pauseGame.png',36,54);
    // HACKER MODE
    game.load.script('BlurX', '../assets/BlurX.js');
    game.load.script('BlurY', '../assets/BlurY.js');
    game.load.script('gray', '../assets/filter.js');
    // SOUNDTRACK
    game.load.audio('soundtrack', '../assets/soundtrack3.mp3');
    game.load.audio('soundtrackH', '../assets/soundtrack3H.mp3');
    game.load.audio('energyOn','../assets/energyOn.wav');
    game.load.audio('energyOff','../assets/energyOff.wav');
    game.load.audio('swordSlash','../assets/swordSlash.wav');
    game.load.audio('energyShot','../assets/energyShot.wav');
    game.load.audio('dieSound','../assets/die.wav');
    game.load.audio('lazerSound','../assets/lazer.wav');
    game.load.audio('elevatorSound','../assets/elevator.wav');
    game.load.audio('switchFlipOn','../assets/switchFlipOn.wav');
    game.load.audio('switchFlipOff','../assets/switchFlipOff.wav');
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
        game.camera.bounds.width = 6000;
        game.camera.bounds.height = 1000;
        game.camera.bounds.y = 0;

        background = game.add.sprite(0, -100, 'level');
        background.smoothed = false
        background.scale.setTo(3,3)
        background.autoColl = true;

        platforms = new Walls();
        burstPlatforms = new BurstPlatforms();

        // MAP ELEMENTS//faltam os burst jumps
        platforms.addWall(1720     ,0,0.01,80);
        platforms.addWall(850      ,0,0.01,80);
        //platforms.addWall(2635   ,80,0.01,80,false);

        localDataBase = JSON.parse(localStorage.getItem('items'));
        hasEasterEgg = localDataBase.actUser.EasterEgg1;
        answer1=localDataBase.actUser.question1;
        answer2=localDataBase.actUser.question2;
        //Filters
        gray = game.add.filter('Gray');
        blurX = game.add.filter('BlurX');
        blurY = game.add.filter('BlurY');
        blurX.blur = 10;
        blurY.blur = 10;


        // Game Elements
        GameElements    = new Array();

        spawn            = new ElevatorSpawn(1579, 715, true,1);
        finalHackPoint  = new HackPoint(1440,828,true);
        player          = new Player(1600, 780, true);//Player(563, 1085, true);

        player.sprite.alpha = 0;
        player.state = false;
        ai= new Project2051(1227,399);
        GameElements.push(player)
        GameElements.push(finalHackPoint)
        GameElements.push(spawn)



        player.onwSpider = true;
        spider          = new Spider(1600,900);
        spider.sprite.animations.play("spawn")
        intro = new Talk(null, [
            new ScriptAction(player, null,null,1500,null,1),
            new ScriptAction(player,"*lookUp", null,null,null,2),
            new ScriptAction(player, "Whats that weird \ngreen stuff?", [20,-30],null,null,2),
            new ScriptAction(spider, "Everyone.", [0,10],1200,null,2),
            new ScriptAction(player, "...", [20,-40],null,null,2)
        ])

        end1 = new Talk(null, [
            new ScriptAction(player, "*offAll",null,null,null,0.1),
            new ScriptAction(spider, "What are you doing?!", [0,10],null,null,2),
            new ScriptAction(spider, "Ignorant fool!", [0,10],null,null,2),
            new ScriptAction(spider, "Do you have any idea \nwhat that even is?!", [0,10],null,null,3),
            new ScriptAction(player, "Don't care.", [20,-40],null,null,2),
            new ScriptAction(player, "I know they're taking memories,...", [20,-40],null,null,3),
            new ScriptAction(player, "...fooling their \nemployees and users.", [20,-40],null,null,3),
            new ScriptAction(player, "Whatever is going on here.", [20,-40],1200,null,3),
            new ScriptAction(player, "It can't be good.", [20,-40],null,null,2),
            new ScriptAction(player, "That's that.", [20,-40],1400,null,2),
            new ScriptAction(spider, "But you are not them!", [0,10],null,null,2),
            new ScriptAction(spider, "You could've used that!", [0,10],null,null,2),
            new ScriptAction(spider, "You could've helped people!", [0,10],null,null,2),
            new ScriptAction(player, "I'm just a thief.", [20,-40],1500,null,2),
            new ScriptAction(player, "Thanks but \nno thanks!", [20,-40],1800,null,2),
        ])

        end2 = new Talk(null, [
            new ScriptAction(player, "*offAll",null,null,null,0.1),

            new ScriptAction(spider, "I knew you had it in you.", [0,10],null,null,2),
            new ScriptAction(spider, "*transform", null,null,null,2),

            new ScriptAction(player, "*die", null,null,null,1),
            new ScriptAction(player, "*invisible", null,null,null,2),
            new ScriptAction(spider, "Good job.", [0,10],1400,null,2),

            new ScriptAction(spider, "Where do we go from here?", [0,10],1350,null,2),
            new ScriptAction(player, "...", [-120,-40],null,null,2),
            new ScriptAction(player, "Where to begin?", [-120,-40],null,null,2),
            new ScriptAction(player, "So much to do.", [-120,-40],null,null,2),
        ])

        end3 =  new Talk(null, [
            new ScriptAction(player, "*offAll",null,1150,null,1),
            new ScriptAction(player, "*shake",null,1260,null,0.1),
            new ScriptAction(spider, "Are you okay?", [0,10],null,null,2),
            new ScriptAction(player, "...", [20,-40],null,null,2),
            new ScriptAction(spider, "You in there?", [0,10],null,null,2),
            new ScriptAction(player, "WE ARE.", [20,-40],null,null,2),
            new ScriptAction(spider, "Did you just did what I think you did?!", [0,10],null,null,3),
            new ScriptAction(spider, "Risky stuff.", [0,10],null,null,2),
            new ScriptAction(spider, "Can't say I dislike your style...", [0,10],null,null,3),
            new ScriptAction(spider, "You really think this is gonna work?", [0,10],null,null,3),

        ])
        game.time.events.add(Phaser.Timer.SECOND*3,byebye ,this);
        function byebye(){

            intro.active = true
        }
        scenes = [intro,end1,end2,end3]
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
        soundEffectsList.push(dieSound=game.add.audio('energyOn'));
        soundEffectsList.push(elevatorSound=game.add.audio('elevatorSound'));
        soundEffectsList.push(doorUnlock=game.add.audio('doorUnlock'));
        soundEffectsList.push(doorLock=game.add.audio('doorLock'));
        soundEffectsList.push(spiderJump=game.add.audio('spiderJump'));
        soundEffectsList.push(explosion=game.add.audio('explosion'));
        energyOn.volume= localDataBase.gameMusicVol/100;
        energyOff.volume= localDataBase.gameMusicVol/100;
        dieSound.volume= localDataBase.gameMusicVol/100;
        elevatorSound.volume=localDataBase.gameMusicVol/200;
        doorUnlock.volume=localDataBase.gameMusicVol/100;
        doorLock.volume=localDataBase.gameMusicVol/100;
        spiderJump.volume=localDataBase.gameMusicVol/100;
        explosion.volume=localDataBase.soundEfectsVol/100;


        xOffset = 110
        yOffset = 250
        // FIRST HACK
        powerSourceOneH1  = new PowerSource(1300 + xOffset,670 + yOffset)
        switchLeftH1       = new Switch(1303 + xOffset,715 + yOffset,true,180);
        switchRightH1       = new Switch(1357 + xOffset,682 + yOffset,true, 0);
        powerSourceOneH1.setOutput(switchLeftH1)
        powerSourceOneH1.setOutput(switchRightH1)

        leftWiresH1 = new Wiring(true)
        leftWiresH1.addWire(1273 + xOffset,590 + yOffset, 4, 90, 7,1)
        leftWiresH1.addWire(1272 + xOffset,737 + yOffset, 4, 0 ,7.4,1)
        leftWiresH1.addWire(1440 + xOffset, 593 + yOffset, 4, 90 ,7,1)
        leftWiresH1.addWire(1273 + xOffset,730 + yOffset, 3, 90, 1,1)
        leftWiresH1.addWire(1419 + xOffset,737 + yOffset, 3, 0, 1,1)
        switchLeftH1.wires = leftWiresH1

        rightWiresH1 = new Wiring(true)
        rightWiresH1.addWire(1404 + xOffset,595 + yOffset, 4, 90, 5,1)
        rightWiresH1.addWire(1383 + xOffset,691 + yOffset, 3, 0, 1,1)
        rightWiresH1.addWire(1310 + xOffset,633 + yOffset, 4, 0, 4,1)
        rightWiresH1.addWire(1310 + xOffset,610 + yOffset, 4, 90, 1.1,1)
        rightWiresH1.addWire(1310 + xOffset,626 + yOffset, 3, 90, 1,1)
        switchRightH1.wires = rightWiresH1

        leftAndH1 = new And(1250 + xOffset, 580 + yOffset, true, 0)
        rightAndH1 = new And(1380 + xOffset, 580 + yOffset, true, 0)

        switchLeftH1.setOutput(leftAndH1.halfAndL)
        switchLeftH1.setOutput(rightAndH1.halfAndR)
        switchRightH1.setOutput(leftAndH1.halfAndR)
        switchRightH1.setOutput(rightAndH1.halfAndL)

        midWiresLH1 = new Wiring(true)
        midWiresLH1.addWire(1290 + xOffset, 555 + yOffset, 4, 90 ,1.5,1)
        midWiresLH1.addWire(1296 + xOffset, 555 + yOffset, 3, 180 ,1,1)
        midWiresLH1.addWire(1342 + xOffset, 505 + yOffset, 4, 90 ,1.8,1)
        midWiresLH1.addWire(1290 + xOffset, 540 + yOffset, 4, 0 ,1.8,1)
        midWiresLH1.addWire(1320 + xOffset, 540 + yOffset, 3, 0 ,1,1)

        midWiresRH1 = new Wiring(true)
        midWiresRH1.addWire(1420 + xOffset, 555 + yOffset, 4, 90 ,1.5,1)
        midWiresRH1.addWire(1405 + xOffset, 563 + yOffset, 3, -90 ,1,1)
        midWiresRH1.addWire(1370 + xOffset, 505 + yOffset, 4, 90 ,1.8,1)
        midWiresRH1.addWire(1370 + xOffset, 540 + yOffset, 4, 0 ,1.8,1)
        midWiresRH1.addWire(1370 + xOffset, 534 + yOffset, 3, 90 ,1,1)
        leftAndH1.wires = midWiresLH1
        rightAndH1.wires = midWiresRH1


        singleWireH1 = new Wiring(true)
        singleWireH1.addWire(1357 + xOffset, 476 + yOffset, 4, 90 ,1,1)


        singleWireH1.addWire(1363 + xOffset, 477 + yOffset, 3, 180 ,1,1);
        singleWireH1.addWire(1357 + xOffset,462 + yOffset,4,0,6,1);
        orH1 = new Or(1315 + xOffset, 480 + yOffset, true , 0)
        leftAndH1.setOutput(orH1.halfOrL)
        rightAndH1.setOutput(orH1.halfOrR)
        orH1.wires = singleWireH1

      //  orH1.setOutput( secondDoor)       < + OUTPUT 1

      // SECOND HACK
      powerSourceOneH2  = new PowerSource(882 + xOffset,345 + yOffset)
      powerSourceTwoH2  = new PowerSource(882 + xOffset,405 + yOffset)
      wires1H2 = new Wiring(true);
      wires1H2.addWire(939 + xOffset,380 + yOffset,4,0,1.5,1);
      wires2H2 = new Wiring(true);
      wires2H2.addWire(939 + xOffset,410 + yOffset,4,0,4.5,1);
      switchOneH2       = new Switch(962 + xOffset,371 + yOffset,false,0);

      wires3H2 = new Wiring(false);
      wires3H2.addWire(995 + xOffset,380 + yOffset,5,0,2,1);

      wires4H2 = new Wiring(true);
      wires4H2.addWire(1081 + xOffset,410 + yOffset,1,180,1,1);//TPose
      wires4H2.addWire(1078 + xOffset,410 + yOffset,4,90,1,1);

      orOneH2  = new Or(1060 + xOffset,370 + yOffset,false,90)
      switchOneH2.wires =wires3H2;
      powerSourceOneH2.setOutput(switchOneH2);
      switchOneH2.setOutput(orOneH2.halfOrR);
      powerSourceTwoH2.setOutput(orOneH2.halfOrL);
      orOneH2.wires =wires4H2;

      notOneH2          = new Not(1130 + xOffset,391+ yOffset,false,0)


      switchTwoH2       = new Switch(1076 + xOffset,385 + yOffset,false,0)
      wires5H2 = new Wiring(false);
      wires5H2.addWire(1130 + xOffset,409 + yOffset,0,180,1,1);
      wires5H2.addWire(1127 + xOffset,409 + yOffset,5,90,1,1);
      switchTwoH2.wires = wires5H2;
      orOneH2.setOutput(switchTwoH2);
      andOneH2          = new And(1062 + xOffset,426 + yOffset,true,0)
      switchTwoH2.setOutput(notOneH2);
      switchTwoH2.setOutput(andOneH2.halfAndR);
      orOneH2.setOutput(andOneH2.halfAndL);
      wires6H2 = new Wiring(false);
      wires6H2.addWire(1100 + xOffset,463 + yOffset,5,0,3,1);
      wires6H2.addWire(1105 + xOffset,455 + yOffset,2,90,1,1);

      andOneH2.wires = wires6H2;

      notTwoH2          = new Not(1160 + xOffset,458 + yOffset,false,0)
      andOneH2.setOutput(notTwoH2);


      wires7H2 = new Wiring(true);
      wires7H2.addWire(1200 + xOffset,460 + yOffset,3,0,1,1);
      wires7H2.addWire(1228 + xOffset,460 + yOffset,3,180,1,1);
      wires7H2.addWire(1220 + xOffset,445 + yOffset,4,0,4,1);

      wires7H2.addWire(1172 + xOffset,415 + yOffset,3,270,1,1);
      wires7H2.addWire(1188 + xOffset,404 + yOffset,3,90,1,1);
      wires7H2.addWire(1188 + xOffset,410 + yOffset,4,0,6,1);
      notTwoH2.wires = wires7H2


      andTwoH2          = new And(1320 + xOffset,405 + yOffset,true,90)
      wires9H2 = new Wiring(true);
      wires9H2.addWire(1315 + xOffset,430 + yOffset,4,0,8,1);
      notTwoH2.setOutput(andTwoH2.halfAndR);
      orOneH2.setOutput(andTwoH2.halfAndL);
      andTwoH2.wires = wires9H2
      unionOrH2          = new Or(1500 + xOffset,420 + yOffset,true,90)
      andTwoH2.setOutput(unionOrH2.halfOrR)
      orH1.setOutput(unionOrH2.halfOrL)
      //  andTwoH2.setOutput(secondDoor)
      //  andOneH2.setOutput(firstDoor)

      // THIRD HACK

      wires1H3 = new Wiring(true);
      powerSourceOneH3  = new PowerSource(1737 + xOffset,400 + yOffset)


      wires2H3 = new Wiring(false);//wire a seguir ao not de cima
      wires2H3.addWire(1495 + xOffset,445 + yOffset,4,0,3,1);


      unionOrH2.wires = wires2H3
      wires2H35 = new Wiring(true);
      wires2H35.addWire(1775 + xOffset,460 + yOffset,4,90,3,1)
      powerSourceOneH3.wires = wires2H35

      fixedwiresH3 = new Wiring(true)
      fixedwiresH3.addWire(1595 + xOffset,445 + yOffset,5,0,2,1);
      fixedwiresH3.addWire(1635 + xOffset,466 + yOffset,2,270,1,1);
      fixedwiresH3.addWire(1650 + xOffset,480 + yOffset,5,90,2,1);
      fixedwiresH3.addWire(1650 + xOffset,460 + yOffset,0,90,1,1);
      fixedwiresH3.addWire(1650 + xOffset,510 + yOffset,2,90,1,1);
      fixedwiresH3.addWire(1648 + xOffset,516 + yOffset,5,0,1.3,1);
      fixedwiresH3.addWire(1675 + xOffset,537 + yOffset,2,270,1,1);
      fixedwiresH3.addWire(1690 + xOffset,527 + yOffset,5,90,4,1);
      fixedwiresH3.addWire(1649 + xOffset,463 + yOffset,5,0,3.8,1);
      fixedwiresH3.addWire(1728 + xOffset,484 + yOffset,2,-90,1,1);
      fixedwiresH3.addWire(1744 + xOffset,478 + yOffset,5,90,1,1);
      notTwoH3           = new Not(1555 + xOffset,443 + yOffset,true,0);
      notTwoH3.wires = fixedwiresH3
      unionOrH2.setOutput(notTwoH3)


      wires5H3 = new Wiring(false);
      wires5H3.addWire(1757 + xOffset,522 + yOffset, 4,90,1,1);
      switchTwoH3       = new Switch(1765 + xOffset,542 + yOffset,false,90)
      andOneH3          = new And(1717 + xOffset,492 + yOffset,false,0)
      powerSourceOneH3.setOutput(andOneH3.halfAndR)
      notTwoH3.setOutput(andOneH3.halfAndL)
      andOneH3.wires = wires5H3;
      andOneH3.setOutput(switchTwoH3)

      wires6H3 = new Wiring(true);
      wires6H3.addWire(1735 + xOffset,573 + yOffset,2,0,1,1);
      wires6H3.addWire(1723 + xOffset,575 + yOffset,5,0,1,1);
      wires6H3.addWire(1730 + xOffset,590 + yOffset ,2,180,1,1);
      switchTwoH3.wires = wires6H3;
      finalAndH3           = new And(1670 + xOffset,580 + yOffset,false,0)//<--------------remove -100
      notTwoH3.setOutput(finalAndH3.halfAndL)
      switchTwoH3.setOutput(finalAndH3.halfAndR)

      wires7H3 = new Wiring(true);
      finalAndH3.wires = wires7H3;
      wires7H3.addWire(1710 + xOffset,610 + yOffset,5,90,3,1);
      finalAndH3.wires = wires7H3;



      wires8H3 = new Wiring(true);
      wires8H3.addWire(1720 + xOffset,635+ yOffset,5,0,5,1);
      wires8H3.addWire(1815 + xOffset,635 + yOffset,2,0,1,1);
      wires8H3.addWire(1835 + xOffset,374 + yOffset,5,90,12.6,1);
      wires8H3.addWire(1820 + xOffset,380 + yOffset,2,270,1,1);
      wires8H3.addWire(1235 + xOffset,358 + yOffset,5,0,28,1);
      wires8H3.addWire(1236 + xOffset,352 + yOffset,2,90,1,1);

      wires9H3 = new Wiring(true);
      wires9H3.addWire(1720 + xOffset,665 + yOffset,5,0,6,1);
      wires9H3.addWire(1835 + xOffset,665 + yOffset,2,0,1,1);
      wires9H3.addWire(1855 + xOffset,341 + yOffset,5,90,15.6,1);
      wires9H3.addWire(1490 + xOffset,330 + yOffset,5,0,17,1);

      wires9H3.addWire(1840 + xOffset,351 + yOffset,2,270,1,1);


      lixo  = new Or(3000 ,3000 ,false,90)

      decisionSwitch = new DoubleSwitch(1693 + xOffset,626 + yOffset,1693 + xOffset,656 + yOffset,false,false,0,0);
      finalAndH3.setOutput(decisionSwitch.switch1)
      finalAndH3.setOutput(decisionSwitch.switch2)
      decisionSwitch.switch1.wires = wires8H3
      decisionSwitch.switch2.wires = wires9H3

      decisionSwitch.switch1.setOutput(lixo)
      decisionSwitch.switch2.setOutput(lixo)


      powerSourceOneH3.setOutput(andOneH3.halfAndR);

        switchTwoH3.setOutput(finalAndH3.halfAndR);

        finalHackPoint.addHackObject(powerSourceOneH1)
        finalHackPoint.addHackObject(switchLeftH1)
        finalHackPoint.addHackObject(switchRightH1)
        finalHackPoint.addHackObject(leftWiresH1)
        finalHackPoint.addHackObject(rightWiresH1)
        finalHackPoint.addHackObject(leftAndH1)
        finalHackPoint.addHackObject(rightAndH1)
        finalHackPoint.addHackObject(midWiresLH1)
        finalHackPoint.addHackObject(midWiresRH1)
        finalHackPoint.addHackObject(singleWireH1)
        finalHackPoint.addHackObject(orH1)
        finalHackPoint.addHackObject(powerSourceOneH2)
        finalHackPoint.addHackObject(powerSourceTwoH2)
        finalHackPoint.addHackObject(wires1H2)
        finalHackPoint.addHackObject(wires2H2)
        finalHackPoint.addHackObject(switchOneH2)
        finalHackPoint.addHackObject(wires3H2)
        finalHackPoint.addHackObject(wires4H2)
        finalHackPoint.addHackObject(orOneH2)
        finalHackPoint.addHackObject(notOneH2)
        finalHackPoint.addHackObject(switchTwoH2)
        finalHackPoint.addHackObject(wires5H2)
        finalHackPoint.addHackObject(andOneH2)
        finalHackPoint.addHackObject(wires6H2)
        finalHackPoint.addHackObject(notTwoH2)
        finalHackPoint.addHackObject(wires7H2)
        finalHackPoint.addHackObject(andTwoH2)
        finalHackPoint.addHackObject(wires9H2)
        finalHackPoint.addHackObject(unionOrH2)
        finalHackPoint.addHackObject(wires1H3)
        finalHackPoint.addHackObject(powerSourceOneH3)
        finalHackPoint.addHackObject(wires2H3)
        finalHackPoint.addHackObject(wires2H35)
        finalHackPoint.addHackObject(fixedwiresH3)
        finalHackPoint.addHackObject(notTwoH3)
        finalHackPoint.addHackObject(wires5H3)
        finalHackPoint.addHackObject(switchTwoH3)
        finalHackPoint.addHackObject(andOneH3)
        finalHackPoint.addHackObject(wires6H3)
        finalHackPoint.addHackObject(finalAndH3)
        finalHackPoint.addHackObject(wires7H3)
        finalHackPoint.addHackObject(wires8H3)
        finalHackPoint.addHackObject(wires9H3)
        finalHackPoint.addHackObject(decisionSwitch.switch1)
        finalHackPoint.addHackObject(decisionSwitch.switch2)
        firstEntry=true;
        /*if (!hasEasterEgg) {
            GameElements.push(easterEgg)
        }*/
        controls = {
            right:  this.input.keyboard.addKey(Phaser.Keyboard.D),
            left:   this.input.keyboard.addKey(Phaser.Keyboard.A),
            up:     this.input.keyboard.addKey(Phaser.Keyboard.W),
            down:   this.input.keyboard.addKey(Phaser.Keyboard.S),
            interact:   this.input.keyboard.addKey(Phaser.Keyboard.E),
            spacebar: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
        };
    }
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@--Update---@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
function update(){

    if(loaded){
        game.camera.update();

        for(let i = 0; i <scenes.length ; i++){
            scenes[i].update()
        }
        ai.update()

        try{
            if(decisionSwitch.finalDecision!=null && firstEntry){
                firstEntry=false;
                finalHackPoint.exitHack();
              if(decisionSwitch.finalDecision==true && answer2==false && answer1==true){
                //faz a tua cutscene sea bruh
                end3.active = true;
                game.time.events.add(Phaser.Timer.SECOND * 20.1,ai.end3End,ai);

              }
              else if(decisionSwitch.finalDecision==false && answer2==false && answer1==true){
                ai.birthAnim.play();
              }
              else{
                ai.deathAnim.play();

              }

            }
            if(spider!=null){
                var hitPlatform2 = game.physics.arcade.collide(spider.sprite,platforms.platforms);
                burstPlatforms.update()
            }
          }
          catch(e){

          }

        var hitPlatform = game.physics.arcade.collide(player.sprite,platforms.platforms);
        //var bustJump = game.physics.arcade.collide(player.sprite,platformsbustJump);

        for(let i = 0; i < GameElements.length; i++){
            GameElements[i].update();
        }
        decisionSwitch.update()

    }
}


function render() {
    game.debug.text('Timer: ' + Math.round(this.game.time.totalElapsedSeconds() * 100) / 100, 1170, 10);
    game.debug.text('Switch flips : ' + switchFlips, 1150, 30);

}

class DoubleSwitch{
    constructor(x, y,x1,y1, state1,state2,angle1,angle2){
        this.finalDecision = null;
        this.yes = game.add.sprite(1300, 545, "yes");
        this.no = game.add.sprite(1500, 545, "no");
        this.switch1 = new Switch(x,y,state1,angle1);
        this.switch2 = new Switch(x1,y1,state2,angle2);
        this.yes.scale.setTo(7,7);
        this.yes.smoothed = false;
        this.no.scale.setTo(7,7);
        this.no.smoothed = false;
    }
    update(){
        if (!player.hackerMode) {
            this.yes.alpha = 0
            this.no.alpha = 0
        }
        else {
            this.yes.alpha = 1
            this.no.alpha = 1
            writePrompt(970,500,'Are you willing to, as a part of a collective intelligent, lose yourself for the common good?');

        }
        if (this.switch1.state && this.switch2.state) {
            this.switch1.clicked(false,0)
            this.switch2.clicked(false,0)
            this.yes.frame = 0
            this.no.frame = 0
        }
        else if (this.switch1.state==true) {
            this.yes.frame = 1
            this.finalDecision = true

        }
        else if (this.switch2.state==true) {
            this.no.frame = 1
            this.finalDecision = false
        }
        if (this.switch1.state==false) {
            this.yes.frame = 0
        }
        if (this.switch2.state==false) {
            this.no.frame = 0
        }
    }
}
