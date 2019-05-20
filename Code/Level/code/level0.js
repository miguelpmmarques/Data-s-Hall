var game = new Phaser.Game(3000,1300, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

//look left
//follow
var switchFlips = 0;
function preload(){
    game.load.image('loading','../assets/loading.png');
    game.physics.startSystem(Phaser.Physics.ARCADE);


}
function start(){
    game.load.image('level', '../assets/level0.2.png');
    game.load.image('ground', '../assets/platform.png');
    game.load.spritesheet('dark','../assets/dark.png',45,21);
    game.load.image('HackPoint','../assets/HackPoint.png');
    game.load.spritesheet('elevator', '../assets/elevator.png', 120,165);
    game.load.spritesheet('spider', '../assets/spider.png',30, 18);
    game.load.spritesheet('door', '../assets/door.png',24, 159);
    game.load.spritesheet('box','../assets/box.png',60,84);
    game.load.image('box_bare','../assets/box_bare.png')
    game.load.spritesheet('camera', '../assets/securityCamera.png',963,201);
    game.load.spritesheet('player', '../assets/player.png',51, 105);
    game.load.spritesheet('powerSource', '../assets/power source.png',60, 60);
    game.load.spritesheet('switch', '../assets/switch(36x24).png',36, 24);
    game.load.spritesheet('guard', '../assets/guard(309x144)_3.png',101,46);
    game.load.spritesheet('wire', '../assets/wire(21x12).png',21, 12);
    game.load.spritesheet('lamp', '../assets/lamp(60x60).png',60, 60);
    game.load.spritesheet('and', '../assets/AND(51x30).png',51, 30);
    game.load.spritesheet('or', '../assets/OR(51x30).png',51, 30);
    game.load.spritesheet('not','../assets/Not.png',45,21);
    game.load.spritesheet('loot','../assets/lootbox(69x108).png',69,108);
    game.load.spritesheet('easterEgg','../assets/easterEgg(27x24).png',27,24);
    game.load.spritesheet('robo','../assets/Robo_punk_street.png',120,141);
    game.load.spritesheet('energyball','../assets/energy_ball.png',90,60);
    game.load.spritesheet('questionMark','../assets/QuestionMark.png',36,54);
    game.load.spritesheet('exclamationPoint','../assets/Exclamation.png',18,48);
    game.load.spritesheet('burst', '../assets/burst.png', 400,32)
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
        game.camera.bounds.width = 2700;
        game.camera.bounds.height = 900;
        game.camera.bounds.y = 520;



        background = game.add.sprite(0, 510, 'level');
        background.autoColl = true;

        platforms = new Walls();
        burstPlatforms = new BurstPlatforms();



        // MAP ELEMENTS//faltam os burst jumps
        platforms.addWall(0   ,1280,7.5,2);
        platforms.addWall(2538,737 ,0.025,17);
        platforms.addWall(1183,1066,3.4,0.5);
        platforms.addWall(1183,848 ,3.5,0.5);
        platforms.addWall(1371,848,0.025,2.3);
        platforms.addWall(2270,848,0.025,2.3);
        platforms.addWall(2340,738,0.025,2.5);
        platforms.addWall(2270,1070,0.025,2.1);
        platforms.addWall(2338,722,0.53,0.5);
        platforms.addWall(2270,1070,0.025,2.1);
        platforms.addWall(1150,700,0.005,12.5);
        platforms.addWall(1183,1000,0.005,4.6);
        platforms.addWall(1183,849,0.005,2.5);
        burstPlatforms.addBurst(1165,1070,0.04,0.3);

        localDataBase = JSON.parse(localStorage.getItem('items'));
        hasEasterEgg = localDataBase.actUser.EasterEgg0;

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
        soundEffectsList.push(lightsOn=game.add.audio('lightsOn'));
        soundEffectsList.push(doorUnlock=game.add.audio('doorUnlock'));
        soundEffectsList.push(doorLock=game.add.audio('doorLock'));
        soundEffectsList.push(spiderJump=game.add.audio('spiderJump'));
soundEffectsList.push(explosion=game.add.audio('explosion'));
        energyOn.volume= localDataBase.soundEfectsVol/100;
        energyOff.volume= localDataBase.soundEfectsVol/100;
        swordSlash.volume= localDataBase.soundEfectsVol/100;
        energyShot.volume= localDataBase.soundEfectsVol/100;
        dieSound.volume= localDataBase.soundEfectsVol/100;
        lazerSound.volume=localDataBase.soundEfectsVol/300;
        elevatorSound.volume=localDataBase.soundEfectsVol/200;
        lightsOn.volume=localDataBase.soundEfectsVol/200;
        lightsOn.loopFull();
        doorUnlock.volume=localDataBase.soundEfectsVol/100;
        doorLock.volume=localDataBase.soundEfectsVol/100;
        spiderJump.volume=localDataBase.soundEfectsVol/100;
        explosion.volume=localDataBase.soundEfectsVol/100;
        

        //Filters
        gray = game.add.filter('Gray');
        blurX = game.add.filter('BlurX');
        blurY = game.add.filter('BlurY');
        blurX.blur = 10;
        blurY.blur = 10;

        // Game Elements

        GameElements    = new Array();
        firstDoor       = new Door(1165, 1125, false, false);
        secondDoor      = new Door(2263, 1125, false, false);
        thirdDoor       = new Door(1362,  910, false, true);
        forthDoor       = new Door(2263,  910, false, false);
        elevator        = new Elevator(2410, 1116,2410, 900, true, -1);
        firstHackPoint  = new HackPoint(1120,1185,true);
        thirdHackPoint  = new HackPoint(2323,1185,true);
        secondHackPoint = new HackPoint(2163,1185,true);
        fourthHackPoint = new HackPoint(2323,970,true);
        fifthHackPoint  = new HackPoint(1252,790,true);
        lootBox         = new LootBox(1200,970,true);
        player          = new Player(200, 1075, true);//Player(563, 1085, true);
        box1            = new Box(965, 1165, false);
        box2            = new Box(1710, 1165, false);
        spider          = null;
        cam             = new SecurityCamera(1262,1076);
        lamp1           = new Lamp(1563,860,true);
        lamp2           = new Lamp(2070,860,true);
        roboEnemy       = new RobotPunk(1600,920,false,2,1800,900,false,thirdDoor,forthDoor,'Door');//(1600,900,false,1,thirdDoor,forthDoor,'Door');
        dark            = new Dark(1378,860,false,19.8,10);
        hide            = new HiddenZone(2344,731,true,4.5,5.5);
        lockDoor        = new LockDoor(1183,848,true,3.1,10.5);
        winZone         = new GameWin(900,1200,false,4,6.5);
        //player.ownSpider = true;
        //story
        meetingScene = [
            new ScriptAction(player, null, null,1250,null,1),
            new ScriptAction(player, "Really?", [10,-45],null,null,2),
            new ScriptAction(player, "Is this what I'm here for?", [10,-45],1350,null,3),
            new ScriptAction(spider,"You seem disapointed, but really, wise guy", [10,0], 1100,null,3),
            new ScriptAction(spider,"...", [10,0], null,null,1),
            new ScriptAction(spider,"How exacly do expect to get out of here alive?", [10,0], 1350,null,4),
            new ScriptAction(player, "Didn't think that far ahead.", [10,-45], 1250,null,3),
            new ScriptAction(spider, "Sit back ''hackerman''.", [10,0], 1250,null,3),
            new ScriptAction(spider, "I'm gonna show you just how valuable I can be.", [10,0], 1100,null,4),
            new ScriptAction(player, null, null,1200,null,1),
        ]

        talk            = new Talk(null,meetingScene)
        if (!hasEasterEgg) {
            easterEgg       = new EasterEgg(2500,811,false,2);
        }
        priorityObj = [firstDoor,secondDoor,thirdDoor,forthDoor,elevator]
        //Buttons
        soundGame       = new OptionsBtn(100,20,"soundGame")
        exitGame        = new ExitBtn(150,20,"exitGame")
        resetGame       = new ResetBtn(200,20,"resetGame")
        pauseGame       = new PauseBtn(50,20,"pauseGame")



      //  energyOn.mute=true;
      //  energyOff.mute=true;
        // FIRST HACK
        powerSourceOneH1  = new PowerSource(1012,1300)
        switchOneH1       = new Switch(1112,1305,false,0)
        powerSourceOneH1.setOutput(switchOneH1);
        switchOneH1.setOutput(firstDoor);
        wires1H1 = new Wiring(true);
        wires1H1.addWire(1070,1317,4,0,2,1);
        wires2H1 = new Wiring(false);
        wires2H1.addWire(1145,1315,5,0,1.6,1);
        wires2H1.addWire(1165,1315,2,0,1,1);
        wires2H1.addWire(1185,1285,5,90,1.6,1);
        switchOneH1.wires =wires2H1;
        firstHackPoint.addHackObject(powerSourceOneH1)
        firstHackPoint.addHackObject(switchOneH1)
        firstHackPoint.addHackObject(wires1H1)
        firstHackPoint.addHackObject(wires2H1)
        firstHackPoint.addGameElements(firstDoor)

        // SECOND HACK
        powerSourceOneH2  = new PowerSource(2072,1300)
        wiresOneH2 = new Wiring(true);
        wiresOneH2.addWire(2130,1325, 4,0,2,1);
        wiresTwoH2 =  new Wiring(false);
        wiresTwoH2.addWire(2283,1285, 5,90,2.3,1);
        wiresTwoH2.addWire(2258,1325, 2,0,1.3,1);
        wiresTwoH2.addWire(2240,1325, 5,0,1.3,1);
        notOneH2          = new Not(2202,1321,false,0)
        switchOneH2       = new Switch(2172,1315,true,0)
        powerSourceOneH2.setOutput(switchOneH2);
        powerSourceOneH2.wires = wiresOneH2;
        switchOneH2.setOutput(notOneH2);
        notOneH2.setOutput(secondDoor);
        notOneH2.wires = wiresTwoH2;

        secondHackPoint.addHackObject(powerSourceOneH2)
        secondHackPoint.addHackObject(wiresOneH2)
        secondHackPoint.addHackObject(wiresTwoH2)
        secondHackPoint.addHackObject(notOneH2)
        secondHackPoint.addHackObject(switchOneH2)
        secondHackPoint.addGameElements(secondDoor)

        //// THIRD HACK

        powerSourceOneH3  = new PowerSource(2590,1300)
        powerSourceTwoH3  = new PowerSource(2590,1360)
        orOneH3          = new Or(2495,1395,true,-90)

        wiresOneH3 = new Wiring(true);
        wiresOneH3.addWire(2570,1381,4,0,1,1);
        wiresOneH3.addWire(2570,1326,4,0,1,1);

        wiresTwoLeftH3 = new Wiring(true);
        wiresTwoLeftH3.addWire(2548, 1341,2, 180, 1,1 );
        wiresTwoLeftH3.addWire(2520,  1340, 2, 0, 1, 1);

        wiresTwoRightH3 = new Wiring(true);
        wiresTwoRightH3.addWire(2542,1375, 2, 90, 1 ,1);
        wiresTwoRightH3.addWire(2526,1390, 2, -90, 1 ,1);
        wireThreeH3         = new Wiring(true);
        wireThreeH3.addWire(2469, 1347, 2, 90, 1, 1);
        wireThreeH3.addWire(2469, 1284 , 5, 90, 3.4 ,1);
        wireThreeH3.addWire(2469, 1353, 5, 0, 1.6, 1);

        switchOneH3       = new Switch(2575,1350,false,180)
        switchOneH3.wires = wiresTwoLeftH3;
        switchTwoH3       = new Switch(2575,1405,false,180)
        switchTwoH3.wires =  wiresTwoRightH3;

        powerSourceOneH3.setOutput(switchOneH3);
        powerSourceTwoH3.setOutput(switchTwoH3);
        switchOneH3.setOutput(orOneH3.halfOrR);
        switchTwoH3.setOutput(orOneH3.halfOrL);
        orOneH3.setOutput(elevator);
        orOneH3.wires = wireThreeH3;

        thirdHackPoint.addHackObject(powerSourceOneH3)
        thirdHackPoint.addHackObject(powerSourceTwoH3)
        thirdHackPoint.addHackObject(orOneH3)
        thirdHackPoint.addHackObject(wiresOneH3)
        thirdHackPoint.addHackObject(wiresTwoLeftH3)
        thirdHackPoint.addHackObject(wiresTwoRightH3)
        thirdHackPoint.addHackObject(wireThreeH3)
        thirdHackPoint.addHackObject(switchOneH3)
        thirdHackPoint.addHackObject(switchTwoH3)
        thirdHackPoint.addGameElements(elevator)


        //// FORTH HACK
        wiresOneH4 = new Wiring(true);
        wiresOneH4.addWire(1860,889,4,0,2,1);
        wiresOneH4.addWire(1860,946,4,0,2,1);

        wiresTwoH4 = new Wiring(true);
        wiresTwoH4.addWire(1930,889,1,0,1,1);
        wiresTwoH4.addWire(1950,889,4,0,1.2,1);
        wiresTwoH4.addWire(1948,859,4,90,1.5,1);
        wiresTwoH4.addWire(1952,863,1,180,1.1,1);
        wiresTwoH4.addWire(1600,848,4,0,23.8,1);
        wiresTwoH4.addWire(1608,863,3,180,1,1);
        wiresTwoH4.addWire(2095,869,3,-90,1,1);

        wiresThreeH4 = new Wiring(true);
        wiresThreeH4.addWire(1930,946,5,0,4.6,1);
        wiresThreeH4.addWire(2021,946,2,0,1,1);
        wiresThreeH4.addWire(2049,946,2,180,1,1);

        wiresFourH4 = new Wiring(true);
        wiresFourH4.addWire(1990,889,5,0,2,1);
        wiresFourH4.addWire(2028,910,2,-90,1,1);
        wiresFourH4.addWire(2043,898,2,90,1,1);

        wiresFiveH4 = new Wiring(true);
        wiresFiveH4.addWire(2073,915,5,0,9.5,1);

        powerSourceOneH4  = new PowerSource(1800,865)
        powerSourceTwoH4  = new PowerSource(1800,925)
        switchOneH4       = new Switch(1900,880,true,0)
        switchTwoH4       = new Switch(1900,937,false,0)
        orOneH4          = new Or(2079,895,true,90)
        notOneH4          = new Not(1970,885,false,0)

        powerSourceOneH4.setOutput(switchOneH4);
        powerSourceTwoH4.setOutput(switchTwoH4);
        switchOneH4.setOutput(notOneH4);
        switchOneH4.wires = wiresTwoH4
        notOneH4.setOutput(orOneH4.halfOrR);
        notOneH4.setOutput(lamp1);
        notOneH4.setOutput(lamp2);
        notOneH4.setOutput(dark);
        notOneH4.wires = wiresFourH4
        switchTwoH4.setOutput(orOneH4.halfOrL);
        switchTwoH4.wires = wiresThreeH4
        orOneH4.setOutput(forthDoor);
        orOneH4.wires = wiresFiveH4

        fourthHackPoint.addHackObject(wiresOneH4)
        fourthHackPoint.addHackObject(wiresTwoH4)
        fourthHackPoint.addHackObject(wiresThreeH4)
        fourthHackPoint.addHackObject(wiresFourH4)
        fourthHackPoint.addHackObject(wiresFiveH4)
        fourthHackPoint.addHackObject(powerSourceOneH4)
        fourthHackPoint.addHackObject(powerSourceTwoH4)
        fourthHackPoint.addHackObject(switchOneH4)
        fourthHackPoint.addHackObject(switchTwoH4)
        fourthHackPoint.addHackObject(orOneH4)
        fourthHackPoint.addHackObject(notOneH4)
        fourthHackPoint.addGameElements(forthDoor)
        fourthHackPoint.addGameElements(lamp1)
        fourthHackPoint.addGameElements(lamp2)


        //Fifth HACK
        powerSourceOneH5  = new PowerSource(1490,865)
        powerSourceTwoH5  = new PowerSource(1490,925)
        andOneH5          = new And(1395,960,false,-90)

        wiresOneH5 = new Wiring(true);
        wiresOneH5.addWire(1470,946,4,0,1,1);
        wiresOneH5.addWire(1470,891,4,0,1,1);

        wiresTwoLeftH5 = new Wiring(true);
        wiresTwoLeftH5.addWire(1448, 906,2, 180, 1,1 );
        wiresTwoLeftH5.addWire(1420,  906, 2, 0, 1, 1);

        wiresTwoRightH5 = new Wiring(true);
        wiresTwoRightH5.addWire(1442,940, 2, 90, 1 ,1);
        wiresTwoRightH5.addWire(1426,955, 2, -90, 1 ,1);
        wireThreeH5         = new Wiring(true);

        wireThreeH5.addWire(1380, 917, 5, 0, 1, 1);

        switchOneH5       = new Switch(1475,915,false,180)
        switchOneH5.wires = wiresTwoLeftH5;
        switchTwoH5       = new Switch(1475,970,false,180)
        switchTwoH5.wires =  wiresTwoRightH5;

        powerSourceOneH5.setOutput(switchOneH5);
        powerSourceTwoH5.setOutput(switchTwoH5);
        switchOneH5.setOutput(andOneH5.halfAndR);
        switchTwoH5.setOutput(andOneH5.halfAndL);
        andOneH5.setOutput(thirdDoor);
        andOneH5.wires = wireThreeH5;

        fifthHackPoint.addHackObject(powerSourceOneH5)
        fifthHackPoint.addHackObject(powerSourceTwoH5)
        fifthHackPoint.addHackObject(andOneH5)
        fifthHackPoint.addHackObject(wiresOneH5)
        fifthHackPoint.addHackObject(wiresTwoLeftH5)
        fifthHackPoint.addHackObject(wiresTwoRightH5)
        fifthHackPoint.addHackObject(wireThreeH5)
        fifthHackPoint.addHackObject(switchOneH5)
        fifthHackPoint.addHackObject(switchTwoH5)
        fifthHackPoint.addGameElements(thirdDoor)



        ////Stealth Mode Elements
        GameElements = [firstDoor,secondDoor,thirdDoor,forthDoor,elevator,firstHackPoint,secondHackPoint,fourthHackPoint,fifthHackPoint,thirdHackPoint,player,cam,lamp1,lamp2,dark,box1,box2,hide,lockDoor,lootBox,winZone,roboEnemy]
        if (!hasEasterEgg) {
            GameElements.push(easterEgg)
        }
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
        game.physics.arcade.collide(firstDoor.sprite, player.sprite);
        game.physics.arcade.collide(secondDoor.sprite, player.sprite);
        game.physics.arcade.collide(thirdDoor.sprite, player.sprite);
        game.physics.arcade.collide(forthDoor.sprite, player.sprite);
        game.physics.arcade.collide(firstDoor.sprite, box1.sprite2);
        game.physics.arcade.collide(secondDoor.sprite, box1.sprite2);
        game.physics.arcade.collide(thirdDoor.sprite, box1.sprite2);
        game.physics.arcade.collide(firstDoor.sprite, box2.sprite2);
        game.physics.arcade.collide(secondDoor.sprite, box2.sprite2);
        game.physics.arcade.collide(thirdDoor.sprite, box2.sprite2);
        if(spider!=null){
            game.physics.arcade.collide(firstDoor.sprite, spider.sprite);
            game.physics.arcade.collide(secondDoor.sprite, spider.sprite);
            game.physics.arcade.collide(thirdDoor.sprite, spider.sprite);
            game.physics.arcade.collide(forthDoor.sprite, spider.sprite);
            var hitPlatform2 = game.physics.arcade.collide(spider.sprite,platforms.platforms);
            burstPlatforms.update()
        }

        var hitPlatform = game.physics.arcade.collide(player.sprite,platforms.platforms);
        //var bustJump = game.physics.arcade.collide(player.sprite,platformsbustJump);
        var hitPlatformRobo=game.physics.arcade.collide(roboEnemy.sprite,platforms.platforms);
      //  var bustJumpRobo= game.physics.arcade.collide(roboEnemy.sprite,platformsbustJump);

        for(let i = 0; i < GameElements.length; i++){
            GameElements[i].update();
        }
        talk.update()
    }
}



function render() {
    game.debug.text('Timer: ' + Math.round(this.game.time.totalElapsedSeconds() * 100) / 100, 1170, 10);
    game.debug.text('Switch flips : ' + switchFlips, 1150, 30);
   //game.debug.cameraInfo(game.camera, 32, 32);
   //game.debug.spriteCoords(player.sprite, 32, 500);
}
