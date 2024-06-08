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

    currentPoint: number = 0;
    currentTurn: number = 0;

    selectedCards: Card[] = [];

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
            cardNode.getComponent(Card).initCard(index, spriteFrame, this.onClickCard.bind(this));
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

    onClickCard(card: Card): void {
        this.selectedCards.push(card);
        const selectedIndex = this.selectedCards.length - 1;
        this.selectedCards[selectedIndex].flipToFrontSide();
        if(selectedIndex % 2 !== 1) return;
        GameManager.getInstance().updateTurn();
        this.selectedCards[selectedIndex].flipToFrontSide(() => {
            if(!this.compareCard(this.selectedCards[selectedIndex-1],this.selectedCards[selectedIndex])){
                SoundManager.getInstance().playSound('reject');
                this.selectedCards[selectedIndex-1].flipToBackSide();
                this.selectedCards[selectedIndex].flipToBackSide();
                return
            }
            SoundManager.getInstance().playSound('match');
            GameManager.getInstance().updatePoint();
            this.selectedCards[selectedIndex-1].hiddenCard();
            this.selectedCards[selectedIndex].hiddenCard();
        });
    }
  
    onClearCards(){
        let children = this.node.children.slice();
        for (let child of children) {
            child.removeFromParent();
        }
    }
}

