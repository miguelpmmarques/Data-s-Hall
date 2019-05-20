var game = new Phaser.Game(3500,1300, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

//look left
//follow
var switchFlips = 0;
function preload(){
    game.load.image('loading','../assets/loading.png');
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.startSystem(Phaser.Physics.P2JS);

}
function start(){
    game.load.image('box_bare','../assets/box_bare.png')
    game.load.image('level', '../assets/level1.png');
    game.load.image('ground', '../assets/platform.png');
    game.load.image('helpLazer','../assets/helpLazer.png');
    game.load.spritesheet('dark','../assets/dark1.png',45,21);
    game.load.image('HackPoint','../assets/HackPoint.png');
    game.load.spritesheet('elevator', '../assets/elevator.png', 120,165);
    game.load.spritesheet('spider', '../assets/spider.png',30, 18);
    game.load.spritesheet('door', '../assets/door.png',24, 159);
    game.load.spritesheet('guard', '../assets/guard(309x144)_3.png',101,46);
    game.load.spritesheet('box','../assets/box.png',60,84);
    game.load.spritesheet('camera', '../assets/securityCamera.png',963,201);
    game.load.spritesheet('player', '../assets/player.png',51, 105);
    game.load.spritesheet('powerSource', '../assets/power source.png',60, 60);
    game.load.spritesheet('switch', '../assets/switch(36x24).png',36, 24);
    game.load.spritesheet('wire', '../assets/wire(21x12).png',21, 12);
    game.load.spritesheet('lamp', '../assets/lamp(60x60).png',60, 60);
    game.load.spritesheet('and', '../assets/AND(51x30).png',51, 30);
    game.load.spritesheet('or', '../assets/OR(51x30).png',51, 30);
    game.load.spritesheet('not','../assets/Not.png',45,21);
    game.load.spritesheet('lazer','../assets/laser(64x68).png',12,68);
    game.load.spritesheet('loot','../assets/lootbox(69x108).png',69,108);
    game.load.spritesheet('easterEgg','../assets/easterEgg(27x24).png',27,24);
    game.load.spritesheet('robo','../assets/Robo_punk_street.png',120,138);
    game.load.spritesheet('energyball','../assets/energy_ball.png',90,60);
    game.load.spritesheet('questionMark','../assets/QuestionMark.png',36,54);
    game.load.spritesheet('exclamationPoint','../assets/Exclamation.png',18,48);
    game.load.spritesheet('burst', '../assets/burst.png', 400,32);
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
    game.load.audio('soundtrack', '../assets/soundtrack1.mp3');
    game.load.audio('soundtrackH', '../assets/soundtrack1H.mp3');
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
    game.load.audio('sepukku','../assets/sepukku.wav');
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
        game.camera.bounds.height = 3000;
        game.camera.bounds.y = 0;

        background = game.add.sprite(0, -100, 'level');
        background.autoColl = true;

        platforms = new Walls();
        burstPlatforms = new BurstPlatforms();

        // MAP ELEMENTS//faltam os burst jumps
        //platforms.addWall(1000,    100,0.01,5,true);
        platforms.addWall(870,    200,0.01,3);
        platforms.addWall(0      ,1186,1.01,2);
        platforms.addWall(456   ,1186,1.35,0.5);
        platforms.addWall(348   ,1222,2,0.5);
        platforms.addWall(1040   ,1186,8,0.5);
        platforms.addWall(1138   ,1207,0.1,1);
        platforms.addWall(1052   ,477,0.09,15);
        platforms.addWall(1052   ,767,8,2);
        //burstPlatforms.addBurst(1150,1085,0.07,1,false);
        platforms.addWall(1868   ,767,0.05,15);
        platforms.addWall(2018   ,767,0.05,9);
        platforms.addWall(2168   ,767,0.05,9);
        platforms.addWall(2318   ,767,0.05,9);
        platforms.addWall(1058   ,472,8,0.5);
        platforms.addWall(3508   ,72,0.05,40);
        platforms.addWall(1768   ,477,0.05,4.5);
        platforms.addWall(2668   ,477,0.05,4.5);
        platforms.addWall(3178   ,477,0.05,4.5);
        // BOXES
        platforms.addWall(1191   ,412,0.25,1.7);
        platforms.addWall(1365   ,412,0.25,1.7);
        platforms.addWall(1535   ,412,0.39,1.7);
        platforms.addWall(1535   ,355,0.115,1.7);
        platforms.addWall(1649   ,298,0.115,5);
        platforms.addWall(1978   ,417,0.25,1.7);
        platforms.addWall(2155   ,417,0.25,1.7);
        platforms.addWall(2333   ,417,0.25,1.7);
        platforms.addWall(2473   ,378,0.115,1.7);
        platforms.addWall(2558   ,344,0.115,1.7);
        platforms.addWall(2638   ,315,0.115,1.7);
        platforms.addWall(968    ,257,4.2,0.3);
        platforms.addWall(2718   ,267,0.01,7);
        platforms.addWall(2693   ,237,0.1,0.9);
        platforms.addWall(1052   ,227,4.2,0.3);
        platforms.addWall(1052   ,0,0.01,7);

        localDataBase = JSON.parse(localStorage.getItem('items'));
        localDataBase.actUser.levelSelected = 1
        localStorage.setItem('items',JSON.stringify(localDataBase));
        hasEasterEgg = localDataBase.actUser.EasterEgg1;

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
        soundEffectsList.push(sepukku=game.add.audio('sepukku'));
        soundEffectsList.push(explosion=game.add.audio('explosion'));
        energyOn.volume= localDataBase.soundEfectsVol/100;
        energyOff.volume= localDataBase.soundEfectsVol/100;
        swordSlash.volume= localDataBase.soundEfectsVol/100;
        energyShot.volume= localDataBase.soundEfectsVol/100;
        dieSound.volume= localDataBase.soundEfectsVol/100;
        lazerSound.volume=localDataBase.soundEfectsVol/200;
        elevatorSound.volume=localDataBase.soundEfectsVol/200;
        doorUnlock.volume=localDataBase.soundEfectsVol/100;
        doorLock.volume=localDataBase.soundEfectsVol/100;
        spiderJump.volume=localDataBase.soundEfectsVol/100;
        sepukku.volume=localDataBase.soundEfectsVol/100;
        explosion.volume=localDataBase.soundEfectsVol/100;
        //Filters
        gray = game.add.filter('Gray');
        blurX = game.add.filter('BlurX');
        blurY = game.add.filter('BlurY');
        blurX.blur = 10;
        blurY.blur = 10;

        
        // Game Elements
        GameElements    = new Array();
        firstHackPoint  = new HackPoint(1600,670,true);
        secondHackPoint  = new HackPoint(2835,712,true);
        elevatorEnd        = new ElevatorWin(3300, 604, false, 1,'Question2.html',1);
        elevator        = new Elevator(1144, 1020,1144,600, true, 1);
        player          = new Player(200, 1075, true);//200, 1075
        firstDoor       = new Door(1765, 609, false, false);
        secondDoor       = new Door(2662, 609, true, true);
        thirdDoor       = new Door(3173, 609, false, false);
        roboEnemy       = new SamuraiCop(800,1050,false,0,firstDoor,null,'Hard');
        dark            = new Dark(0,0,false,0.01,0.01);
        box             = new Box(2065,600,false,1.2,1.2);
        box2             = new Box(2362,600,false,1.2,1.2);
        box3            = new Box(970,60,false,1.2,1.2);
        roboEnemy2       = new RobotPunk(2000,600,false,2,1800,900,false,firstDoor ,secondDoor);
        dark            = new Dark(0,0,false,0.01,0.01);
        lazer1          = new Lazer(2096,265,true,'lazer',false);
        lazer2          = new Lazer(2273,265,true, 'lazer',false);
        spider          = null;
        player.ownSpider = true;
        hide            = new HiddenZone(1042,1187,true,2.5,2.5);
        ending = new Talk([3200, 200,300,600], [
                            new ScriptAction(player, "*tp", [3300,500],null,null,0.1),
                            new ScriptAction(player,"This database...",[20,-20],null,null,2),
                            new ScriptAction(player,"I've never seen anything like this.",[20,-20],null,null,2),
                            new ScriptAction(spider,"You just hacked the largest memory database in existence.",[-500,10],null,null,3),
                            new ScriptAction(player,"Memories?!",[20,-20],null,null,2),
                            new ScriptAction(spider,"Remember Joe?",[0,10],null,null,2),
                            new ScriptAction(spider,"His memories are there too.",[-40,10],null,null,3),
                            new ScriptAction(player,"Damn...",[20,-20],null,null,2),
                            new ScriptAction(player,"I noticed something...",[20,-20],null,null,2),
                            new ScriptAction(player,"There might be a number capable \nof breaking this encription.",[20,-20],null,null,4),
                            new ScriptAction(spider,"Impressive.",[0,10],null,null,2),
                            new ScriptAction(spider,"Let's go get our magic key.",[-40,10],null,null,2),
                            new ScriptAction(spider,"It should be on the 24th floor.",[-100,10],null,null,2),
                            new ScriptAction(player, "Let's go then.",[20,-20],3400,null,3)
                ])
        GameElements.push(hide)
        GameElements.push(player)
        GameElements.push(firstDoor)
        GameElements.push(secondDoor)
        GameElements.push(thirdDoor)
        GameElements.push(firstHackPoint)
        GameElements.push(secondHackPoint)
        GameElements.push(elevatorEnd)
        GameElements.push(elevator)
        GameElements.push(box)
        GameElements.push(box2)
        GameElements.push(box3)
        
        GameElements.push(roboEnemy)
        GameElements.push(roboEnemy2)
        GameElements.push(lazer1)
        GameElements.push(lazer2)
        if (!hasEasterEgg) {
            easterEgg       = new EasterEgg(1095,1195,false,1);
        }
        burstPlatforms.addBurst(1032,1185,0.02,0.5,false);
        //Buttons
        priorityObj = [firstDoor,secondDoor,thirdDoor]
        soundGame       = new OptionsBtn(100,20,"soundGame")
        exitGame        = new ExitBtn(150,20,"exitGame")
        resetGame       = new ResetBtn(200,20,"resetGame")
        pauseGame       = new PauseBtn(50,20,"pauseGame")

        // FIRST HACK
        powerSourceOneH1  = new PowerSource(1882,520)
        powerSourceTwoH1  = new PowerSource(1882,580)
        firstHackPoint.addHackObject(powerSourceOneH1);
        wires1H1 = new Wiring(true);
        wires1H1.addWire(1939,555,4,0,1.5,1);
        firstHackPoint.addHackObject(powerSourceTwoH1);
        wires2H1 = new Wiring(true);
        wires2H1.addWire(1939,585,4,0,4.5,1);
        switchOneH1       = new Switch(1962,546,false,0);
        firstHackPoint.addHackObject(switchOneH1)

        wires3H1 = new Wiring(false);
        wires3H1.addWire(1995,555,5,0,2,1);

        wires4H1 = new Wiring(true);
        wires4H1.addWire(2076,585,1,180,1,1);
        wires4H1.addWire(2073,585,4,90,1,1);

        orOneH1  = new Or(2060,545,false,90)
        switchOneH1.wires =wires3H1;
        powerSourceOneH1.setOutput(switchOneH1);
        switchOneH1.setOutput(orOneH1.halfOrR);
        powerSourceTwoH1.setOutput(orOneH1.halfOrL);
        orOneH1.wires =wires4H1;


        switchTwoH1       = new Switch(2076,560,false,0)
        firstHackPoint.addHackObject(switchTwoH1)
        wires5H1 = new Wiring(false);
        wires5H1.addWire(2110,590,2,270,1,1);
        wires5H1.addWire(2127,584,5,90,1,1);
        switchTwoH1.wires = wires5H1;
        orOneH1.setOutput(switchTwoH1);
        andOneH1          = new And(2062,590,true,0)
        switchTwoH1.setOutput(andOneH1.halfAndR);
        orOneH1.setOutput(andOneH1.halfAndL);
        wires6H1 = new Wiring(false);
        wires6H1.addWire(2100,620,5,90,1,1);
        wires6H1.addWire(2080,636,2,0,1,1);
        wires6H1.addWire(1780,635,5,0,14.7,1);
        andOneH1.wires = wires6H1;



        andOneH1.setOutput(firstDoor)

        firstHackPoint.addHackObject(andOneH1)
        firstHackPoint.addHackObject(orOneH1)
        firstHackPoint.addHackObject(wires1H1)
        firstHackPoint.addHackObject(wires2H1)
        firstHackPoint.addHackObject(wires3H1)
        firstHackPoint.addHackObject(wires4H1)
        firstHackPoint.addHackObject(wires5H1)
        firstHackPoint.addHackObject(wires6H1)
        firstHackPoint.addGameElements(firstDoor)


        // SECOND HACK
        offsetX = 48
        offsetY = 190
        wires1H2 = new Wiring(true);
        wires1H2.addWire(3170+offsetX,330+offsetY,4,0,1.5,1);
        wires1H2.addWire(3240+offsetX,350+offsetY,4,90,4,1);
        powerSourceOneH2  = new PowerSource(3200+offsetX,300+offsetY)
        switchOneH2       = new Switch(3180+offsetX,355+offsetY,false,180)
        powerSourceOneH2.setOutput(switchOneH2)
        wires2H2 = new Wiring(false);
        wires2H2.addWire(3155+offsetX,346+offsetY,2,180,1,1);
        wires2H2.addWire(3149+offsetX,346+offsetY,5,90,2.1,1);
        wires2H2.addWire(3149+offsetX,390+offsetY,0,90,1,1);
        wires2H2.addWire(3149+offsetX,400+offsetY,2,90,1,1);
        wires2H2.addWire(3148+offsetX,406+offsetY,5,0,1.3,1);
        wires2H2.addWire(3175+offsetX,427+offsetY,2,270,1,1);
        wires2H2.addWire(3190+offsetX,417+offsetY,5,90,4.5,1);

        switchOneH2.wires = wires2H2
        wires2H25 = new Wiring(true);
        wires2H25.addWire(3149+offsetX,393+offsetY,5,0,4,1);

        notOneH2           = new Not(3149+offsetX,390+offsetY,true,0)
        notOneH2.wires = wires2H25
        wires3H2 = new Wiring(true);
        wires3H2.addWire(3190+offsetX,515+offsetY,5,90,1,1);

        orOneH2           = new Or(3150+offsetX,480+offsetY,false,0)
        orOneH2.wires = wires3H2
        wires4H2 = new Wiring(true);
        wires4H2.addWire(3170+offsetX,560+offsetY,2,0,1,1);
        wires4H2.addWire(3140+offsetX,560+offsetY,5,0,1.7,1);
        switchThreeH2     = new Switch(3200+offsetX,530+offsetY,false,90)
        // ---> orOneH2.setOutput(switchThreeH2)
        switchThreeH2.wires = wires4H2
        switchThreeH2.setOutput(thirdDoor)
        switchTwoH2       = new Switch(3250+offsetX,430+offsetY,false,90)

        andOneH2          = new And(3200+offsetX,380+offsetY,true,0)
        wires5H2 = new Wiring(false);
        wires5H2.addWire(3240+offsetX,410+offsetY,4,90,1,1);
        andOneH2.wires = wires5H2

        wires6H2 = new Wiring(true);
        wires6H2.addWire(3241+offsetX,462+offsetY,5,90,1,1);
        wires6H2.addWire(3226+offsetX,500+offsetY,0,270,1,1);
        wires6H2.addWire(3208+offsetX,482+offsetY,5,0,1,1);
        wires6H2.addWire(3241+offsetX,500+offsetY,5,90,1,1);
        wires6H2.addWire(3241+offsetX,515+offsetY,2,90,1,1);
        wires6H2.addWire(3241+offsetX,522+offsetY,5,0,0.6,1);
        switchTwoH2.wires = wires6H2
        andOneH2.setOutput(switchTwoH2)
        orOneH2.setOutput(switchThreeH2)
        switchOneH2.setOutput(orOneH2.halfOrL)
        switchOneH2.setOutput(notOneH2)
        notOneH2.setOutput(andOneH2.halfAndR)
        powerSourceOneH2.setOutput(andOneH2.halfAndL)
        switchTwoH2.setOutput(elevatorEnd)
        switchTwoH2.setOutput(orOneH2.halfOrR)


        secondHackPoint.addHackObject(wires1H2)
        secondHackPoint.addHackObject(powerSourceOneH2)
        secondHackPoint.addHackObject(switchOneH2)
        secondHackPoint.addHackObject(wires2H2)
        secondHackPoint.addHackObject(wires2H25)
        secondHackPoint.addHackObject(notOneH2)
        secondHackPoint.addHackObject(wires3H2)
        secondHackPoint.addHackObject(orOneH2)
        secondHackPoint.addHackObject(wires4H2)
        secondHackPoint.addHackObject(switchThreeH2)
        secondHackPoint.addHackObject(switchTwoH2)
        secondHackPoint.addHackObject(andOneH2)
        secondHackPoint.addHackObject(wires5H2)
        secondHackPoint.addHackObject(wires6H2)
        secondHackPoint.addGameElements(elevatorEnd)
        secondHackPoint.addGameElements(thirdDoor)
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
        game.physics.arcade.collide(firstDoor.sprite, box.sprite2);
        game.physics.arcade.collide(secondDoor.sprite, box.sprite2);
        game.physics.arcade.collide(thirdDoor.sprite, box.sprite2);
        game.physics.arcade.collide(firstDoor.sprite, box2.sprite2);
        game.physics.arcade.collide(secondDoor.sprite, box2.sprite2);
        game.physics.arcade.collide(thirdDoor.sprite, box2.sprite2);
        game.physics.arcade.collide(firstDoor.sprite, box3.sprite2);
        game.physics.arcade.collide(secondDoor.sprite, box3.sprite2);
        game.physics.arcade.collide(thirdDoor.sprite, box3.sprite2);
        var hitPlatform3 = game.physics.arcade.collide(box.sprite2,platforms.platforms);
        var hitPlatform3 = game.physics.arcade.collide(box2.sprite2,platforms.platforms);
        var hitPlatform3 = game.physics.arcade.collide(box3.sprite2,platforms.platforms);
        if(spider!=null){
            spider.bustJumpPower = -1050;
            game.physics.arcade.collide(box.sprite, spider.sprite);
            game.physics.arcade.collide(box2.sprite, spider.sprite);
            game.physics.arcade.collide(box3.sprite, spider.sprite);
            game.physics.arcade.collide(firstDoor.sprite, spider.sprite);
            game.physics.arcade.collide(secondDoor.sprite, spider.sprite);
            game.physics.arcade.collide(thirdDoor.sprite, spider.sprite);
            var hitPlatform2 = game.physics.arcade.collide(spider.sprite,platforms.platforms);
            burstPlatforms.update()
        }

        var hitPlatform = game.physics.arcade.collide(player.sprite,platforms.platforms);
        if(roboEnemy!=null){

          var hitPlatformRobo=game.physics.arcade.collide(roboEnemy.sprite,platforms.platforms);
        }
                var hitPlatformRobo=game.physics.arcade.collide(roboEnemy2.sprite,platforms.platforms);
                if(roboEnemy!=null){

                  var helpSamuraiDeath= game.physics.arcade.collide(box3.sprite2,roboEnemy.sprite)
                }
                else{
                  var helpSamuraiDeath=false;
                }
        //var bustJump = game.physics.arcade.collide(player.sprite,platformsbustJump);

        for(let i = 0; i < GameElements.length; i++){
            GameElements[i].update();
        }
        ending.update()

        if(roboEnemy!=null){

          if(helpSamuraiDeath){
            var ind = GameElements.indexOf(roboEnemy);
            if (ind > -1) {
              GameElements.splice(ind, 1);
            }
            roboEnemy.sprite.destroy();
            roboEnemy=null;
          }
        }

    }
}

function render() {
    game.debug.text('Timer: ' + Math.round(this.game.time.totalElapsedSeconds() * 100) / 100, 1170, 10);
    game.debug.text('Switch flips : ' + switchFlips, 1150, 30);


}
