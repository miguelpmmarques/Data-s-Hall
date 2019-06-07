function writePrompt(x,y,text){

    let prompt_text = game.add.text(x, y, text, {font:"22px moab", fill:"#FFFFFF"});

    //prompt_text.inputEnabled = true;
    game.time.events.add(Phaser.Timer.SECOND*0.01,removePrompt ,this);


    function removePrompt() {
        game.world.remove(prompt_text);
        prompt_text = undefined;
    }
}
class ScriptAction{
    constructor(subject, text, textOffset, newLocationX,newCamLocation, duration){
        this.subject = subject
        this.text = text
        this.newLocationX = newLocationX
        this.newCamLocation = newCamLocation
        this.duration = duration
        if(textOffset != null){
            this.xOffset = textOffset[0]
            this.yOffset = textOffset[1]
        }else{
            this.xOffset = 0
            this.yOffset = 0
        }

        if(this.newLocationX != null && this.subject != null){
            this.walkSpeed = 0.6*Math.abs(this.subject.sprite.centerX - this.newLocationX)/this.duration

        }else{
            this.walkSpeed = null;
        }

    }


    play(){

        if(this.text != null){
            if(this.subject != null){
                switch(this.text){
                    case "*tp":

                            player.hasSpider = false
                            spider.sprite.visible = true;
                            spider.makeIdle()
                            spider.teleport(this.xOffset,this.yOffset)

                            break
                    case "*off":
                        if(this.subject != null){
                            this.subject.state = false;
                        }
                        break
                    case "*on":
                        if(this.subject != null){
                            this.subject.state = true;
                        }
                        break
                    case "*offAll":
                        spider.state = false
                        player.state = false
                        break
                    case "*onAll":
                        spider.state = true
                        player.state = true
                        break
                    case "*setCam":
                        if(this.subject != null)
                        game.camera.follow(this.subject.sprite,1,0.7)
                        break
                    case "*hack":
                        player.sprite.animations.play("hackRight")
                        break
                    case "*player":
                        player.visible = true
                        player.sprite.centerX = this.xOffset
                        player.sprite.centerY = this.yOffset
                        break
                    case "*lookUp":
                        player.sprite.frame = 20
                        break
                    case "*lookUpL":
                        player.sprite.frame = 21
                        break
                    case "*die":
                        player.sprite.animations.play("dieLeftsafe")
                        break
                    case "*invisible":
                        this.subject.sprite.visible = false
                        break
                    case "*transform":
                        ai.transformAnim.play()
                        break
                    case "*shake":
                        game.camera.shake()
                        break
                    default:
                        writePrompt(this.subject.sprite.centerX + this.xOffset, this.subject.sprite.centerY + this.yOffset,this.text)
                }
            }else{
                 writePrompt(this.xOffset,this.yOffset,this.text)
            }
        }
        if(this.newLocationX != null){
            if(this.walkSpeed == null){
                this.walkSpeed = 0.6*Math.abs(this.subject.sprite.centerX - this.newLocationX)/this.duration
            }
            this.subject.moveTowards(this.newLocationX, this.walkSpeed)
        }

        if(this.newCamLocation != null){

        }
    }
}


class Talk{
    constructor(bounds, scenes){

        if(bounds != null){
            this.x      = bounds[0];
            this.y      = bounds[1];
            this.lenght = bounds[2];
            this.height= bounds[3];


        }else{
            this.x = null;
        }
        this.scenes = scenes;
        this.active = false;
        this.done   = false;
        this.started = false;
        this. currentScene = null;
    }

    setScene(){
        var count = 0;
        var sum = 0;
        if(this.scenes[0].subject == null){
            this.scenes[0].subject = spider
        }
        if(this.scenes[0].subject != null){
            this.scenes[0].subject.state = false;
        }

        game.time.events.add(0, switchScene, this);
        for(let i = 1; i < this.scenes.length; i++){
            if(this.scenes[i].subject == null){
                this.scenes[i].subject = spider
            }
            sum += this.scenes[i-1].duration;
            game.time.events.add(Phaser.Timer.SECOND * sum, switchScene, this);
        }

        game.time.events.add(Phaser.Timer.SECOND *(sum +this.scenes[this.scenes.length-1].duration ), stop, this);
        function switchScene(){
            if(count > 0){
                if(this.scenes[count-1].subject != null){
                    this.scenes[count-1].subject.sprite.body.velocity.x = 0;
                    this.scenes[count-1].subject.makeIdle()
                }
            }
            this.currentScene = this.scenes[count]
            count++;
        }
        function stop(){
            if(this.scenes[0].subject != null){
                this.scenes[0].subject.state = true;
            }
            this.done = true
        }
    }
    update(){
        if(!this.done){
            if(this.active){
                if(this.started){
                    if(this.currentScene != null){
                        this.currentScene.play()
                    }
                }else{
                    this.setScene()
                    player.makeIdle()
                    if(spider!=null){
                        spider.sprite.body.velocity.x = 0
                    }
                    player.sprite.body.velocity.x =0
                    this.started = true;
                }
            }else{
                if(this.x != null){
                    if(player.sprite.centerX > this.x && player.sprite.centerX < this.x + this.lenght && player.sprite.centerY > this.y && player.sprite.centerY < this.y + this.height){

                        this.active = true
                    }
                }
            }
        }
    }

}

class Loading{
    constructor(x,y,x2,y2){
        this.minDist = 400;
        this.sprite = game.add.sprite(x,y,'loading');
        this.sprite2 = game.add.sprite(x2,y2,'loading');
        this.sprite.scale.setTo(1,1);
        this.sprite2.scale.setTo(1,1);
        game.physics.arcade.enable(this.sprite);
        game.physics.arcade.enable(this.sprite2);
        this.speed = 400;
        this.stop = false;

    }
    update(){
        this.sprite.body.velocity.x =0;
        this.sprite2.body.velocity.x = 0;

        if(this.sprite2.body.x <= this.sprite.body.x ){
            this.stop = true;


        }else if(!this.stop){
            this.sprite.body.velocity.x = this.speed;
            this.sprite2.body.velocity.x = -this.speed;
        }
    }

}

class Button {
    constructor(x, y, sprite){
        //this.sprite = game.add.sprite(x, y, sprite);
        this.button = game.add.button(x, y, sprite, function clickEventLister() {
            this.actionOnClick()
        }, this, 1, 0, 2);
        this.button.fixedToCamera = true;
    }
    actionOnClick (){ return 0;}
}

class ExitBtn extends Button {
    constructor(x, y, sprite) {
        super(x, y, sprite);
    }
    actionOnClick (){
       var mainSource=window.parent
       mainSource.postMessage('MainMenu.html', '*');
   }
}
class PauseBtn extends Button {
    constructor(x, y, sprite) {
        super(x, y, sprite);
        soundGame.button.visible=false;
        exitGame.button.visible=false;
        resetGame.button.visible=false;
        this.spriteMenu = game.add.sprite(150,100, "HelpMenu");
        this.spriteMenu.scale.setTo(0.8,0.8);
        this.spriteMenu.fixedToCamera = true;
        this.spriteMenu.visible = false;

    }
    actionOnClick (){
        let blurX = game.add.filter('BlurX');
        let blurY = game.add.filter('BlurY');
        blurX.blur = 40;
        blurY.blur = 40;
        if (game.paused) {
            background.filters = undefined;
            for (var i = 0; i < GameElements.length; i++) {
                GameElements[i].setFilter( undefined);
            }
            soundGame.button.visible=false;
            exitGame.button.visible=false;
            resetGame.button.visible=false;
            this.spriteMenu.visible = false;
            game.paused = false;
        }else {
            background.filters = [blurX,blurY];
            for (var i = 0; i < GameElements.length; i++) {
                GameElements[i].setFilter([blurX,blurY]);
            }
            soundGame.button.visible=true;
            exitGame.button.visible=true;
            resetGame.button.visible=true;
            this.spriteMenu.visible = true;
            game.paused = true;
        }
   }
}
class OptionsBtn extends Button {
    constructor(x, y, sprite) {
        super(x, y, sprite);
        this.soundOn=true;
    }
    actionOnClick (){
        function updateSoundEffectsVolume(volume,proceed){
          if(proceed){
            for(let i=0;i<soundEffectsList.length;i++){
              if(soundEffectsList[i]!=null){
                soundEffectsList[i].volume=volume/200;
              }
            }
        }
      }
        if (this.soundOn) {
            this.button.setFrames(1,2,0);
            this.soundOn=false;
            soundtrack.pause()
            soundtrackH.pause()


            updateSoundEffectsVolume(0,loaded);
        }
        else {
            this.button.setFrames(1,0,2);
            this.soundOn=true;
            soundtrack.resume()
            soundtrackH.resume()
            var localDataBase = JSON.parse(localStorage.getItem('items'));
            updateSoundEffectsVolume(localDataBase.soundEfectsVol,loaded)
        }
   }
}
class ResetBtn extends Button {
    constructor(x, y, sprite) {
        super(x, y, sprite);
    }
    actionOnClick (){
      var mainSource=window.parent
      var localDataBase = JSON.parse(localStorage.getItem('items'));
      mainSource.postMessage('../level/HTML/Level'+localDataBase.actUser.levelSelected+'.html', '*');
   }
}

class GameObject{
    constructor(x, y, state, prompt, sprite, viewDistance){
        this.state = state;//se tem corrente
        this.prompt = prompt;
        this.viewDistance = viewDistance;
        this.sprite = game.add.sprite(x, y, sprite);
    }
    update(){return 0;}
    promptIntersection(){
        var check_intersection =player.sprite.overlap(this.sprite);//hack_point.sprite.overlap(player.sprite);
        var check_interaction = controls.interact.isDown;
        var x = this.sprite.centerX - 30;
        var y = this.sprite.centerY - 50;

        if(check_intersection && !check_interaction ){
            player.intriguedDown = true;
            writePrompt(x,y,this.prompt);
        }
    }

    callAttention(){
        if(Math.abs(this.sprite.centerX - player.sprite.centerX) < this.viewDistance && Math.abs(player.sprite.centerY - this.sprite.centerY) < 100){
            if(player.sprite.centerX > this.sprite.centerX){
                player.attentionDirection = 1;
            }else{
                player.attentionDirection = 0;
            }
        }
    }
    changeState(newState){
        this.state = newState;
    }

    setFilter(filters){
        this.sprite.filters = filters;
    }
}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ CLASSE APENAS DO NIVEL 0 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
class LockDoor extends GameObject{
    constructor(x, y, state,scalex,scaley){
        super(x, y, state,'dark','dark', 50);
        this.sprite.scale.setTo(scalex,scaley)
        this.firstEntry = true
        this.sprite.alpha = 0;
    }
    update(){
        let check_intersection_P = player.sprite.overlap(this.sprite);
        if (check_intersection_P && this.firstEntry) {
            let endClose = thirdDoor.sprite.animations.getAnimation("close");
            endClose.onComplete.addOnce(function(){
                thirdDoor.sprite.frame = 6;
            }, this);
            this.firstEntry = false;
            thirdDoor.close()
        }
    }
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ CLASSE APENAS DO NIVEL 2 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
class GoToPart2 extends GameObject{
    constructor(x, y, state,scalex,scaley){
        super(x, y, state,'Lets go','dark', 50);
        this.sprite.scale.setTo(scalex,scaley)
        this.sprite.alpha = 0;
    }
    update(){
        let check_intersection_P = player.sprite.overlap(this.sprite);
        if (check_intersection_P) {
            var localDataBase = JSON.parse(localStorage.getItem('items'));
            localDataBase.actUser.level2Part1Time = Math.round(game.time.totalElapsedSeconds() * 100) / 100;
            localStorage.setItem('items',JSON.stringify(localDataBase));

            let mainSource=window.parent
            mainSource.postMessage('../level/HTML/level2Part2.html', '*');
        }
    }
}

class GameWin extends GameObject{
    constructor(x, y, state,scalex,scaley){

        super(x, y, state,'You must have the spider with you','dark', 50);
        this.sprite.scale.setTo(scalex,scaley)
        this.firstEntry = true
        this.sprite.alpha = 0;
    }
    update(){
        let check_intersection_P = player.sprite.overlap(this.sprite);
        if (check_intersection_P && player.gameWin) {
            if (player.hasSpider) {
                // Ainda poderar se meto aqui um menuzinho
                var localDataBase = JSON.parse(localStorage.getItem('items'));
                if (localDataBase.actUser.level == 0) {
                    localDataBase.actUser.level = 1;
                }
                if (localDataBase.actUser.index == 1) {
                    localDataBase.slotLoad1 = localDataBase.actUser;
                }
                else if (localDataBase.actUser.index == 2) {
                    localDataBase.slotLoad2 = localDataBase.actUser;
                }
                else {
                    localDataBase.slotLoad3 = localDataBase.actUser;
                }
                localDataBase.actUser.level0Switch =switchFlips;
                localDataBase.actUser.level0Time = Math.round(game.time.totalElapsedSeconds() * 100) / 100;
                localDataBase.actUser.totaltime = localDataBase.actUser.level0Time +localDataBase.actUser.level1Time +localDataBase.actUser.level2Time +localDataBase.actUser.level3Time;
                localDataBase.actUser.totalSwitch = localDataBase.actUser.level0Switch+localDataBase.actUser.level1Switch+localDataBase.actUser.level2Switch+localDataBase.actUser.level3Switch;
                localStorage.setItem('items',JSON.stringify(localDataBase));
                var mainSource=window.parent
                mainSource.postMessage('../level/HTML/level05.html', '*');
            }
            else {
                let x = this.sprite.centerX - 90;
                let y = this.sprite.centerY + 50;
                player.intriguedDown = true;
                writePrompt(x,y,this.prompt);
            }
        }

    }
    promptIntersection(){
        var check_intersection =player.sprite.overlap(this.sprite);//hack_point.sprite.overlap(player.sprite);

        var x = this.sprite.centerX - 30;
        var y = this.sprite.centerY + 50;

        if(check_intersection){
            player.intriguedDown = true;
            writePrompt(x,y,this.prompt);
        }
    }
}

class HackableTalk extends GameObject{
    constructor(x,y,sprite,talk,hackPoint,winCond){
        super(x,y,false,"Spy",sprite,0)
        this.sprite.smoothed = false
        this.sprite.scale.setTo(3,3)
        this.talk = talk
        this.hackPoint = hackPoint
        this.unlocked = false
        this.avoidSpam = false
        this.winCond = winCond
        this.winCond.sprite.bringToTop()

    }

    changeState(newState){
        this.state = newState
        if(newState && !this.unlocked ){
            this.unlocked = true
        }
    }
    update(){
        if(this.state){
            if(this.sprite.overlap(player.sprite) && controls.interact.isDown && !this.avoidSpam && !controls.spacebar.isDown){
                this.talk.active = true
                this.winCond.entry = true

                this.avoidSpam = true
                game.time.events.add(Phaser.Timer.SECOND * 0.5, enableAgain, this);
            }
            this.promptIntersection()
        }
        function enableAgain(){
            this.avoidSpam = false
            this.prompt = null
        }
    }
    changeHackPoint(){
        if (this.sprite.overlap(player.sprite)) {
            return true;
        }
        else {
            return false;
        }

    }
}

class Zones2Win extends GameObject{
    constructor(x, y,scalex,scaley,entry){

        super(x, y, true,null,'dark', 50);
        this.sprite.scale.setTo(scalex,scaley)
        this.sprite.alpha = 1;
        this.entry = entry

        function restore(){
            this.midAnim = false;
        }
    }
    unlock(newState){
        this.sprite.alpha = 0;

    }
}

class Level2Part2Win extends GameObject{
    constructor(x, y,scalex,scaley,talk){
        super(x, y, true,null,'dark', 50);
        this.sprite.scale.setTo(scalex,scaley)
        this.sprite.alpha = 1;
        this.two   = new Zones2Win(1010,120,13.2,12,false)
        this.three   = new Zones2Win(160,350,13.6,12,false)//meeting
        this.four = new Zones2Win(160,100,18.3,12,false)//workOffice
        this.gameWin = false
        this.talk = talk
    }


    update(){
        let check_intersection_P = player.sprite.overlap(this.sprite);
        let check_intersection_P2 = player.sprite.overlap(this.two.sprite);
        let check_intersection_P3 = player.sprite.overlap(this.three.sprite);
        let check_intersection_P4 = player.sprite.overlap(this.four.sprite);
        if (check_intersection_P) {
            this.sprite.alpha = 0;

        }
        if (check_intersection_P2) {
            this.two.unlock()
        }
        if (check_intersection_P3) {
            this.three.unlock()
            this.three.entry = true
        }
        if (check_intersection_P4) {
            this.four.unlock()
        }
        if (this.gameWin == false) {
            if (this.two.entry && this.three.entry &&this.four.entry) {
                this.gameWin =  true

                this.part3           = new GoToPart3(1717,440,true,3,12,this.talk);
            }
        }
        if (this.part3 ) {
            this.part3.update()
        }

    }

}
class GoToPart3 extends GameObject{
    constructor(x, y, state,scalex,scaley,talk){
        super(x, y, state,'Lets go','dark', 50);
        this.sprite.scale.setTo(scalex,scaley)
        this.sprite.alpha = 0;
        this.talk = talk
    }
    update(){
        let check_intersection_P = player.sprite.overlap(this.sprite);
        if (check_intersection_P) {
            this.talk.active = true
            let mainSource=window.parent
            game.time.events.add(Phaser.Timer.SECOND *17, end, this);
            function end(){
                var localDataBase = JSON.parse(localStorage.getItem('items'));
                localDataBase.actUser.level2Switch =switchFlips;
                localDataBase.actUser.level2Time = Math.round(game.time.totalElapsedSeconds() * 100) / 100 + localDataBase.actUser.level2Part1Time;
                localDataBase.actUser.totaltime = localDataBase.actUser.level0Time +localDataBase.actUser.level1Time +localDataBase.actUser.level2Time +localDataBase.actUser.level3Time;
                localDataBase.actUser.totalSwitch = localDataBase.actUser.level0Switch+localDataBase.actUser.level1Switch+localDataBase.actUser.level2Switch+localDataBase.actUser.level3Switch;
                localStorage.setItem('items',JSON.stringify(localDataBase));
                mainSource.postMessage('../level/HTML/level2Part3.html', '*');
            }
        }
    }
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@classes nivel  3@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
class Project2051{
    constructor(x,y){
        this.sprite = game.add.sprite(x, y, "p2051");
        this.sprite2=game.add.sprite(x+30,y+363,'idleTransform');
        this.sprite2.visible=false;
        this.sprite.smoothed = false;
        this.sprite.scale.setTo(3,3);
        this.sprite2.smoothed = false;
        this.sprite2.scale.setTo(3,3);
        game.physics.arcade.enable(this.sprite2);
        this.deathAnim=this.sprite.animations.add("death",[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],10,false);
        this.birthAnim=this.sprite.animations.add("birth",[26,27,28,29,30,31,32,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59],10,false);
        this.idleAnim=this.sprite2.animations.add('idle',[18,19,20,21],5,true);
        this.transformAnim=this.sprite2.animations.add('transform',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,22],10,false);
        this.decision=null;
        this.birthAnim.onComplete.add(this.birthEnd,this);
        this.deathAnim.onComplete.add(this.deathEnd,this);
    }
    idleEnd(){
        this.transformAnim.play();

    }
    birthEnd(){

      this.idleAnim.play();
      try{
          end2.active=true;
          game.time.events.add(Phaser.Timer.SECOND * 22,this.oleAcabou,this);
      }
      catch(e){}
      //faz a tua cena if open
    }
    deathEnd(){
      //faz a tua cena sutia do mar;
      try{
        end1.active=true;
        game.time.events.add(Phaser.Timer.SECOND * 33,this.oleAcabou,this);
        }
        catch(e){}
    }
    end3End(){
        localDataBase = JSON.parse(localStorage.getItem('items'));
        localDataBase.actUser.EasterEgg3=true;
        localStorage.setItem('items',JSON.stringify(localDataBase));
        this.oleAcabou();
    }
    oleAcabou(){
        localDataBase = JSON.parse(localStorage.getItem('items'));
        localDataBase.actUser.level=4;
        localStorage.setItem('items',JSON.stringify(localDataBase));
        var mainSource=window.parent;
        mainSource.postMessage('Load.html','*');
    }
    update(){

      if(this.sprite.animations.currentFrame.index==59){
        this.sprite2.visible=true;
      }
      game.physics.arcade.collide(this.sprite2,platforms.platforms);
      if(this.decision==null){

        try{
          this.decision=decisionSwitch;
        }
        catch(e){

        }

      }
    }
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@classes gerais@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
class EasterEgg extends GameObject{
    constructor(x, y, state,level){
        super(x, y, state,null,'easterEgg', 50);
        this.level=level;
        this.sprite.animations.add('ee',[0,1,2,3,4],10,true);
        this.sprite.animations.play('ee');
        this.sprite.alpha = 0;
    }

    update(){
        if (spider) {
            var localDataBase = JSON.parse(localStorage.getItem('items'));
            let check_intersection_P = player.sprite.overlap(this.sprite);
            let check_intersection_S = spider.sprite.overlap(this.sprite);
            if (check_intersection_P || check_intersection_S) {
                this.sprite.visible = false;

                switch (this.level){
                  case 0:   localDataBase.actUser.EasterEgg0 = true;

                    break;
                  case 1:   localDataBase.actUser.EasterEgg1 = true;
                    break;
                  case 2:  localDataBase.actUser.EasterEgg2 = true;
                    break;
                  case 3:  localDataBase.actUser.EasterEgg3 = true;
                    break;
                }
            }
            localStorage.setItem('items',JSON.stringify(localDataBase));
        }
    }
}
class LootBox extends GameObject{
    constructor(x, y, state){
        super(x, y, state,'open','loot', 50);
        this.firstEntry = true
        var unbox = this.sprite.animations.add('unbox',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,8],10,false)
        unbox.onComplete.add(birthSpider, this);
        this.avoidSpam = false

        function birthSpider(){
            spider = new Spider(this.sprite.centerX+15, this.sprite.centerY+20, false)
            GameElements.push(spider);

            game.camera.follow(player.sprite,1,0.7)
            game.time.events.add(Phaser.Timer.SECOND , switchPrompt, this);
            spider.makeIdle()
            talk.active = true;

            function switchPrompt(){
                player.ownSpider = true;
                this.prompt = "press space to switch control";
            }
        }
    }
    promptIntersection(){
        var check_intersection = player.sprite.overlap(this.sprite);
        var x = this.sprite.centerX - 50;
        var y = this.sprite.centerY + 35;
        if(check_intersection && player.state ){
            player.intriguedDown = true;
            writePrompt(x,y,this.prompt);
        }
    }
    update(){
        let check_intersection_P = player.sprite.overlap(this.sprite);
        if (check_intersection_P && this.firstEntry && !this.avoidSpam && controls.interact.isDown && !controls.spacebar.isDown ) {
            this.avoidSpam = true;
            player.gameWin = true;

            player.hasSpider = false;
            this.firstEntry = false;
            this.sprite.animations.play('unbox');
        }
        if(player.state){
            this.promptIntersection()
        }

    }
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@GAME OBJECTS@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
class Player extends GameObject{
    constructor(x, y, state){
        super(x, y, state, null, 'player',null);
        this.hackerMode = false;
        this.avoidSpam = false;
        this.spawningSpider = false;
        this.attentionDirection = -1; //19 + (0->downLeft, 1->downRight, 2->upRight, 3->upLeft)// Negative if none
        this.lookingDirection = 1;// -1 = looking left  , 1 = looking right
        this.movingSpider = false;
        this.hide = false;
        this.ownSpider = false;
        this.gameWin = false;
        this.hasSpider = false;

        //physics
        this.speed = 400;
        game.physics.arcade.enable(this.sprite);
        //this.sprite.body.bounce.y = 0.2;
        this.sprite.body.gravity.y = 500;
        this.sprite.body.collideWorldBounds = true;

        game.camera.follow(this.sprite,1,0.7);
        //animations
        this.sprite.animations.add('left',[10,11,12,13,14,15,16,17],10,true);
        this.sprite.animations.add('right', [2,3,4,5,6,7,8,9], 10, true);
        this.sprite.animations.add('hackLeft',[22,23,24,25,26,27,28,29,30],10,true);
        this.sprite.animations.add('hackRight',[48,49,50,51,52,53,54,55,56],10,true);
        let dieL = this.sprite.animations.add('dieRight',[31,32,33,34,35,36,37,38,58],10,false);
        let dieR = this.sprite.animations.add('dieLeft',[59,60,61,62,63,64,65,66,58],10,false);
        this.sprite.animations.add('dieLeftsafe',[59,60,61,62,63,64,65,66,58],10,false);
        this.sprite.animations.add('idleRight',[39,40,41,42,39,40,41,42,43,44,45,46,47],5,true);
        this.sprite.animations.add('idleLeft', [57,67,68,69,70,71,72,73,74,75],5,true);
        let spiderSpawnR = this.sprite.animations.add('spiderSpawnR', [76,81,82,83,84,85,86,87,88,77],10,false);
        let spiderSpawnL = this.sprite.animations.add('spiderSpawnL', [89,94,95,96,97,98,99,100,101 ,101],10,false);
        let spiderSpawnR2 = this.sprite.animations.add('spiderSpawnR2',[78,79,80,1],10,false);
        let spiderSpawnL2 = this.sprite.animations.add('spiderSpawnL2', [90,91,92,93],10,false);
        spiderSpawnR.onComplete.add(spawnSpider1, this);
        spiderSpawnL.onComplete.add(spawnSpider1, this);
        spiderSpawnR2.onComplete.add(spawnSpider2,this);
        spiderSpawnL2.onComplete.add(spawnSpider2,this);
        dieL.onComplete.add(gameOver, this) ;
        dieR.onComplete.add(gameOver, this);
        //this.state = false;
        //this.sprite.frame = 91;

        function spawnSpider1(){

            if(spider == null){//spawn spider for the first time
                if(this.lookingDirection==1){
                    spider = new Spider(this.sprite.body.x - 20, this.sprite.body.y + 40, false);
                    this.sprite.animations.play('spiderSpawnR2');
                }else{
                    spider = new Spider(this.sprite.body.x + 40, this.sprite.body.y + 40, false);
                    this.sprite.animations.play('spiderSpawnL2');
                }
                GameElements.push(spider);
                priorityObj.push(spider);
            }else{
                spider.sprite.visible = true;
                spider.teleport(this.sprite.centerX, this.sprite.body.y + 40)
                spider.state = true;
                spider.landing = true;
                this.sprite.body.velocity.x = 0;
                spider.sprite.animations.play("spawn")
                if(this.lookingDirection==1){
                    this.sprite.animations.play('spiderSpawnR2');
                }else{
                    this.sprite.animations.play('spiderSpawnL2');
                }
            }

        }

        function spawnSpider2(){
            this.spawningSpider = false;

            this.deactivate();
        }

        function gameOver() {
            var mainSource=window.parent
            var localDataBase = JSON.parse(localStorage.getItem('items'));
            mainSource.postMessage('../level/HTML/Level'+localDataBase.actUser.levelSelected+'.html', '*');
        }

    }

    activate(){
        this.state = true;
        this.makeIdle()
        game.camera.follow(this.sprite,1,0.7);
    }
    makeIdle(rightAnim = "idleRight", leftAnim = "idleLeft"){
        if(this.lookingDirection == 1){
            this.sprite.animations.play(rightAnim);
        }else{
            this.sprite.animations.play(leftAnim);
        }
    }

    moveTowards(x, speed = this.speed, threshold = 50){//returns 0 if it met the objective point
        if(Math.abs(this.sprite.centerX - x) > threshold){
            if(this.sprite.centerX - x > 0){
                this.sprite.animations.play("left")
                this.lookingDirection = -1;
                this.sprite.body.velocity.x = -speed
            }else if(this.sprite.centerX - x < 0){
                this.sprite.animations.play("right")
                this.lookingDirection = 1
                this.sprite.body.velocity.x = speed
            }
            return 1
        }else{
            this.makeIdle()
            this.sprite.body.velocity.x = 0
            return 0
        }
    }

    deactivate(){
        this.avoidSpam = true;

        game.time.events.add(Phaser.Timer.SECOND * 0.5, enableAgain, this);
        this.state = false;
        this.sprite.body.velocity.x = 0;

        this.makeIdle("hackRight", "hackLeft")
        spider.activate();
        function enableAgain(){
            this.avoidSpam = false;
        }
    }
    spawnSpider(){
        this.spawningSpider = true;
        this.makeIdle("spiderSpawnR", "spiderSpawnL")
        this.sprite.body.velocity.x = 0;
    }

    die(){
        game.camera.shake()
        dieSound.play()
        this.sprite.body.velocity.x = 0
        this.state = false;
        this.makeIdle("dieRight", "dieLeft")
    }

    grabSpider(){
        spider.sprite.visible = false;
        this.hasSpider = true;
        spider.deactivate();
        this.activate();
    }

    update(){

        if (this.dead) {

            this.die()
        }
        if (this.ownSpider && spider) {
            if (spider.sprite.overlap(this.sprite) && !this.hasSpider) {
                if(spider.state){
                    writePrompt(this.sprite.centerX - 80,this.sprite.centerY - 50,"return");
                    if (controls.interact.isDown && spider.sprite.visible == true && this.spawningSpider == false && !controls.spacebar.isDown) {
                        this.grabSpider()
                    }
                }else if(this.state){
                    writePrompt(this.sprite.centerX - 80,this.sprite.centerY - 50,"grab");
                    if (controls.interact.isDown && spider.sprite.visible == true && this.spawningSpider == false && !controls.spacebar.isDown) {
                        this.grabSpider()
                    }
                }

            }
        }
        if (this.hackerMode) {
            if(this.sprite.animations.currentAnim.name != "hackRight" ||this.sprite.animations.currentAnim.name != "hackLeft"){
                this.makeIdle("hackRight", "hackLeft")

            }
        }

        if(this.state && !this.spawningSpider){

            this.sprite.body.velocity.x = 0;
            //movement
            if(controls.left.isDown)
            {
                this.sprite.animations.play('left');
                this.lookingDirection = -1;
                this.sprite.body.velocity.x = -player.speed;

            }
            else if (controls.right.isDown)
            {
                this.sprite.body.velocity.x = player.speed;
                this.sprite.animations.play('right');
                this.lookingDirection = 1;
            }
            else
            {

                if(this.attentionDirection >= 0){
                    this.sprite.frame = 18 + this.attentionDirection;

                }
                else{
                    this.makeIdle()
                }
            }

            this.attentionDirection = -1;
            //spider spawn
            if(controls.spacebar.isDown  && !this.avoidSpam && this.ownSpider && !controls.interact.isDown){
                if(spider != null){

                    if (this.hasSpider && this.hasSpider == true) {
                        this.hasSpider = false;

                        this.spawnSpider()
                    }
                    else if (!spider.avoidSpam && this.spawningSpider == false) {
                      this.deactivate()
                    }
                }
                else{
                    this.spawnSpider()
                }
            }
            //spider interaction
            if(controls.up.isDown && spider != null){
                if(this.movingSpider){//call spider
                    spider.sprite.body.velocity.x = 0;
                    spider.moveTowards(this.sprite.centerX);
                }
                else{
                    if(Math.abs(this.sprite.centerY - spider.sprite.centerY) < 50)
                    this.movingSpider = true;
                }
            }else if(this.movingSpider){
                spider.sprite.body.velocity.x = 0;
                spider.sprite.animations.play("deactivate");
                this.movingSpider = false;
            }
        }
    }
}
class Spider extends GameObject{
    constructor(x, y, state){
        super(x, y, state, null, 'spider', null);

        //physics
        this.speed = 600;
        this.jumpPower = -350;
        this.bustJumpPower = -650;
        game.physics.arcade.enable(this.sprite);
        //this.sprite.body.bounce.y = 0.35;
        this.sprite.body.gravity.y = 700;
        this.sprite.body.collideWorldBounds = true;
        this.startUp = false;
        this.hasLanded = false;
        this.landing = true;
        this.avoidSpam = false;
        game.camera.follow(this.sprite,1,0.7);
        this.state = state;
        this.hackerMode = false;

        this.sprite.animations.add('idle', [1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,     10,11,11,11,10 ],5,true);
        this.sprite.animations.add('left', [8,0,9], 10,true);
        this.sprite.animations.add('right',[9,0,8], 10,true);
        let vJumpStarup = this.sprite.animations.add('verticalJumpStartup',[1, 24, 25, 26, 27, 28],30,false);
        let hJumpStarupR = this.sprite.animations.add('horizontalJumpStartupR',[1,10,14,14,14],30,false);
        let hJumpStarupL =this.sprite.animations.add('horizontalJumpStartupL',[1,35,34,34,34],30,false);
        let landingH = this.sprite.animations.add('verticalLanding',[29,26,23, 1],10,false);
        let landingR = this.sprite.animations.add('horizontalLandingR',[30,37,36,1],10,false);
        let landingL = this.sprite.animations.add('horizontalLandingL',[10,11,12,1],10,false);
        let spawn = this.sprite.animations.add('spawn', [2,2,2,2,2, 3,3,3,3,3,3,4, 5,6,7,1], 10,false);
        this.sprite.animations.add('deactivate', [1,7,6,5,4,3,2], 10,false);

        landingH.onComplete.add(restore,this);
        landingR.onComplete.add(restore,this);
        landingL.onComplete.add(restore,this);
        vJumpStarup.onComplete.add(goUp,this);
        hJumpStarupL.onComplete.add(goLeft,this);
        hJumpStarupR.onComplete.add(goRight,this);
        spawn.onComplete.add(restore,this);

        this.sprite.frame = 2;


        function restore(){
            this.landing = false;
        }
        function goUp(){
            spiderJump.play();
            this.startUp = false;
            this.sprite.frame = 29;
            if (burstPlatforms.bustJump) {
                this.sprite.body.velocity.y = this.bustJumpPower;
            }
            else {
                this.sprite.body.velocity.y = this.jumpPower;
            }
            this.hasLanded = false;
        }
        function goRight(){
            spiderJump.play();
            this.startUp = false;
            this.sprite.frame = 15;
            this.sprite.body.velocity.y = this.jumpPower;
            this.sprite.body.velocity.x = this.speed;
            this.hasLanded = false;
        }
        function goLeft(){
            spiderJump.play()
            this.startUp = false;
            this.sprite.frame = 33;
            this.sprite.body.velocity.y = this.jumpPower;
            this.sprite.body.velocity.x = -this.speed;
            this.hasLanded = false;
        }
    }

    makeIdle(){
        this.sprite.animations.play("idle")
    }

    moveTowards(x,speed = this.speed){
        if(Math.abs(this.sprite.centerX - x) > 50){
            if(this.sprite.centerX - x > 0){
                this.sprite.animations.play("left");
                this.sprite.body.velocity.x = -speed;
            }else if(this.sprite.centerX - x < 0){
                this.sprite.animations.play("right");
                this.sprite.body.velocity.x = speed;
            }
        }else{
            this.sprite.body.velocity.x = 0;
            this.sprite.animations.play("idle");
        }
    }

    teleport(x,y){
        this.sprite.centerX = x;
        this.sprite.centerY = y;
    }

    changeHackPoint(){
        if (this.sprite.overlap(player.sprite)) {
            return true;
        }
        else {
            return false;
        }
    }

    activate(){
        this.landing = true;
        this.state = true;
        this.sprite.animations.play('spawn');
        game.camera.follow(this.sprite,1,0.7);
    }

    deactivate(){
        this.avoidSpam = true;

        game.time.events.add(Phaser.Timer.SECOND * 0.5, enableAgain, this);
        this.state = false;
        this.sprite.body.velocity.x = 0;
        player.activate()
        this.sprite.animations.play('deactivate');

        this.startUp = false
        this.landing =false

        function enableAgain(){
            this.avoidSpam = false;
            player.avoidSpam = false;
        }
    }

    jump(){
        let velocity = this.sprite.body.velocity.x
        this.sprite.body.velocity.x = 0
        this.startUp = true;
        if(velocity> 0){
            this.sprite.animations.play('horizontalJumpStartupR');
        }else if(velocity< 0){
            this.sprite.animations.play('horizontalJumpStartupL');
        }else if (velocity == 0){
            this.sprite.animations.play('verticalJumpStartup');
        }
    }

    land(){
        this.sprite.body.velocity.x =0;
        this.hasLanded = true;
        this.landing = true;
        if(this.sprite.frame == 33){
            this.sprite.animations.play('horizontalLandingL');
        }else if(this.sprite.frame == 15){
            this.sprite.animations.play('horizontalLandingR');
        }else if(this.sprite.frame == 2){
            this.sprite.animations.play('spawn');
        }
        else{
            this.sprite.animations.play('verticalLanding');
        }
    }

    update(){

        if(this.state){
            this.sprite.body.velocity.x = 0;
            if(this.sprite.body.touching.down && !this.hasLanded ){
                this.land();
            }
            if(!this.startUp && !this.landing){

                    if(controls.left.isDown)
                    {
                        if(this.sprite.body.touching.down){
                            this.sprite.animations.play('left');
                        }
                        if(this.sprite.frame == 15){//jumping right
                            this.sprite.body.velocity.x = -(player.speed/2);
                        }else{
                            this.sprite.body.velocity.x = -player.speed;
                        }

                    }
                    else if (controls.right.isDown)
                    {
                        if(this.sprite.body.touching.down){
                            this.sprite.animations.play('right');
                        }
                        if(this.sprite.frame == 33){//jumping left
                            this.sprite.body.velocity.x = player.speed/2;
                        }else{
                            this.sprite.body.velocity.x = player.speed;
                        }

                    }
                    else{
                        if(this.sprite.body.touching.down){
                            this.sprite.animations.play('idle');
                        }
                    }

                    if(this.sprite.body.touching.down && (burstPlatforms.bustJump || controls.up.isDown)){
                        this.jump();
                    }
            }
            if(controls.spacebar.isDown && !player.avoidSpam && !this.avoidSpam && !controls.interact.isDown && player.spawningSpider == false){
                this.deactivate();
            }
        }


    }
}

class Dark extends GameObject{
    constructor(x, y, state,scalex,scaley){

        super(x, y, state,null,'dark', 50);
        this.midAnim = false;
        this.input = undefined;
        this.sprite.scale.setTo(scalex,scaley)

        if (this.state) {
            this.sprite.alpha = 0.6;

        }else {
            this.sprite.alpha = 0;
        }
        function restore(){
            this.midAnim = false;
        }
    }
    changeState(newState){
        this.state = newState;
        if (this.state) {
            this.sprite.alpha = 0.6;

        }else {
            this.sprite.alpha = 0;
        }
    }
}
class HiddenZone extends GameObject{
    constructor(x, y, state,scalex,scaley){

        super(x, y, state,null,'dark', 50);
        this.midAnim = false;
        this.input = undefined;
        this.sprite.scale.setTo(scalex,scaley)

        if (this.state) {
            this.sprite.alpha = 0;
        }else {
            this.sprite.alpha = 0.4;
        }
        function restore(){
            this.midAnim = false;
        }
    }
    update(){
        let check_intersection_P = player.sprite.overlap(this.sprite);
        let check_intersection_S = false;
        if (spider) {
            check_intersection_S = spider.sprite.overlap(this.sprite);
        }
        if (check_intersection_P || check_intersection_S) {
            if (!hasEasterEgg) {
                easterEgg.sprite.alpha = 1;
            }
            this.sprite.alpha = 0.4;
        }
        else {
            if (!hasEasterEgg) {
                easterEgg.sprite.alpha = 0;
            }
            this.sprite.alpha = 1;
        }

    }
    changeState(){
        this.state = newState;
        if (this.state) {
            this.sprite.alpha = 0.6;
        }else {
            this.sprite.alpha = 0;
        }
    }
}

class Lamp extends GameObject{
    constructor(x, y, state){

        super(x, y, state,'lamp','lamp', 50);
        this.midAnim = false;
        this.input = undefined;

        if (this.state) {
            this.sprite.frame = 0;

        }else {
            this.sprite.frame = 1;
        }
        function restore(){
            this.midAnim = false;
        }
    }
    changeState(newState){
        this.state = newState;
        if (!this.state) {
          if(this.sprite.inCamera){

            lightsOn.play();
          }
            this.sprite.frame = 1;
        }else {
          if(this.sprite.inCamera){

            lightsOn.stop();
          }
            this.sprite.frame = 0;
        }
    }
}


class Door extends GameObject{
    constructor(x, y, state, opened){
        super(x, y, state, 'open', 'door', 50);
        this.midAnim = false;
        this.input = undefined;

        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.immovable = true;

        let openAnim = this.sprite.animations.add('open',[0,1,2,3,4,5],10,false)
        let closeAnim = this.sprite.animations.add('close',[5,4,3,2,1,0],10,false)
        openAnim.onComplete.add(restore,this);
        closeAnim.onComplete.add(restore,this);


        this.opened = opened;
        if (this.opened) {
            this.sprite.body.checkCollision.left  = false;
            this.sprite.body.checkCollision.right = false;
        }
        this.changeState(this.state);
        function restore(){
            this.midAnim = false;
        }
    }
    open(){
        if (!this.opened) {
            this.sprite.animations.play('open');
            this.sprite.body.checkCollision.left  = false;
            this.sprite.body.checkCollision.right = false;
            this.opened = true
            this.prompt = "close"
        }
    }
    close(){

        if (this.opened) {
            this.sprite.animations.play('close');
            this.sprite.body.checkCollision.left = true;
            this.sprite.body.checkCollision.right = true;
            this.opened = false;
            this.prompt = "open";
        }
    }
    promptIntersection(){
        var check_intersection =player.sprite.overlap(this.sprite);
        var check_interaction = controls.interact.isDown;
        var x = this.sprite.centerX - 30;
        var y = this.sprite.centerY - 50;
        if(check_intersection && !check_interaction ){
            player.intriguedDown = true;
            writePrompt(x,y,this.prompt);
        }
    }

    update(){
        if(controls.interact.isDown && Math.abs(this.sprite.centerX - player.sprite.centerX) < 40 && Math.abs(this.sprite.centerY - player.sprite.centerY) < 100 && this.state && !this.midAnim && !controls.spacebar.isDown){
            this.midAnim = true;

            if(this.opened){
                this.close();
            }else{
                this.open();
            }
        }
        if(player.state){

            this.promptIntersection();
        }
    }
    changeHackPoint(){
        if (this.sprite.overlap(player.sprite)) {
            return true;
        }
        else {
            return false;
        }

    }
    changeState(newState){
      if(newState != this.state){
        if (newState) {
          if(this.sprite.inCamera){

            doorUnlock.play();
          }
      }else {
        if(this.sprite.inCamera){

          doorLock.play();
        }
      }
    }
        this.state = newState;
        if (this.state) {
            if(this.opened){
                this.sprite.frame = 5;
            }else{
                this.sprite.frame = 0;
            }
          }
          else {
            if(this.opened){
                this.sprite.frame = 7;
            }else{
                this.sprite.frame = 6;
            }

    }
  }
}


class ElevatorWin extends GameObject{
    constructor(x1, y1, state, defaultLookingDirection,location,level) {
        super(x1, y1, state, 'Exit', 'elevator', 50);
        this.level = level
        this.location = location;
        this.active = false;
        this.sprite.animations.add('enter',[8,6,7,4,5,4,3,2,1],10,false );
        this.sprite.immovable = true;
        this.defaultLookingDirection =  defaultLookingDirection;
        if(this.state){
            this.sprite.frame = 1;
        }else{
            this.sprite.frame = 0;
        }
    }


    forceEnter(){
        let enterAnim = this.sprite.animations.getAnimation("enter");
        enterAnim.onComplete.add(winGame, this) ;
        player.sprite.body.velocity.x = 0;

        if(player.moveTowards(this.sprite.centerX - 20,200,10) == 0){
            player.sprite.frame = 0;
            player.sprite.alpha = 0;
            this.active = false;
            this.sprite.animations.play('enter');

            if(this.sprite.inCamera){

              elevatorSound.play();
            }
        }

        function winGame(){
            var mainSource=window.parent;
            var localDataBase = JSON.parse(localStorage.getItem('items'));
            if (localDataBase.actUser.index == 1) {
                localDataBase.slotLoad1 = localDataBase.actUser;
            }
            else if (localDataBase.actUser.index == 2) {
                localDataBase.slotLoad2 = localDataBase.actUser;
            }
            else {
                localDataBase.slotLoad3 = localDataBase.actUser;
            }
            if (this.level == 1) {
                localDataBase.actUser.level = 2;
                localDataBase.actUser.level1Switch = switchFlips;
                localDataBase.actUser.level1Time = Math.round(game.time.totalElapsedSeconds() * 100) / 100;
                localDataBase.actUser.totaltime = localDataBase.actUser.level0Time +localDataBase.actUser.level1Time +localDataBase.actUser.level2Time +localDataBase.actUser.level3Time;
                localDataBase.actUser.totalSwitch = localDataBase.actUser.level0Switch+localDataBase.actUser.level1Switch+localDataBase.actUser.level2Switch+localDataBase.actUser.level3Switch;
            }
            if (this.level == 2) {
                localDataBase.actUser.level = 3;
            }

            localStorage.setItem('items',JSON.stringify(localDataBase));
            mainSource.postMessage(this.location, '*');
        }
        function restore(){

            player.sprite.alpha = 1;
            player.state = true;
            player.sprite.frame = 1;

        }

    }
    changeHackPoint(){
        if (this.sprite2.overlap(player.sprite) || this.sprite.overlap(player.sprite)) {
            return true;
        }
        else {
            return false;
        }
    }


    check4player(){
        if(this.sprite.overlap(player.sprite) && ((controls.interact.isDown&& !controls.spacebar.isDown) || this.active) && !player.hackerMode && this.state){
            player.gameWin = true;
            player.state = false;
            this.active = true;
            this.forceEnter();
        }
    }

    changeState(newState){
      if(newState != this.state){
        if (this.state) {
          if(this.sprite.inCamera){

            doorUnlock.play();
          }
      }else {
        if(this.sprite.inCamera){

          doorLock.play();
        }
      }
    }
        this.state = newState;
        if(this.state){
            this.sprite.frame = 1;

        }else{
            this.sprite.frame = 0;
        }
    }

    update(){

        this.check4player();
        this.promptIntersection();
       // this.callAttention();
    }
}


class ElevatorSpawn extends GameObject{
    constructor(x1, y1, state, defaultLookingDirection) {
        super(x1, y1, state, '', 'elevator', 50);
        this.active = false;
        this.sprite.animations.add('leave', [1,2,3,4,5,7,6,8],10,false);
        this.sprite.immovable = true;
        this.defaultLookingDirection =  defaultLookingDirection;
        if(this.state){
            this.sprite.frame = 1;
        }else{
            this.sprite.frame = 0;
        }
        game.time.events.add(Phaser.Timer.SECOND * 2, function () {
            this.forceEnter()
        }, this);
    }

    forceEnter(){
        let enterAnim = this.sprite.animations.getAnimation("leave");
        enterAnim.onComplete.add(restore, this) ;
        this.sprite.animations.play('leave');

        function restore(){

            player.sprite.alpha = 1;
            player.state = true;
            this.sprite.frame = 0;
            player.sprite.animations.play('leave');
            player.lookingDirection=-1;


        }

    }

}


class Elevator extends GameObject{
    constructor(x1, y1, x2, y2, state, defaultLookingDirection) {
        super(x1, y1, state, 'elevator', 'elevator', 50);
        this.active = false;
        this.sprite.animations.add('enter',[8,6,7,4,5,4,3,2,1],10,false );
        this.sprite.animations.add('leave', [1,2,3,4,5,7,6,8],10,false);
        this.sprite.immovable = true;
        this.sprite2 = game.add.sprite(x2,y2,'elevator');
        this.sprite2.animations.add('enter',[8,6,7,4,5,4,3,2,1],10,false );
        this.sprite2.animations.add('leave', [1,2,3,4,5,7,6,8],10,false);
        this.sprite2.immovable = true;
        this.defaultLookingDirection =  defaultLookingDirection;
        if(this.state){
            this.sprite.frame = 1;
            this.sprite2.frame = 1;
        }else{
            this.sprite.frame = 0;
            this.sprite2.frame = 0;
        }
    }

    forceEnter(sprite,sprite2){
        let enterAnim = sprite.animations.getAnimation("enter");
        let leaveAnim = sprite2.animations.getAnimation("leave");
        enterAnim.onComplete.add(goingUp, this) ;
        leaveAnim.onComplete.add(restore, this);
        player.sprite.body.velocity.x = 0;
        if(player.moveTowards(sprite.centerX - 20,100,20) == 0){
            player.sprite.frame = 0;
            player.sprite.alpha = 0;
            this.active = false;
            sprite.animations.play('enter');


            elevatorSound.play();


        }
        function restore(){
            player.sprite.alpha = 1;
            player.state = true;
            player.sprite.frame = 1;


            sprite2.animations.stop();
            sprite2.frame = 1;

        }
        function goingUp(){
            sprite2.animations.play('leave');

            elevatorSound.play();
            player.sprite.centerY = sprite2.centerY + 10;
            player.sprite.centerX = sprite2.centerX - 9;
            sprite.animations.stop();
            player.lookingDirection =  this.defaultLookingDirection;

        }
    }
    changeHackPoint(){
        if (this.sprite2.overlap(player.sprite) || this.sprite.overlap(player.sprite)) {
            return true;
        }
        else {
            return false;
        }
    }
    promptIntersection(){
        var check_intersection1=this.sprite.overlap(player.sprite);
        var check_intersection2=this.sprite2.overlap(player.sprite);
        var check_interaction= controls.interact.isDown;
        var x1=this.sprite.centerX;
        var y1=this.sprite.centerY;
        var x2=this.sprite2.centerX;
        var y2=this.sprite2.centerY;

        if(check_intersection1 && !check_interaction){
            player.intrigued = true;
            writePrompt(x1,y1,this.prompt);
        }
        if(check_intersection2 && !check_interaction){
            player.intrigued = true;
            writePrompt(x2,y2,this.prompt);
        }
    }
    check4player(sprite, sprite2){
        if(sprite.overlap(player.sprite) && ((controls.interact.isDown && !controls.spacebar.isDown) || this.active) && !player.hackerMode && this.state && !player.spawningSpider){
            player.state = false;
            this.active = true;
            this.forceEnter(sprite,sprite2);
        }
    }

    changeState(newState){
      if(newState != this.state){
        if (this.state) {
          if(this.sprite.inCamera){

            doorUnlock.play();
          }
      }else {
        if(this.sprite.inCamera){

          doorLock.play();
        }
      }
    }
        this.state = newState;
        if(this.state){
          if(this.sprite.inCamera){

            energyOn.play();
          }
            this.sprite.frame = 1;
            this.sprite2.frame = 1;
        }else{
            if(this.sprite.inCamera){

              energyOff.play();
            }
            this.sprite.frame = 0;
            this.sprite2.frame = 0;
        }
    }

    update(){

        this.check4player(this.sprite, this.sprite2);
        this.check4player(this.sprite2, this.sprite);
        this.promptIntersection();
       // this.callAttention();
    }

    setFilter(filters){
        this.sprite.filters = filters;
        this.sprite2.filters = filters;
    }
}

class Lazer extends GameObject{
    constructor(x,y,state,sprite,opened){
      super(x,y,state,null,sprite,null);
      this.spriteHelp = game.add.sprite(x+9, y+18,'helpLazer');
      this.spriteHelp.scale.setTo(3,3);
      this.spriteHelp.alpha=0;
      this.sprite.smoothed=false;
      this.sprite.scale.setTo(3,3);
      this.opened=opened;
      this.sprite.immovable=true;
      game.physics.arcade.enable(this.sprite);
      this.idle=this.sprite.animations.add('idle',[0],10,false);
      this.buildUp=this.sprite.animations.add('buildUp',[0,1,2,3,4,5,6,7,8,9,10,11],10,false);
      this.fire=this.sprite.animations.add('fire',[12,12,13,13,14,14,15,15,16,17,18],10,false)
      this.fire.onComplete.add(this.fireEnd,this);
      this.buildUp.onComplete.add(this.buildUpEnd,this);
      this.sprite.body.moves=false;
      this.checkPlayer=false;
      this.checkSpider=false;

    }
    buildUpEnd(){
      this.sprite.animations.play('fire');
      this.opened=false;
      this.sprite.body.enable=true;
      if(this.sprite.inCamera){
        if(!player.hackerMode){

          lazerSound.play()
        }
      }
    }
    fireEnd(){
      lazerSound.stop();
      this.sprite.animations.play('buildUp')
      this.opened=true;
      this.sprite.body.enable=false;
    }

    checkDeath(){
      if(spider!=null){
        if(this.spriteHelp.overlap(spider.sprite)){
        }
      }
      if(this.opened==false){
        if (this.lazerCollision(player.sprite)){
          player.dead=true;
        }
        else if(spider!=null){
          if(this.lazerCollision(spider.sprite)){
            spider.sprite.visible=false;
            dieSound.play();
            var mainSource=window.parent
            var localDataBase = JSON.parse(localStorage.getItem('items'));
            mainSource.postMessage('../level/HTML/Level'+localDataBase.actUser.levelSelected+'.html', '*');
          }
        }
      }
    }
    update(){

      if(this.state==true){
        if(this.sprite.animations.currentAnim.isPlaying==false){
          this.sprite.animations.play('buildUp');
        }
      }
      else{
        this.sprite.animations.play('idle');
      }
      this.checkDeath();
    }
    lazerCollision(sprite,check){
      if(this.spriteHelp.overlap(sprite)){
        return true;
      }
      return false;
    }
  }

class Box extends GameObject{
    constructor(x, y, state) {
        super(x, y, state, 'Hide', 'box', 50)
        this.avoidSpam = true;
        this.sprite.animations.add('inBoxR',[3,3,3,3,3,1,1,1,1],5,true );
        this.sprite.animations.add('inBoxL',[4,4,4,4,4,2,2,2,2],5,true );
        this.forcingEntry=false;
        this.canLeave=false;

        this.sprite2=game.add.sprite(x, y+30, 'box_bare');
        game.physics.enable(this.sprite2, Phaser.Physics.ARCADE);
        this.sprite2.body.bounce.y = 0.2;
        this.sprite2.body.gravity.y = 1500;
        this.sprite2.body.collideWorldBounds = true;

    }

    boxPhysics(){
        this.check=game.physics.arcade.collide(this.sprite2,platforms.platforms);
        if(this.sprite2.body.velocity.x!=0 || (this.sprite2.body.velocity.y>20 || this.sprite2.body.velocity.y<-20)){
            this.sprite.visible=false;
          }
          else{
            this.sprite.visible=true;
          }
          this.sprite.x=this.sprite2.x;
          this.sprite.y=this.sprite2.y-24;
          if (spider!=null) {
            game.physics.arcade.collide(this.sprite2,spider.sprite)
          }
          if(this.sprite2.body.velocity.x<-20){
            this.sprite2.body.acceleration.x=1000;
          }
          else if(this.sprite2.body.velocity.x>20){
            this.sprite2.body.acceleration.x=-1000;
          }
          else{
            this.sprite2.body.acceleration.x=0;
              this.sprite2.body.velocity.x=0;
          }

          if((this.sprite2.body.touching.left && this.sprite2.body.touching.right)  ){
            this.sprite2.body.velocity.setTo(0,0);
            this.sprite2.body.moves=false

          }
          else if(this.sprite2.body.touching.up && this.sprite2.body.touching.down){
            if(spider!=null){
                if(spider.sprite.body.velocity.y!=0){
                  this.sprite2.body.moves=false;
                }
              }
              //this.sprite.body.blocked.down=true;
            }
            else{
              this.sprite2.body.moves=true;
            }
            if(this.sprite2.body.moves==false){
              if(this.sprite2.body.touching.left  && spider.sprite.body.velocity.x<0){
                this.sprite2.body.velocity.x=2000;
                this.sprite2.body.acceleration.x=-500;
                this.sprite2.body.moves=true;
              }
              if(this.sprite2.body.touching.right && spider.sprite.body.velocity.x>0){
                this.sprite2.body.velocity.x=-2000;
                this.sprite2.body.acceleration.x=500;
                this.sprite2.body.moves=true;
              }
            }
      }

    hideInBox(){

        if(player.lookingDirection == 1){
            this.sprite.animations.play("inBoxR")
        }else{
            this.sprite.animations.play("inBoxL")
        }
    }

    update(){
        this.boxPhysics();

        if(spider!=null){
          if(spider.state==false){
            this.check4player();
            this.promptIntersection();
          }
        }else{
            this.check4player();
            this.promptIntersection();
        }
    }
    promptIntersection(){
        var x = this.sprite.centerX -25;
        var y = this.sprite.centerY- 10 ;
        if(player.sprite.overlap(this.sprite) ){
            player.intriguedDown = true;
            writePrompt(x,y,this.prompt);
        }
    }
    check4player(){
        var check_intersection = player.sprite.overlap(this.sprite);//hack_point.sprite.overlap(player.sprite);
        var check_interaction = controls.interact.isDown;
        /*if (player.hide && this.avoidSpam && (controls.left.isDown || controls.right.isDown)) {
            this.restore()
        }*/
        if (this.forcingEntry) {
            this.forceEnter();
        }
        /*if (player.hide && (controls.right.isDown || controls.left.isDown) && this.avoidSpam && this.canLeave) {
            this.restore()
            this.avoidSpam = false;
            game.time.events.add(Phaser.Timer.SECOND * 0.5, enableAgain, this);
        }*/
        if(check_intersection && check_interaction && this.avoidSpam){
            this.avoidSpam = false;
            player.sprite.body.velocity.x = 0;
            if (player.hide) {
                this.restore()
            }
            else {
                this.canLeave = false;
                player.state = false;
                this.forceEnter();
            }
            game.time.events.add(Phaser.Timer.SECOND * 0.5, enableAgain, this);
        }
        function enableAgain(){
            this.avoidSpam = true;
        }
    }
    forceEnter(){


        if(player.moveTowards(this.sprite.centerX, 100,10) == 1){
            this.forcingEntry= true;
        }else{
            this.forcingEntry = false;
            player.hide = true;
            player.sprite.frame = 0;
            player.sprite.alpha = 0;
            player.sprite.body.velocity.x = 0;
            this.hideInBox()
            this.canLeave = true
        }
    }
    restore(){

        this.sprite.animations.stop();
        this.sprite.frame = 0;
        player.state = true;
        player.sprite.alpha = 1;
        player.hide = false;
        player.sprite.frame = 0;
    }
}
class SecurityCamera extends GameObject{
    constructor(x, y, state) {
        super(x, y, state, null, 'camera', 200)

        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.viewDistance = 200;

        this.sprite.body.immovable = true;
        this.sprite.scale.setTo(1,1.02);
        this.sprite.animations.add('green',[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,8,9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,9,8,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,8,9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,9,8,7],15,true)
        if (state != true) {
            this.sprite.animations.play('green');
        }
    }

    greenCheck(xPlayer,yPlayer){
        if (player.hide==false) {
            if ( this.sprite.frame == 0 && xPlayer> this.sprite.body.x +40 && xPlayer < this.sprite.body.x + 420 && yPlayer > this.sprite.body.y + 50 && yPlayer < this.sprite.body.y + 150) {
                this.sprite.animations.stop()
                this.sprite.frame = 6
                game.time.events.add(Phaser.Timer.SECOND * 0.3, orangeAlertLeft, this);
            }
            if (this.sprite.frame == 10 && xPlayer> this.sprite.body.x +300 && xPlayer<  this.sprite.body.x + 600 && yPlayer > this.sprite.body.y + 50 && yPlayer < this.sprite.body.y + 150) {
                this.sprite.animations.stop()
                this.sprite.frame = 11
                game.time.events.add(Phaser.Timer.SECOND * 0.3, orangeAlertCenter, this);
            }
            if (this.sprite.frame == 2 && xPlayer> this.sprite.body.x +490 && xPlayer<  this.sprite.body.x + 887 &&  yPlayer > this.sprite.body.y + 50 && yPlayer < this.sprite.body.y + 150) {
                this.sprite.animations.stop()
                this.sprite.frame = 4
                game.time.events.add(Phaser.Timer.SECOND * 0.3, orangeAlertRight, this);
            }
        }
        function orangeAlertLeft(){
            if (xPlayer> this.sprite.body.x +40 && xPlayer < this.sprite.body.x + 420 && yPlayer > this.sprite.body.y + 50 && yPlayer < this.sprite.body.y + 150 && player.hide==false) {
                this.sprite.frame = 5;
                player.dead = true;
            }
            else {
                this.sprite.animations.play('green')
            }
        }
        function orangeAlertCenter(){
            if (xPlayer> this.sprite.body.x +300 && xPlayer<  this.sprite.body.x + 600  && yPlayer > this.sprite.body.y + 50 && yPlayer < this.sprite.body.y + 150 && player.hide==false) {
                this.sprite.frame = 12
                player.dead = true;
            }
            else {
                this.sprite.animations.play('green')
            }
        }
        function orangeAlertRight(){
            if (xPlayer> this.sprite.body.x +490 && xPlayer<  this.sprite.body.x + 887  && yPlayer > this.sprite.body.y + 50 && yPlayer < this.sprite.body.y + 150 && player.hide==false) {
                this.sprite.frame = 3
                player.dead = true;
            }
            else {
                this.sprite.animations.play('green')
            }
        }
    }
    callAttention(){
        if(Math.abs(this.sprite.centerX - player.sprite.centerX) < this.viewDistance && this.sprite.centerY < player.sprite.centerY){
            if(player.sprite.centerX > this.sprite.centerX){
                player.attentionDirection = 3;
            }else{
                player.attentionDirection = 2;
            }
        }
    }
    update(){
        if(this.sprite.overlap(player.sprite)){
            this.greenCheck(player.sprite.body.x,player.sprite.body.y)
        }
        this.callAttention()
    }
}

class HackPoint extends GameObject{
    constructor(x, y, state){
        super(x, y, state, 'Hack', 'HackPoint',100);
        this.hacking = false;
        this.sprite.immovable=true;
        this.avoidSpam = true;
        this.hackElements = new Array()
        this.gameElements = new Array()
        this.lostPriority = false;
        this.hacker = null;

    }
    addHackObject(obj){
        this.hackElements.push(obj)
        obj.changeAlpha(0)
    }
    addGameElements(obj){
        this.gameElements.push(obj)
    }

    hackElementsAlpha(x){
        for (let i = 0; i < this.hackElements.length; i++) {
            this.hackElements[i].changeAlpha(x);
        }
    }

    setFilters(filters){
        background.filters = filters;
        for (var i = 0; i < GameElements.length; i++) {
            if (GameElements[i] != player && !this.gameElements.includes(GameElements[i])) {
                GameElements[i].setFilter(filters);
            }
        }
    }

    preHack(state){
        soundtrackH.mute =  !state;
        soundtrack.mute = state;
        pauseGame.button.visible = !state;
        this.hacking = state;
        this.avoidSpam = false;
    }

    checkPriority(){
        let anyone = false;
        for (var i = 0; i < priorityObj.length; i++) {
            if (priorityObj[i].changeHackPoint() && !player.hackerMode) {
                anyone = true
            }
        }
        return anyone
    }
    exitHack(subject = player){
        this.preHack(false)
        subject.state = true
        subject.hackerMode = false
        background.filters = undefined;
        this.hackElementsAlpha(0)
        this.setFilters(undefined)
    }

    update(){
        var check_intersection = player.sprite.overlap(this.sprite);
        var subject
        var extraCondition
        if (spider && (spider.state || spider.hackerMode)) {
            subject  = spider
            check_intersection = spider.sprite.overlap(this.sprite);
            extraCondition = spider.sprite.body.touching.down;
        }else{
            subject = player
            this.lostPriority = this.checkPriority();
            extraCondition = !this.lostPriority

        }
        this.hacker = subject
        var check_interaction = controls.interact.isDown && !controls.spacebar.isDown;

        if (check_interaction && extraCondition && this.avoidSpam && !player.spawningSpider){
            if (!this.hacking ) {//turn hacking on
                if(check_intersection ){
                    this.preHack(true)
                    subject.state = false;
                    subject.hackerMode = true;
                    player.state = false;
                    player.sprite.centerX = this.sprite.centerX
                    subject.sprite.body.velocity.x = 0;
                    this.hackElementsAlpha(1)
                    this.setFilters([blurX, blurY,gray])
                }
            }
            else { //turn hacking off
              this.exitHack(subject)
            }
            game.time.events.add(Phaser.Timer.SECOND * 0.5, enableAgain, this);
        }
        function enableAgain(){
            this.avoidSpam = true;
        }
        if(player.state || (spider != null && spider.state)){

            this.promptIntersection();
        }

    }
    promptIntersection(){
        var check_intersectionP =player.sprite.overlap(this.sprite);//hack_point.sprite.overlap(player.sprite);
        var check_intersectionS = false;
        if (spider) {
            check_intersectionS = spider.sprite.overlap(this.sprite);
        }
        var check_interaction = controls.interact.isDown;
        var x = this.sprite.centerX - 30;
        var y = this.sprite.centerY - 50;

        if(((check_intersectionP && this.lostPriority==false) || check_intersectionS) && !check_interaction ){
            player.intriguedDown = true;
            writePrompt(x,y,this.prompt);
        }
    }
}

class HackObject{
    constructor(x, y, state,sprite,angle){
        this.sprite = game.add.sprite(x,y, sprite);
        this.sprite.angle = angle
        this.sprite.immovable=true;
        this.sprite.inputEnabled = true;
        this.state = state;
        this.input = null;
        this.output = new Array();
        this.avoidSpam = false;
        this.wires = null;
    }
    changeState(newState){
        this.state = newState;
        if(this.wires != null){
            this.wires.changeState(newState);
        }
    }
    setOutput(obj){
        this.output.push(obj);
        obj.changeState(this.state);
    }
    changeAlpha(newAlpha){
        this.sprite.alpha = newAlpha
    }
    clicked(){return 0;}
}

class PowerSource extends HackObject{
    constructor(x, y){
        super(x,y, true,'powerSource' , 0);

    }
}

class Switch extends HackObject{
    constructor(x, y, state,angle){
        super(x, y, state, 'switch',angle);
        //On click
        if(this.state){
            this.sprite.frame = 1;
        }
        else{
            this.sprite.frame = 0;
        }
        this.sprite.events.onInputOver.add(function(){
            game.canvas.style.cursor = "url('../assets/pointer.png'), default";
        }, this);

        this.sprite.events.onInputOut.add(function(){
            game.canvas.style.cursor = "default";
        }, this);

        this.sprite.events.onInputDown.add(function(){
            if(this.output != null && !this.avoidSpam && this.input && this.sprite.alpha != 0){
                this.avoidSpam = true;
                if (this.state) {
                    this.clicked(false,0)
                }
                else {
                    this.clicked(true,1);
                }
                game.time.events.add(Phaser.Timer.SECOND * 0.3, enableAgain, this);
            }

            function enableAgain(){
                this.avoidSpam = false;
            }
        }, this);

    }
    clicked(newState,newFrame){
        switchFlips++;
        this.sprite.frame = newFrame;
        this.state = newState;
        if(newState){
          if(this.sprite.inCamera){

            energyOn.play();
          }
        }
        else{
          if(this.sprite.inCamera){

            energyOff.play();
          }
        }
        let n = this.output.length;
        for(let i = 0; i< n ; i++){
            this.output[i].changeState(newState);
        }
        if(this.wires != null){
            this.wires.changeState(newState);
        }
    }
    changeState(newState){
        this.input = newState;
        if(!newState){
            this.sprite.frame = 0;
            if(this.output != null){
                for(let i = 0; i< this.output.length ; i++){

                    this.output[i].changeState(false);
                }
            }
            if(this.wires != null){
                this.wires.changeState(false);
            }
        }

    }

}

class Not extends HackObject{
    constructor(x, y, state, angle){
        super(x, y, state, 'not', angle);
        if(this.state){
            this.sprite.frame = 0;
        }else{
            this.sprite.frame = 1;
        }
    }
    changeState(newState){
        if(newState){
            this.state = false;
            this.sprite.frame = 1;
            let n = this.output.length;
            for(let i = 0; i< n ; i++){
                this.output[i].changeState(false);
                if(this.wires != null){
                    this.wires.changeState(false);
                }
            }
        }else{
            this.state = true;
            this.sprite.frame = 0;
            let n = this.output.length;
            for(let i = 0; i< n ; i++){
                this.output[i].changeState(true);
                if(this.wires != null){
                    this.wires.changeState(true);
                }
            }
        }
    }
}

class And extends HackObject{
    constructor(x, y, state, angle){
        super(x, y, state, 'and', angle);
        this.sprite.smoothed = false;
        this.sprite.scale.setTo(1.3,1.3);
        this.halfAndL = new HalfGate(state,this);
        this.halfAndR = new HalfGate(state,this);
        if(this.state){
            this.sprite.frame = 0;
        }else{
            this.sprite.frame = 1;
        }

    }
    changeState(){
        if(this.halfAndL.state && this.halfAndR.state){
            this.changed(true, 1);
        }else{
            this.changed(false,0);
        }

    }
    changed(newState, newFrame){
        this.sprite.frame = newFrame;
        this.state = newState;
        let n = this.output.length;
        for(let i = 0; i< n ; i++){
            this.output[i].changeState(newState);
        }
        if(this.wires != null){
            this.wires.changeState(newState);
        }
    }
}

class Or extends HackObject{
    constructor(x,  y, state, angle){
        super(x, y , state, 'or',angle);
        this.sprite.smoothed = false;
        this.sprite.scale.setTo(1.3,1.3);
        this.halfOrL = new HalfGate(state, this);
        this.halfOrR = new HalfGate(state, this);
        if(this.state){
            this.sprite.frame = 1;
        }else{
            this.sprite.frame = 0;
        }
    }
    changeState(){
        if(this.halfOrL.state || this.halfOrR.state){
            this.changed(true, 0);
        }
        else{
            this.changed(false, 1);
        }
    }
    changed(newState, newFrame){
        this.sprite.frame = newFrame;
        this.state = newState;
        let n = this.output.length;
        for(let i = 0; i< n ; i++){
            this.output[i].changeState(newState);
        }
        if(this.wires != null){
            this.wires.changeState(newState);
        }
    }
}

class HalfGate{
    constructor(state, daddy){
        this.state = state;
        this.daddy = daddy;
    }
    changeState(newState){
        this.state = newState;
        this.daddy.changeState();
    }
}

class Wiring {
    constructor(state){
        this.wires = new Array();
        this.state = state;
    }
    addWire(x,y,frame,angle,scalex,scaley){
        let sprite = game.add.sprite(x,y,'wire');
        sprite.frame = frame;
        sprite.scale.setTo(scalex,scaley);
        sprite.angle = angle;
        this.wires.push(sprite);
    }

    changeAlpha(newAlpha){
        let n = this.wires.length;
        for(let i = 0; i < n; i++){
            this.wires[i].alpha = newAlpha
        }
    }

    changeState(newState){
        let n = this.wires.length;
        if(!newState){
            for(let i = 0; i < n; i++){
                switch(this.wires[i].frame){
                    case 1:
                        this.wires[i].frame = 0;
                        break;
                    case 3:
                        this.wires[i].frame = 2;
                        break;
                    case 4:
                        this.wires[i].frame = 5;
                        break;
                }
            }
        }else{
            for(let i = 0; i < n; i++){
                switch(this.wires[i].frame){
                    case 0:
                        this.wires[i].frame = 1;
                        break;
                    case 2:
                        this.wires[i].frame = 3;
                        break;
                    case 5:
                        this.wires[i].frame = 4;
                        break;
                }
            }
        }
    }
}
class Walls{
    constructor(){
        this.platforms = game.add.group();
        this.platforms.enableBody = true;
    }
    addWall(x,y,sx,sy,visible=false){
        var newWall = this.platforms.create(x,y,'ground');
        if(!visible){
            newWall.alpha = 0;
        }
        newWall.scale.setTo(sx,sy);
        newWall.body.immovable = true;
    }
}
class BurstPlatforms{
    constructor(){
        this.platformsbustJump = game.add.group();
        this.platformsbustJump.enableBody = true;
        this.bustJump = false;
    }
    addBurst(x,y,sx,sy,visible = false){
        var newWall = this.platformsbustJump.create(x,y,'burst');
        newWall.animations.add("idle", [0,1,2,3],5,true)
        newWall.animations.play("idle")
        if(!visible){
            newWall.alpha = 0.5;
        }
        newWall.scale.setTo(sx,sy);
        newWall.body.immovable = true;
    }
    update() {
        this.bustJump = game.physics.arcade.collide(this.platformsbustJump, spider.sprite);

    }
}
class Enemy extends GameObject{
    constructor(x,y,state,stateIntel,sprite,limitLeft,limitRight){
      super(x,y,state,null,sprite,null);
      this.auxUpdate=true;
      this.check=null;
      this.anim=false;
      this.questionON=false;
      this.exclamationON=false;
      this.darkAlert=false;
      this.state=state;
      this.stateIntel=stateIntel;
      this.timer=false;
      this.looking=null;
      this.dark=false;
      this.limitLeft=limitLeft;
      this.limitRight=limitRight;
      this.visibilityLength=0;
      this.speed = 400;
      game.physics.arcade.enable(this.sprite);
      this.sprite.body.bounce.y = 0.2;
      this.sprite.body.gravity.y = 500;
      this.sprite.body.collideWorldBounds = true;
      this.sprite.immovable=true;
      this.spriteExclamation=game.add.sprite(this.sprite.x,this.sprite.y-30,'exclamationPoint');
      this.spriteQuestion=game.add.sprite(this.sprite.x,this.sprite.y-40,'questionMark');
      this.spriteExclamation.visible=false;
      this.spriteQuestion.visible=false;
      this.selfDestructRight=null;
      this.selfDestructLeft=null;
      this.prompt='Hack';
      this.avoidSpam=false;
    }

    destroyMe(){
      var ind = GameElements.indexOf(this);
      if (ind > -1) {
        GameElements.splice(ind, 1);
      }
      this.sprite.destroy();
      this.sprite=null;
      try{
        allEnemiesCounter--;
      }
      catch(e){

      }





    }
    backdoor(sound){
      if(this.state && !this.avoidSpam){
        if(spider!=null){

          if(this.sprite.overlap(spider.sprite)){
            writePrompt(this.sprite.centerX,this.sprite.y+10,this.prompt);
            if(controls.interact.isDown){
              this.sprite.body.velocity.x=0;
              this.auxUpdate=false;
              this.avoidSpam=true;
              this.stateIntel='Die';
              this.selfDestructTriggered(sound);
            }
          }
        }
      }
    }
    selfDestruct(sound){
      if(this.looking=='Right'){
        if(this.selfDestructRight!=null){
          this.selfDestructRight.play();
          sound.play();
        }
      }
      if(this.looking=='Left'){
        if(this.selfDestructLeft!=null){
          this.selfDestructLeft.play();
          sound.play();
        }
      }
    }
    selfDestructTriggered(sound){
      if(this.stateIntel=='Die'){

        this.selfDestruct(sound);
      }
    }

    alerted(looking){
      if(looking=='Left'){
       return (player.sprite.x<=this.sprite.x && player.sprite.x>=this.sprite.x-this.visibilityLength && player.sprite.y+player.sprite.height<=this.sprite.y+this.sprite.height && player.sprite.y+player.sprite.height>=this.sprite.y+this.sprite.height-this.visibilityLength/3)//||(this.sprite.overlap(player.sprite))
     }
     else if (looking=='Right'){
       return  (player.sprite.x>=this.sprite.x && player.sprite.x<=this.sprite.x+this.visibilityLength &&  player.sprite.y+player.sprite.height<=this.sprite.y+this.sprite.height && player.sprite.y+player.sprite.height>=this.sprite.y+this.sprite.height-this.visibilityLength/3)//||(this.sprite.overlap(player.sprite))
     }
    }
    update(){
      if(this.auxUpdate){

        this.checkDark();
        this.playAnimations();
      }

    }
    alertedByPlayer(){}
    verifyState(sprite,animation){
      this.timer=false;
      if(dark!=null){
        if(player.hide==false && dark.state==false ){
          this.alertedByPlayer();
        }
      }
      else{
        if(player.hide==false && player.sprite.visible){
          this.alertedByPlayer();
        }
      }

    }
      playAnimations(){
        this.verifyState();
      }

  }

  class SamuraiCop extends Enemy{
    constructor(x,y,state,stateIntel,limitLeft,limitRight,limit){
      super(x,y,state,stateIntel,'guard',limitLeft,limitRight);
      this.limit=limit;
      this.checkR=null;
      this.checkL=null;
      this.sprite.smoothed=false;
      this.sprite.scale.setTo(3.0,3.0);
      this.attackRight=this.sprite.animations.add('attackRight',[14,15,16,17,18,19,20,21,22],10,false);
      this.attackRight2=this.sprite.animations.add('attackRight2',[23,24,25,26,27,28],20,false);
      this.attackRight3=this.sprite.animations.add('attackRight3',[29,30,31,32,33,34,35],10,false);
      this.attackLeft=this.sprite.animations.add('attackLeft',[36,37,38,39,40,41,42,43,44],10,false);
      this.attackLeft2=this.sprite.animations.add('attackLeft2',[45,46,47,48,49,50],20,false);
      this.attackLeft3=this.sprite.animations.add('attackLeft3',[51,52,53,54,55,56,57],20,false);
      this.idleLeft=this.sprite.animations.add('idleLeft',[0,1,2,3,4,5,6],10,true);
      this.idleRight=this.sprite.animations.add('idleRight',[7,8,9,10,11,12,13],10,true);
      this.selfDestructLeft=this.sprite.animations.add('selfDestructLeft',[58,59,60,61,62,63,64,65,66,67,68,69,70],10,false);
      this.selfDestructRight=this.sprite.animations.add('selfDestructRight',[71,72,73,74,75,76,77,78,79,80,81,82,83],10,false);
      this.attackRight.onComplete.add(this.attackR1End,this);
      this.attackRight2.onComplete.add(this.attackR2End,this);
      this.attackRight3.onComplete.add(this.animEnd,this);
      this.attackLeft.onComplete.add(this.attackL1End,this);
      this.attackLeft2.onComplete.add(this.attackL2End,this);
      this.attackLeft3.onComplete.add(this.animEnd,this);
      this.idleRight.onLoop.add(this.animEnd,this);
      this.idleLeft.onLoop.add(this.animEnd,this);
      this.selfDestructRight.onComplete.add(this.destroyMe,this);
      this.selfDestructLeft.onComplete.add(this.destroyMe,this);
    }
    checkDark(){
      if(dark.state && this.timer==false && this.darkAlert==false){
        if(this.looking=='Left'){
        this.stateIntel=2;
        }
        else if(this.looking=='Right'){
          this.stateIntel=1;
        }
        this.darkAlert=true;
      }
      else if(dark.state==false){
        this.darkAlert=false;
      }
    }
    update(){
    if(this.stateIntel==2||this.stateIntel==3){
        if(this.sprite.overlap(player.sprite)&& this.sprite.animations.currentAnim.name!='attackRight' && this.sprite.animations.currentAnim.name!='attackLeft' ){
            player.dead=true;
        }
    }

      if((this.sprite.animations.currentFrame.index>=63 && this.sprite.animations.currentFrame.index<=70)|| (this.sprite.animations.currentFrame.index>=76 && this.sprite.animations.currentFrame.index<=83)){
        game.camera.shake(0.05,250);
      }
      if(this.auxUpdate){
        this.backdoor(sepukku);
        this.check= game.physics.arcade.collide(this.sprite, platforms.platforms);
        if(this.limitLeft!=null){
          this.checkL=game.physics.arcade.collide(this.sprite, this.limitLeft.sprite);
        }
        if(this.limitRight!=null){
          this.checkR=game.physics.arcade.collide(this.sprite, this.limitRight.sprite);
        }
        if(this.stateIntel==1 || this.stateIntel==3){
          this.looking='Right'
        }
        else if (this.stateIntel==0 || this.stateIntel==2) {
          this.looking='Left'
        this.playAnimations();
      }
    }
    }
    alertedByPlayer(){
      if(this.looking=='Left'){
        if(this.limit=='Door'){
          if(this.sprite.body.centerX<this.limitLeft.sprite.x){
            this.visibilityLength=200;
          }
          else if(this.limitLeft.opened){
            this.visibilityLength=Math.abs(this.sprite.x-this.limitLeft.sprite.x)+300;
          }
          else{
            this.visibilityLength=Math.abs(this.sprite.x-this.limitLeft.sprite.x);
          }
        }
        if(this.limit=='Hard'){
          this.visibilityLength=400;
        }
        if (this.alerted(this.looking)){
          this.stateIntel=2;
        }
        else{
          this.stateIntel=0;
        }
      }
      else if (this.looking=='Right'){
        if(this.limit=='Door'){
          if(this.sprite.body.centerX>this.limitRight.sprite.x){
            this.visibilityLength=200;
          }
          else if(this.limitRight.opened){
              this.visibilityLength=Math.abs(this.sprite.x-this.limitRight.sprite.x)+300;
          }
          else{
            this.visibilityLength=Math.abs(this.sprite.x-this.limitRight.sprite.x);
          }
        }
        if(this.limit=='Hard'){
          this.visibilityLength=400;
        }

        if (this.alerted(this.looking)){
          this.stateIntel=3
        }
        else{
          this.stateIntel=1;
      }
    }
  }
    attackR1End(){
      this.sprite.animations.play('attackRight2');
      this.sprite.body.velocity.x=this.speed*3;
      swordSlash.play();
    }
    attackR2End(){
      this.sprite.animations.play('attackRight3');
      this.sprite.body.velocity.x=this.speed*7;
    }
    attackL1End(){
      this.sprite.animations.play('attackLeft2');
      this.sprite.body.velocity.x=-this.speed*3;
      swordSlash.play();
    }
    attackL2End(){
      this.sprite.animations.play('attackLeft3');
      this.sprite.body.velocity.x=-this.speed*7;
    }
    animEnd(sprite,animation){
      this.sprite.body.velocity.x=0;
      this.anim=false;
      if(this.timer==false){
        this.timer=true;
        game.time.events.add(Phaser.Timer.SECOND * 0.01,this.verifyState,this);
      }

    }
    playAnimations(){
      if(this.timer==false && this.anim==false){
        if(this.stateIntel==0){
          this.sprite.body.velocity.x=0;
          this.sprite.animations.play('idleLeft');
        }
        else if (this.stateIntel==1) {
          this.sprite.body.velocity.x=0;
          this.sprite.animations.play('idleRight');
        }
        else if (this.stateIntel==2) {
          this.sprite.animations.play('attackLeft');
        }
        else if(this.stateIntel==3){
          this.sprite.animations.play('attackRight')
        }
        this.anim=true;
      }
    }
  }


  class RobotPunk extends Enemy{
    constructor(x,y,state,stateIntel,x2,y2,state2,limitLeft,limitRight,limit='Door'){
      super(x,y,state,stateIntel,'robo',limitLeft,limitRight);
      this.limit=limit;
      this.sprite.scale.setTo(0.95,0.95);
      this.spriteEnergy=game.add.sprite(x2,y2,'energyball');
      this.spriteEnergy.visible=false;
      this.stateEnergy=true;
      this.spriteEnergy.immovable=true;
      game.physics.arcade.enable(this.spriteEnergy);
      this.spriteEnergy.body.allowGravity=false;
      this.spriteEnergy.body.bounce.y = 0.2;
      this.spriteEnergy.body.gravity.y = 500;
      this.spriteEnergy.immovable=true;
      this.speedEnergy = 1200;
      this.idleLeft=this.sprite.animations.add('idleLeft',[0],10,false);
      this.idleRight=this.sprite.animations.add('idleRight',[2],10,false);
      this.turnAround=this.sprite.animations.add('turnAround',[1],20,false);
      this.alertedLeft=this.sprite.animations.add('alertedLeft',[3,4,5,6,7,8,9,10],10,true);
      this.alertedRight=this.sprite.animations.add('alertedRight',[12,13,14,15,16,17,18,19,20],10,true);
      this.shootR1=this.sprite.animations.add('shootRight1',[41,42,43],10,false);
      this.shootR2=this.sprite.animations.add('shootRight2',[44,45,46],10,false);
      this.shootR3=this.sprite.animations.add('shootRight3',[47,48],10,false);
      this.shootL1=this.sprite.animations.add('shootLeft1',[27,28,29],10,false);
      this.shootL2=this.sprite.animations.add('shootLeft2',[30,31,32],10,false);
      this.shootL3=this.sprite.animations.add('shootLeft3',[33,34],10,false);
      this.patrolLeftDamage=this.sprite.animations.add('patrolLeftDamage',[50,51,52,53,54,55,56,57,58],10,true);
      this.patrolRightDamage=this.sprite.animations.add('patrolRightDamage',[61,62,63,64,65,66,67,68,69],10,true);
      this.patrolLeft=this.sprite.animations.add('patrolLeft',[70,71,72,73,74,75,76,77,78],10,true);
      this.patrolRight=this.sprite.animations.add('patrolRight',[79,80,81,82,83,84,85,86,87],10,true);
      this.buildL1=this.spriteEnergy.animations.add('buildUpLeft',[0,1,2,3,4,5],10,false);
      this.buildR1=this.spriteEnergy.animations.add('buildUpRight',[27,28,29,30,31,32],10,false);
      this.goLeft1=this.spriteEnergy.animations.add('goLeft1',[5,6,7],20,false);
      this.goLeft2=this.spriteEnergy.animations.add('goLeft2',[7,8,9,10],20,true);
      this.goLeft3=this.spriteEnergy.animations.add('goLeft3',[11,12,13,14,15,16,17,18,19,20,21,22],20,true);
      this.dieLeft=this.spriteEnergy.animations.add('dieLeft',[23,24,25,26],20,false);
      this.goRight1=this.spriteEnergy.animations.add('goRight1',[32,33,34],10,false);
      this.goRight2=this.spriteEnergy.animations.add('goRight2',[34,35,36,37],10,true);
      this.goRight3=this.spriteEnergy.animations.add('goRight3',[38,39,40,41,42,43,44,45,46,47,48,49],20,true);
      this.dieRight=this.spriteEnergy.animations.add('dieRight',[50,51,52,53],20,false);
      this.exclamation1=this.spriteExclamation.animations.add('exclamationPoint',[0,1,2,3,4,5,6],10,false);
      this.question1=this.spriteQuestion.animations.add('questionMark',[0,1,2,3,4,5,6],10,false);
      this.selfDestructLeft=this.sprite.animations.add('selfDestructLeft',[88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103],10,false);
      this.selfDestructRight=this.sprite.animations.add('selfDestructRight',[104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119],10,false);
      this.buildR1.onComplete.add(this.buildRFinished,this);
      this.shootR1.onComplete.add(this.shootR1Finished,this);
      this.shootR2.onComplete.add(this.shootR2Finished,this);
      //this.shootR3.onComplete.add(this.animFinished,this);
      this.buildL1.onComplete.add(this.buildLFinished,this);
      this.shootL1.onComplete.add(this.shootL1Finished,this);
      this.shootL2.onComplete.add(this.shootL2Finished,this);
      //this.shootL3.onComplete.add(this.animFinished,this);
      this.idleLeft.onComplete.add(this.animFinished,this);
      this.idleRight.onComplete.add(this.animFinished,this);
      this.alertedLeft.onLoop.add(this.animFinished,this);
      this.alertedRight.onLoop.add(this.animFinished,this);
      this.patrolLeft.onLoop.add(this.animFinished,this);
      this.patrolRight.onLoop.add(this.animFinished,this);
      this.patrolLeftDamage.onLoop.add(this.animFinished,this);
      this.patrolRightDamage.onLoop.add(this.animFinished,this);
      this.exclamation1.onComplete.add(this.exclamationFinished,this);
      this.question1.onComplete.add(this.questionFinished,this);
      this.dieLeft.onComplete.add(this.dieFinished,this);
      this.dieRight.onComplete.add(this.dieFinished,this);
      this.selfDestructRight.onComplete.add(this.destroyMe,this);
      this.selfDestructLeft.onComplete.add(this.destroyMe,this);
      }
      update(){
        if((this.sprite.animations.currentFrame.index>=93 && this.sprite.animations.currentFrame.index<=103)|| (this.sprite.animations.currentFrame.index>=109 && this.sprite.animations.currentFrame.index<=119)){
          game.camera.shake(0.05,250);
        }
        if(this.auxUpdate){
          this.backdoor(explosion)
          this.check= game.physics.arcade.collide(this.spriteEnergy, platforms.platforms);
          if(this.darkAlert==true && this.dark.state==false){
            this.darkAlert=false;
          }
          if(this.stateIntel==0 || this.stateIntel==2 || this.stateIntel==4 || this.stateIntel==6){
            this.looking='Left';
            this.spriteQuestion.x=this.sprite.x+60;
            this.spriteExclamation.x=this.sprite.x+75;

          }
          else if (this.stateIntel==1 || this.stateIntel==3 || this.stateIntel==5 || this.stateIntel==7) {
            this.looking='Right';
            this.spriteQuestion.x=this.sprite.x+10;
            this.spriteExclamation.x=this.sprite.x+15;
          }
          if((this.spriteEnergy.overlap(player.sprite) || this.check )&& this.spriteEnergy.visible==true || this.limit=='Door'){ ///OLEOLE
            if(this.limit=='Door'){
              if((game.physics.arcade.collide(this.spriteEnergy,this.limitLeft.sprite) && this.limitLeft.opened==false) || (game.physics.arcade.collide(this.spriteEnergy,this.limitRight.sprite) && this.limitRight.opened==false)|| this.check){
                if(this.looking=='Right'){
                  this.spriteEnergy.body.velocity.x=0;
                  this.spriteEnergy.animations.play('dieRight')
                }
                if(this.looking=='Left'){
                  this.spriteEnergy.body.velocity.x=0;
                  this.spriteEnergy.animations.play('dieLeft')

                }
              }
            }
            if(game.physics.arcade.collide(this.spriteEnergy,player.sprite)&& this.spriteEnergy.visible==true){//this.spriteEnergy.overlap(player.sprite)){
              player.dead = true;
            }

          }
          if(this.stateIntel==6 || this.stateIntel==5){
            if(this.sprite.overlap(player.sprite)){
              player.dead = true;
            }
          }
          if(this.dark.state==false && player.hide==false){
            if((this.stateIntel==1 || this.stateIntel==2) && this.sprite.animations.currentFrame.index != 1){
              this.verifyState();
            }
            if(this.sprite.overlap(player.sprite)){
              if(this.looking=='Right'){
                this.stateIntel=5;
              }
              else{
                this.stateIntel=6;
              }
            }
          }
          if(dark!=null){
            this.setDark();
            this.checkDark();

          }
          this.playAnimations();

        }

      }
      checkDark(){
        if(this.dark.state && this.timer==false && this.darkAlert==false){

          if(this.looking=='Left'){
          this.stateIntel=4;
          game.time.events.add(Phaser.Timer.SECOND * 2,function(){
            this.stateIntel=2;
          },this);


          }
          else if(this.looking=='Right'){
            this.stateIntel=3;
            game.time.events.add(Phaser.Timer.SECOND * 2,function(){
              this.stateIntel=1;
            },this);
          }
          this.darkAlert=true;
          this.animFinished(this.sprite,this.sprite.animations);
        }
      }
      firstShotLeeway(){
        this.stateIntel=Math.abs(this.stateIntel);
        this.verifyState();

      }
      alertedByPlayer(){
        if(this.stateIntel<0){
          return game.time.events.add(Phaser.Timer.SECOND * 2,this.firstShotLeeway,this);
        }
        if(this.looking=='Left'){
          if(this.limit=='Hard'){
              this.visibilityLength=700;
            }
          else if(this.limitLeft.opened){
              this.visibilityLength=Math.abs(this.sprite.x-this.limitLeft.sprite.x)+300;
          }
          else{
            this.visibilityLength=Math.abs(this.sprite.x-this.limitLeft.sprite.x);
          }
          if (this.alerted(this.looking)){
            if (this.stateIntel<0) {
              this.stateIntel=Math.abs(this.stateIntel);
            }

            if(this.stateIntel<=8 && this.stateIntel>0){
              if(this.stateIntel==2){
                this.stateIntel=4
              }
                else {
                  if(player.sprite.x>= this.sprite.x-200 || this.sprite.overlap(player.sprite) )
                    this.stateIntel=6
                    else{
                    this.stateIntel=8
                  }
                }
            }
          }
          else{
            if(this.stateIntel>2){
              if(this.stateIntel>4){
                this.stateIntel=4;
              }
              else {
                this.stateIntel=2;
                }
            }
          }
        }
        else if (this.looking=='Right'){
          if(this.limit=='Hard'){
              this.visibilityLength=700;
            }
          else if(this.limitRight.opened){
              this.visibilityLength=Math.abs(this.sprite.x-this.limitRight.sprite.x)+300;
          }
          else{
            this.visibilityLength=Math.abs(this.sprite.x-this.limitRight.sprite.x);
          }

          if (this.alerted(this.looking)){


            if (this.stateIntel<0) {
              this.stateIntel=Math.abs(this.stateIntel);
            }
            if(this.stateIntel<=7 && this.stateIntel>0){
              if(this.stateIntel==1){
                this.stateIntel=3
              }
                else {
                  if(player.sprite.x<= this.sprite.x+200  || this.sprite.overlap(player.sprite)){
                    this.stateIntel=5
                  }
                  else{
                    this.stateIntel=7
                  }
                }
            }
          }
          else{
            if(this.stateIntel>1){
              if(this.stateIntel>3){
                this.stateIntel=3;
              }
              else {
                this.stateIntel=1;
              }
            }
          }
        }
      }
      setDark(){
        if(!this.dark){
          if(dark!=null){
            this.dark=dark;
          }
        }
      }

      playAnimations(){



        this.anim=false;
        if(this.stateIntel!=3 && this.stateIntel!=4){
          this.questionON=false;
          this.spriteQuestion.visible=false;
        }
        if(Math.abs(this.stateIntel)<5){
          this.exclamationON=false;
          this.spriteExclamation.visible=false;;
        }

        if(this.stateIntel==2){
          this.sprite.body.velocity.x=-this.speed;
          this.sprite.animations.play('patrolLeft');

        }
        else if(this.stateIntel==1){

          this.sprite.body.velocity.x=this.speed;
          this.sprite.animations.play('patrolRight');

        }
        if(this.stateIntel==4){
          this.sprite.body.velocity.x=0;
          if(!this.questionON){
            this.spriteQuestion.visible=true;
            this.spriteQuestion.animations.play('questionMark');
          }
          this.sprite.animations.play('alertedLeft');

        }
        else if(this.stateIntel==3){
          this.sprite.body.velocity.x=0;
          if(!this.questionON){
            this.spriteQuestion.visible=true;
            this.spriteQuestion.animations.play('questionMark');
          }
          this.sprite.animations.play('alertedRight');

        }
        else if(this.stateIntel==6){
          this.sprite.animations.play('patrolLeftDamage');
          this.sprite.body.velocity.x = -this.speed*3;
          if(!this.exclamationON){
            this.spriteExclamation.visible=true;
            this.spriteExclamation.animations.play('exclamationPoint');
        }
        }
        else if (this.stateIntel==5){
          this.sprite.animations.play('patrolRightDamage');
          this.sprite.body.velocity.x = this.speed*3;
          if(!this.exclamationON){
            this.spriteExclamation.visible=true;
            this.spriteExclamation.animations.play('exclamationPoint');
        }
        }
        if(this.stateIntel==8){
          this.sprite.body.velocity.x=0;
          this.spriteEnergy.x=this.sprite.x-10;
          this.spriteEnergy.y=this.sprite.y+32;
          if(!this.exclamationON){
            this.spriteExclamation.visible=true;
            this.spriteExclamation.animations.play('exclamationPoint');
          }
          this.spriteEnergy.visible=true;
          this.spriteEnergy.animations.play('buildUpLeft');

        }
        if(this.stateIntel==7){
          this.sprite.body.velocity.x=0;
          this.spriteEnergy.x=this.sprite.x+40;
          this.spriteEnergy.y=this.sprite.y+32;
          if(!this.exclamationON){
            this.spriteExclamation.visible=true;
            this.spriteExclamation.animations.play('exclamationPoint');
          }
          this.spriteEnergy.visible=true;
          this.spriteEnergy.animations.play('buildUpRight');
        }

        if(this.limit=='Hard'){
          if(this.looking=='Right'){
            var help=(this.sprite.centerX+(this.sprite.body.width/2));
            if(help>=this.limitRight|| game.physics.arcade.collide(this.sprite,platforms.platforms)|| this.sprite.body.touching.right){
              this.sprite.animations.play('turnAround');
              this.stateIntel=2;
              this.looking='Left'
            }

          }
          else if(this.looking=='Left'){
          var help=(this.sprite.centerX-(this.sprite.body.width/2));
            if(help<=this.limitLeft || game.physics.arcade.collide(this.sprite,platforms.platforms)|| this.sprite.body.touching.left){
              this.sprite.animations.play('turnAround');
              this.stateIntel=1;
              this.looking='Right'
            }
          }
        }
        else{
          if(this.sprite.overlap(this.limitRight.sprite)){
            this.sprite.animations.play('turnAround');
            this.stateIntel=2;
            this.looking='Left'
          }
          else if (this.sprite.overlap(this.limitLeft.sprite)){
            this.sprite.animations.play('turnAround');
            this.stateIntel=1;
            this.looking='Right'
          }
        }
      }
      buildRFinished(){
        this.stateIntel=-7;
        this.sprite.animations.play('shootRight1');
        this.spriteEnergy.animations.play('goRight1');
        energyShot.play();
        this.spriteEnergy.x+=5;
      }
      shootR1Finished(){
        this.sprite.animations.play('shootRight2');
        this.sprite.body.velocity.x-=50;
        this.spriteEnergy.animations.play('goRight2');
        this.spriteEnergy.x-=5;
        this.sprite.y-=10;
        this.spriteEnergy.x-=10;
        this.spriteEnergy.body.velocity.x=this.speedEnergy;
      }
      shootR2Finished(){
        this.sprite.animations.play("shootRight3");
        this.spriteEnergy.animations.play("goRight3");
        this.sprite.body.velocity.x=0;
        this.spriteEnergy.body.velocity.x=this.speedEnergy;
      }
      buildLFinished(){
        this.stateIntel=-8;
        this.sprite.animations.play('shootLeft1');
        this.spriteEnergy.animations.play('goLeft1');
        energyShot.play();
        this.spriteEnergy.x-=5;
      }
      shootL1Finished(){
        this.sprite.animations.play('shootLeft2');
        this.sprite.body.velocity.x+=50;
        this.spriteEnergy.animations.play('goLeft2');
        this.spriteEnergy.x+=5;
        this.sprite.y-=10;
        this.spriteEnergy.x+=10;
        this.spriteEnergy.body.velocity.x=-this.speedEnergy;
      }
      shootL2Finished(){
        this.sprite.animations.play("shootLeft3");
        this.spriteEnergy.animations.play("goLeft3");
        this.sprite.body.velocity.x=0;
        this.spriteEnergy.body.velocity.x=-this.speedEnergy;
      }
      animFinished(){
        this.anim=true;
        if(this.timer==false && this.anim){
          this.timer=true;
          game.time.events.add(Phaser.Timer.SECOND * 0.5,this.verifyState,this);

        }
      }
      questionFinished(){
        this.questionON=true;
      }
      exclamationFinished(){
        this.exclamationON=true;
      }
      dieFinished(){
        energyShot.stop();
        this.spriteEnergy.visible=false;
      //  this.spriteEnergy.x=this.sprite.x;
        game.time.events.add(Phaser.Timer.SECOND * 2,this.verifyState,this);
      }
    }
    class smokingJoe{
      constructor(x,y){
        this.sprite=game.add.sprite(x,y,'smokingJoe');
        this.sprite.smoothed=false;
        this.sprite.scale.setTo(3.2,3.2);
        this.anim1=this.sprite.animations.add('anim1',[2,3,4],5,false);
        this.anim2=this.sprite.animations.add('anim2',[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37],5,false);
        this.anim1.onComplete.add(this.anim1End,this);
        this.anim2.onComplete.add(this.anim2End,this);
        this.anim1.play();

      }
      anim1End(){
        this.anim2.play();
      }
      anim2End(){
        var aux=Math.random();
        if(aux<=0.3){
          this.anim1.play();
        }
        else{
          this.anim2.play();
        }
      }
    }
