import { _decorator, Button, Component, EventHandler, instantiate, Layout, Node, Prefab, SpriteFrame, UITransform , Event} from 'cc';
import { Card } from './Card';
import { GameManager } from './GameManager';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('CardManager')
export class CardManager extends Component {

    @property(Prefab)
    Card: Prefab = null;
    
    @property(SpriteFrame)
    animalSprites: SpriteFrame[] = [];    

    cardValues: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
    cards: Card[];
    col: number = 4;
    row: number = 4;
    
    transform: UITransform;
    layout: Layout;

    firstCard: Card
    
    secondCard: Card

    currentPoint: number = 0;
    currentTurn: number = 0;


    generateCards(col:number,row:number){
        this.col = col;
        this.row = row;
        this.initLayout();
        this.instanceCards();
        this.randomizeChildren();
    }

    initLayout(){
        this.transform = this.node.getComponent(UITransform);
        this.layout = this.node.getComponent(Layout);
        this.layout.constraintNum = this.col;
        this.transform.width = this.col * this.layout.cellSize.width + ( this.col - 1 ) * this.layout.spacingX;
        this.transform.height = this.row * this.layout.cellSize.height + ( this.row - 1 ) * this.layout.spacingY;
    }
    
    instanceCards() {
        const totalCard = this.row * this.col;
        const oddCards = totalCard % 2 === 1;
        const couple = Math.floor(totalCard/2);
        const cardValues = this.getRandomPair(couple);
        let count = 0;
        const playableCard = oddCards ? totalCard - 1 : totalCard
        for(let i = 0; i < playableCard; i++){
            if(playableCard / 2 === i )  {
                count = 0;
            }
            const spriteIndex = cardValues[count];
            this.instanceCard(spriteIndex,this.animalSprites[spriteIndex],false);
            count++;
        }
        if(oddCards){
            this.instanceCard(999,this.animalSprites[0],true);
        }
      
    }

    shuffleArray(array: number[]):  number[] { 
        for (let i = array.length - 1; i > 0; i--) { 
          const j = Math.floor(Math.random() * (i + 1)); 
          [array[i], array[j]] = [array[j], array[i]]; 
        } 
        return array; 
    };

    getRandomPair(nCouple:number): number[] {
        return this.shuffleArray(this.cardValues).slice(0,nCouple);
    }

    instanceCard(index, spriteFrame, lockCard){
        const cardNode = instantiate(this.Card);
        if(lockCard){
            cardNode.getComponent(Card).initLockCard();
        }
        else{
            cardNode.getComponent(Card).initCard(index, spriteFrame);
            const clickEventHandler = new EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = 'CardManager';
            clickEventHandler.handler = 'onClickCard';
            const button = cardNode.getComponent(Button);
            button.clickEvents.push(clickEventHandler);
        }
        cardNode.active = false;
        this.node.addChild(cardNode);
    }

    randomizeChildren() {
        let children = this.node.children.slice();

        let shuffled = [...children].sort(() => Math.random() - 0.5);

        for (let child of children) {
            child.removeFromParent();
        }

        for (let child of shuffled) {
            this.node.addChild(child);
            child.active = true;
        }
    }

    compareCard(card: Card, other: Card): boolean {
        return card.value === other.value
    }

    onClickCard(event: Event): void {
        const node = event.target as Node;
        if(this.firstCard && this.secondCard) return;
        if(!this.firstCard){
            this.firstCard = node.getComponent(Card);
            this.firstCard.flipToFrontSide(() => {});
        }
        else if(this.firstCard.node.uuid !== node.uuid){
            GameManager.getInstance().updateTurn();
            this.secondCard = node.getComponent(Card);
            this.secondCard.flipToFrontSide(()=>{
                if(!this.compareCard(this.firstCard,this.secondCard)){
                    SoundManager.getInstance().playSound('reject');
                    this.firstCard.flipToBackSide(()=>{});
                    this.secondCard.flipToBackSide(() => { 
                        this.firstCard = null;
                        this.secondCard = null;
                        });
                    return;
                }
                GameManager.getInstance().updatePoint();
                SoundManager.getInstance().playSound('match');
                this.firstCard.hiddenCard(() => {});
                this.secondCard.hiddenCard(() => {
                    this.firstCard = null;
                    this.secondCard = null;
                });
              
              
            });
           
        }
    }
  
    onClearCards(){
        let children = this.node.children.slice();
        for (let child of children) {
            child.removeFromParent();
        }
    }
}

