import { _decorator, assetManager, Component, instantiate, Layout, Node, Prefab, Sprite, SpriteFrame, UITransform } from 'cc';
import { Card } from './Card';
const { ccclass, property } = _decorator;

interface PickedCard {
    index: number;
    card: Card;
}
@ccclass('CardManager')
export class CardManager extends Component {

    @property(Prefab)
    Card: Prefab = null;
    
    @property(SpriteFrame)
    animalSprites: SpriteFrame[] = [];

    cardValues: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
    cards: Card[];
    col: number = 3;
    row: number = 3;
    
    transform: UITransform;
    layout: Layout;

    firstCard: PickedCard = {
        index: null,
        card : new Card(),
    };
    
    secondCard = {
        index: null,
        card : new Card(),
    };


    onLoad(){
        // this.loadSprites();
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
    

    loadSprites()  {
        var self = this;
        assetManager.loadBundle('texture', (err, bundle) => {
            console.log(bundle)

            for(let i = 0; i < 15;i++){
                bundle.load(`${i+1}/spriteFrame`, SpriteFrame, function (err, spriteFrame) {
                    self.animalSprites.push(spriteFrame);
                    if(i === 14){
                        self.instanceCards();
                        self.randomizeChildren();
                    }
                });
            }
        });
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
        const shuffle = this.shuffleArray(this.cardValues);
        const result = shuffle.slice(0, nCouple)
        return shuffle.slice(0,nCouple);
    }

    instanceCard(index, spriteFrame, lockCard){
        const card = instantiate(this.Card);
        if(lockCard){
            card.getComponent(Card).initLockCard();
        }
        else{
            card.getComponent(Card).initCard(index, spriteFrame);
        }
        card.active = false;
        this.node.addChild(card);
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

  
}

