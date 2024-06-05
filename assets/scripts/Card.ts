import { _decorator, Color, Component, Node , Sprite, SpriteFrame, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Card')
export class Card extends Component {
    @property(Sprite)
    backSide: Sprite = null;
    
    @property(Sprite)
    frontSide: Sprite = null;
    
    @property()
    duration: number = 0.2;
    
    value: number;

    sprite: Sprite;

    lockCard: boolean = false;

    initCard(value: number, sprite: SpriteFrame) {
        this.value = value;
        this.frontSide.spriteFrame = sprite;
    }
    initLockCard(){
        this.lockCard = true;
        this.backSide.color = Color.BLACK;
        this.frontSide.color = Color.BLACK;
    }
    flipToBackSide() {
        // flip 
        tween(this.frontSide.node)
            .to(this.duration/2,{scale: v3(0,1,1)}).start();

        tween(this.backSide.node)
            .to(this.duration,{scale: v3(1,1,1)}).start();
    }

    flipToFrontSide() {
        if(this.lockCard) return;
        tween(this.backSide.node)
            .to(this.duration/2,{scale: v3(0,1,1)}).start();
        
        tween(this.frontSide.node)
            .to(this.duration,{scale: v3(1,1,1)}).start();
        // flip 
    }   

}

