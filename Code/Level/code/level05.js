var game = new Phaser.Game(3000,1300, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});


var switchFlips = 0;

function preload(){
    game.load.image('loading','../assets/loading.png');
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.advancedTiming = true;

}
function start(){
    game.load.image('level', '../assets/level05.png');
    game.load.image('ground', '../assets/platform.png');
    game.load.spritesheet('spider', '../assets/spider.png',30, 18);
    game.load.spritesheet('player', '../assets/player.png',51, 105);
    game.load.spritesheet('guard', '../assets/guard(309x144)_3.png',101,46);
    game.load.spritesheet('smokingJoe','../assets/smoking_joe.png',40,47);

    //MENU
    game.load.spritesheet('HelpMenu','../assets/HelpMenu.png',1300,675);
    game.load.spritesheet('soundGame','../assets/soundGame.png',36,54);
    game.load.spritesheet('exitGame','../assets/exitGame.png',36,54);
    game.load.spritesheet('resetGame','../assets/resetGame.png',36,54);
    game.load.spritesheet('pauseGame','../assets/pauseGame.png',36,54);

    // SOUNDTRACK
    game.load.audio('soundtrack', '../assets/soundtrack0.mp3');
    game.load.audio('soundtrackH', '../assets/soundtrack0H.mp3');

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
        game.camera.bounds.width = 4000;
        game.camera.bounds.height = 900;
        game.camera.bounds.y = 520;
        game.camera.lerpX =0.1


        background = game.add.sprite(0, 510, 'level');
        background.autoColl = true;

        platforms = new Walls();
        burstPlatforms = new BurstPlatforms();
        priorityObj = new Array();

        platforms.addWall(0   ,1038,9,2,false);


        localDataBase = JSON.parse(localStorage.getItem('items'));

        // Game Elements
        GameElements    = new Array();
        dark = null
        roboEnemy       = new SamuraiCop(3000,200,false,0,null,null,'Hard');
        roboEnemy.sprite.animations.play('idleLeft')
        spider = null
        player          = new Player(20, 900, false);
        spider = new Spider(80,1000,false)
        smoking_joe=new smokingJoe(1685,890);


        player.ownSpider = true

        // Audio
        soundtrack = game.add.audio('soundtrack');
        soundtrackH = game.add.audio('soundtrackH');
        localDataBase = JSON.parse(localStorage.getItem('items'))
        soundtrack.loopFull();
        soundtrackH.loopFull();
        soundtrackH.volume = localDataBase.gameMusicVol/100;
        soundtrack.volume = localDataBase.gameMusicVol/100;
        soundtrackH.mute = true;

        spiderTalk = new Talk([0, 800, 100, 200], [

            new ScriptAction(spider, "Really?", [10,0],100,null,1),
            new ScriptAction(spider, "Not a single thank you?", [10,0],200,null,2),
            new ScriptAction(spider, "Guess hackerboys don't have many friends...", [10,0],400,null,3),
            new ScriptAction(spider, null,null,600,null,4.5),

            new ScriptAction(spider, "Don't think A.I. counts for much,\n if you think about it.", [10,0],700,null,4),
            new ScriptAction(spider, null,null,1100,null,4),

            new ScriptAction(spider,"Data's Hall! Yeah, screw those guys.",[10,0],null,null,3),
            new ScriptAction(spider,"Never work for them.",[10,0],null,null,2),
            new ScriptAction(spider,"Not that you could, \nnow that you've robbed them.",[10,0],null,null,3),
            new ScriptAction(spider,"...",[10,0],null,null,2),
            new ScriptAction(spider,"But thanks though.",[10,0],null,null,2),
            new ScriptAction(spider,"This is a lot to take in",[10,0],null,null,2),
            new ScriptAction(spider,"You should take a seat.",[10,0],null,null,2),
            new ScriptAction(spider,null,null,null,null,9),

            new ScriptAction(spider,"Innocent much?",[10,0],1400,null,2),
            new ScriptAction(spider,"Watch this!",[10,0],1600,null,2),
            new ScriptAction(spider,"Hey Joe! How was work today?",[10,0],1800,null,3),
//olo
            new ScriptAction(spider,"Hum...",[100,-150],null,null,1),
            new ScriptAction(spider,"...",[100,-150],null,null,2),
            new ScriptAction(spider,"... ...",[100,-150],null,null,2),
            new ScriptAction(spider,"... ... ...",[100,-150],null,null,2),
            new ScriptAction(spider,"It went by fast.",[100,-150],null,null,3),

            new ScriptAction(spider,"Must happen a lot.",[10,0],null,null,3),
            new ScriptAction(spider,"I'd guess.",[10,0],2000,null,3),
            new ScriptAction(spider,null,null,null,null,3),

            new ScriptAction(spider,"What happens to them all...",[10,0],2500,null,3),
            new ScriptAction(spider,"See that guy?",[10,0],null,null,3),
            new ScriptAction(spider,"Don't get close to that guy.",[10,0],null,null,3),
            new ScriptAction(spider,"He won't hesitate to kill you \njust because you're a kid.",[10,0],null,null,4),
            new ScriptAction(spider,"He has no idea what he is doing.",[10,0],null,null,3)
            //85.5
        ]);

        playerTalk = new Talk([0,800, 100, 200],[
            new ScriptAction(player,null,null,300,null,6),
            new ScriptAction(player,"Haven't needed many.",[15,-45],450,null,2),
            new ScriptAction(player,"Well, now I have you.",[15,-45],600,null,2.5),
            new ScriptAction(player,null,null,700,null,4),

            new ScriptAction(player,"If it didn't, people in this city \nwouldn't have any friends",[15,-45],1000,[200,null,null,null],4),
            new ScriptAction(player,null,null,800,null,16),

            new ScriptAction(player,"Yeah...",[15,-45],900,null,1),
            new ScriptAction(player,"Dont' think so.",[15,-45],1000,null,2),
            new ScriptAction(player,"Those benches \nmake my butt hurt.",[15,-45],1050,null,2),
            new ScriptAction(player,"...",[15,-45],1100,null,1),
            new ScriptAction(player,"But are they \nreally that bad?",[15,-45],null,null,3),
            new ScriptAction(player,null,null,1550,null,20),
            new ScriptAction(player,null,null,2000,null,3),

            new ScriptAction(player,"What just happened?",[15,-45],null,null,3),
            new ScriptAction(player,"*lookUp",null,null,[1600,null,null,null],3),
            new ScriptAction(player,null,null,2500,null,13)
        ])

        ////Stealth Mode Elements
        GameElements = [player,spiderTalk,playerTalk]

        controls = {
            right:  this.input.keyboard.addKey(Phaser.Keyboard.D),
            left:   this.input.keyboard.addKey(Phaser.Keyboard.A),
            up:     this.input.keyboard.addKey(Phaser.Keyboard.W),
            down:   this.input.keyboard.addKey(Phaser.Keyboard.S),
            interact:   this.input.keyboard.addKey(Phaser.Keyboard.E),
            spacebar: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
        };

        game.time.events.add(Phaser.Timer.SECOND*85.5,winLevel ,this);
        function winLevel(){
            var mainSource=window.parent
            mainSource.postMessage('Question1.html', '*');
        }
    }
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@--Update---@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
function update(){

    if(loaded){
        game.physics.arcade.collide(roboEnemy.sprite,platforms.platforms);
        //game.camera.update();
        if(spider != null){
            game.physics.arcade.collide(spider.sprite,platforms.platforms);
            spider.update()

        }
        game.physics.arcade.collide(player.sprite,platforms.platforms);
        for(let i = 0; i < GameElements.length; i++){
            GameElements[i].update();

        }


    }
}



function render() {
    game.debug.text('Timer: ' + Math.round(this.game.time.totalElapsedSeconds() * 100) / 100, 1170, 10);
    game.debug.text('Switch flips : ' + switchFlips, 1150, 30);

   /* if(loaded){

        game.debug.text('spider ' + spider.sprite.centerX,2, 20)
        game.debug.text('player ' + player.sprite.centerX,2, 30)
    }*/
   //game.debug.cameraInfo(game.camera, 32, 32);
   //game.debug.spriteCoords(player.sprite, 32, 500);
   //game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
}
