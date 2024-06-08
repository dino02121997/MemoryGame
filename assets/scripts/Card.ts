import { _decorator, Color, Component, Node , Sprite, SpriteFrame, tween, UIOpacity, v3 } from 'cc';
import { SoundManager } from './SoundManager';
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

    isLock: boolean = false;

    isUp: boolean = false;
    
    opacity: UIOpacity;

    onClickCardCallBack: (card: Card) => void

    onLoad() {
        this.opacity = this.node.getComponent(UIOpacity);
    }

    initCard(value: number, sprite: SpriteFrame,callback:(card: Card) => void) {
        this.value = value;
        this.frontSide.spriteFrame = sprite;
        this.onClickCardCallBack = callback;
    }

    initLockCard(){
        this.isLock = true;
        this.backSide.color = Color.BLACK;
    }

    flipToBackSide(callback?:() => void) {
        setTimeout(() => {
            SoundManager.getInstance().playSound('flip');
            tween(this.frontSide.node)
                .to(this.duration/2,{scale: v3(0,1,1)}).start();
    
            tween(this.backSide.node)
                .to(this.duration,{scale: v3(1,1,1)}, {onComplete:() => { 
                    typeof callback === 'function' && callback(); 
                    this.isUp = false;
                }}).start();
        },400)
    }

    flipToFrontSide(callback?:() => void) {
        this.isUp = true;
        SoundManager.getInstance().playSound('flip');
        tween(this.backSide.node)
            .to(this.duration/2,{scale: v3(0,1,1)}).start();
        
        tween(this.frontSide.node)
            .to(this.duration,{scale: v3(1,1,1)},{onComplete:() => { typeof callback === 'function' && callback(); }}).start();
    }  
    
    hiddenCard(callback?:() => void){
        tween(this.opacity).to(this.duration,{opacity: 0},{onComplete:() => { typeof callback === 'function' && callback(); }}).start();
    }

    onClickCard(){
        if(this.isLock || this.isUp) return;
        this.onClickCardCallBack(this.node.getComponent(Card));
    }

}

