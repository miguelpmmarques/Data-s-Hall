var game = new Phaser.Game(2700,1300, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

//look left
//follow
var switchFlips = 0;
function preload(){
    game.load.image('loading','../assets/loading.png');
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.startSystem(Phaser.Physics.P2JS);

}
function start(){
    game.load.image('level', '../assets/level2.png');
    game.load.image('ground', '../assets/platform.png');
    game.load.spritesheet('dark','../assets/dark.png',45,21);
    game.load.spritesheet('spider', '../assets/spider.png',30, 18);
    game.load.spritesheet('box','../assets/box.png',60,84);
    game.load.spritesheet('camera', '../assets/securityCamera.png',963,201);
    game.load.spritesheet('player', '../assets/player.png',51, 105);
    game.load.spritesheet('elevator', '../assets/elevator.png', 120,165);
    game.load.image('box_bare','../assets/box_bare.png');
    game.load.spritesheet('robo','../assets/Robo_punk_street.png',120,141);
    game.load.spritesheet('energyball','../assets/energy_ball.png',90,60);
    game.load.spritesheet('questionMark','../assets/QuestionMark.png',36,54);
    game.load.spritesheet('exclamationPoint','../assets/Exclamation.png',18,48);
    game.load.spritesheet('guard', '../assets/guard(309x144)_3.png',101,46);


    //MENU
    game.load.spritesheet('HelpMenu','../assets/HelpMenu.png',1300,675);
    game.load.spritesheet('soundGame','../assets/soundGame.png',36,54);
    game.load.spritesheet('exitGame','../assets/exitGame.png',36,54);
    game.load.spritesheet('resetGame','../assets/resetGame.png',36,54);
    game.load.spritesheet('pauseGame','../assets/pauseGame.png',36,54);
    game.load.audio('soundtrack', '../assets/soundtrack0.mp3');
    game.load.audio('soundtrackH', '../assets/soundtrack0H.mp3');
    // SOUNDTRACK
    game.load.audio('soundtrack', '../assets/soundtrack2.mp3');
    game.load.audio('soundtrackH', '../assets/soundtrack2H.mp3');
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
    game.load.audio('sepukku','../assets/sepukku.wav');
    game.load.audio('explosion','../assets/som.wav');
    // HACKER MODE
    game.load.script('BlurX', '../assets/BlurX.js');
    game.load.script('BlurY', '../assets/BlurY.js');
    game.load.script('gray', '../assets/filter.js');

    game.load.start();
}

function loadStart(){

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
        background.smoothed = false
        background.scale.setTo(3,3)
        background.autoColl = true;
        //Filters
        gray = game.add.filter('Gray');
        blurX = game.add.filter('BlurX');
        blurY = game.add.filter('BlurY');
        blurX.blur = 10;
        blurY.blur = 10;

        platforms = new Walls();
        burstPlatforms = new BurstPlatforms();

        // MAP ELEMENTS//
        platforms.addWall(0      ,580,80,1,false);
        platforms.addWall(2635   ,80,0.01,80,false);

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
        soundEffectsList.push(sepukku=game.add.audio('sepukku'));
        soundEffectsList.push(explosion=game.add.audio('explosion'));
        energyOn.volume= localDataBase.gameMusicVol/100;
        energyOff.volume= localDataBase.gameMusicVol/100;
        swordSlash.volume= localDataBase.gameMusicVol/100;
        energyShot.volume= localDataBase.gameMusicVol/100;
        dieSound.volume= localDataBase.gameMusicVol/100;
        lazerSound.volume=localDataBase.gameMusicVol/300;
        elevatorSound.volume=localDataBase.gameMusicVol/200;
        lightsOn.volume=localDataBase.gameMusicVol/200;
        lightsOn.loopFull();
        doorUnlock.volume=localDataBase.gameMusicVol/100;
        doorLock.volume=localDataBase.gameMusicVol/100;
        spiderJump.volume=localDataBase.gameMusicVol/100;
        sepukku.volume=localDataBase.soundEfectsVol/100;
        explosion.volume=localDataBase.soundEfectsVol/100;

        // Game Elements
        GameElements    = new Array();

        player          = new Player(563, 400, false);
        elevatorEnd        = new ElevatorWin(2300,416, true, -1,'../level/HTML/level3.html',2);
        cam             = new SecurityCamera(1450,375,true);
        cam2             = new SecurityCamera(450,375,true);
        dark=null;
        cam.sprite.frame = 8
        cam2.sprite.frame = 8
        GameElements.push(player)
        GameElements.push(elevatorEnd)

        player.onwSpider = true;
        spider          = new Spider(400,450,true);
        player.sprite.visible=false;
        priorityObj = []
        allEnemies=[];
        allEnemies.push(enemy1=new SamuraiCop(1600,400,true,0,null,null,'Hard'));
        allEnemies.push(enemy2=new SamuraiCop(900,400,true,0,null,null,'Hard'));
        allEnemies.push(enemy3=new SamuraiCop(1400,400,true,0,null,null,'Hard'));
        allEnemies.push(enemy4=new SamuraiCop(1500,400,true,0,null,null,'Hard'));
        allEnemies.push(enemy5=new RobotPunk(1000,410,true,2,1800,400,false,10,2680,'Hard'));
        allEnemies.push(enemy6=new RobotPunk(1700,410,true,1,1800,400,false,10,2680,'Hard'));
        allEnemies.push(enemy7=new RobotPunk(1800,410,true,2,1800,400,false,10,2680,'Hard'));
        allEnemies.push(enemy8=new RobotPunk(1900,410,true,1,1800,400,false,10,2680,'Hard'));
        allEnemies.push(enemy9=new SamuraiCop(1900,400,true,0,null,null,'Hard'));
        allEnemies.push(enemy10=new SamuraiCop(700,400,true,0,null,null,'Hard'));
        allEnemies.push(enemy11=new RobotPunk(500,410,true,2,1800,400,false,10,2680,'Hard'));
        allEnemiesCounter=allEnemies.length;
        GameElements.push(enemy1);
        GameElements.push(enemy2);
        GameElements.push(enemy3);
        GameElements.push(enemy4);
        GameElements.push(spider);
        GameElements.push(enemy5);
        GameElements.push(enemy6);
        GameElements.push(enemy7);
        GameElements.push(enemy8);
        GameElements.push(enemy9);
        GameElements.push(enemy10);
        GameElements.push(enemy11);
        player.sprite.bringToTop()
        ending = new Talk(null,[
            new ScriptAction(player, "*player", [1200,520],null,null,0.1),
            new ScriptAction(player,"*setCam", null,null,null,0.1),
            new ScriptAction(player, "...",[20,-40],2300,null,5),
            new ScriptAction(spider, "*off",null,null,null,0.1),
            new ScriptAction(player,"*on", null,null,null,0.1),

        ])
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
      ending.update()
      if(allEnemiesCounter==0){

        if(player.sprite.visible==false){
          //start cutscene
         
          ending.active = true
          player.sprite.visible=true;
        }
      }
        game.camera.update();

        if(spider!=null){
            var hitPlatform2 = game.physics.arcade.collide(spider.sprite,platforms.platforms);
            burstPlatforms.update()
        }
        game.physics.arcade.collide(player.sprite,platforms.platforms);
        game.physics.arcade.collide(enemy1.sprite,platforms.platforms);
        game.physics.arcade.collide(enemy2.sprite,platforms.platforms);
        game.physics.arcade.collide(enemy3.sprite,platforms.platforms);
        game.physics.arcade.collide(enemy4.sprite,platforms.platforms);
        game.physics.arcade.collide(enemy5.sprite,platforms.platforms);
        game.physics.arcade.collide(enemy6.sprite,platforms.platforms);
        game.physics.arcade.collide(enemy7.sprite,platforms.platforms);
        game.physics.arcade.collide(enemy8.sprite,platforms.platforms);
        game.physics.arcade.collide(enemy9.sprite,platforms.platforms);
        game.physics.arcade.collide(enemy10.sprite,platforms.platforms);
        game.physics.arcade.collide(enemy11.sprite,platforms.platforms);
        var hitPlatform = game.physics.arcade.collide(player.sprite,platforms.platforms);
        //var bustJump = game.physics.arcade.collide(player.sprite,platformsbustJump);

        for(let i = 0; i < GameElements.length; i++){
            GameElements[i].update();
        }

    }
}



function render() {
    game.debug.text('Timer: ' + Math.round(this.game.time.totalElapsedSeconds() * 100) / 100, 1170, 10);
    game.debug.text('Switch flips : ' + switchFlips, 1150, 30);


}
